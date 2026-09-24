# Feedants — Competition Platform (Assignment)

A full-stack competition-details demo: a React Native (Expo) client backed by an
Express + MongoDB + TypeScript API. Users can browse a live competition, see its
full lifecycle (registration / submission / results), and register for it —
with backend-enforced capacity, de-duplication, and status rules.

## Overview

- **Backend** exposes a read-only competition detail endpoint plus a
  registration endpoint. Lifecycle status is computed server-side and returned
  with every response — the client never derives it from dates.
- **Mobile app** renders a product-style competition screen driven entirely by
  the API: header, stats, dates, judge, description, judging parameters, rules,
  rewards and previous winners, plus a status-aware registration CTA.
- A bottom "switcher" strip lets you flip between the five seeded competitions,
  each demonstrating a different lifecycle state.

## Architecture

```
mobile/  (Expo / React Native, TypeScript)
  App.tsx                     -> fetches competition list, selects one, renders screen
  screens/CompetitionScreen.tsx -> detail screen + all loading/error/empty states
  components/                 -> StatusBadge, Stats, Dates, Judge, Rewards, Winners, RegisterBar, ...
  services/competitionApi.ts  -> typed axios client (list / get / register)
  types/competition.ts        -> API response types
  utils/format.ts             -> date / currency / image helpers

server/  (Express 5 / Mongoose / TypeScript)
  src/routes/competition.routes.ts   -> GET /, GET /:id, POST /:id/register
  src/controllers/competition.controller.ts
  src/services/competition.service.ts    -> lifecycle status + availability (server-side truth)
  src/services/registration.service.ts   -> atomic capacity + duplicate-safe registration
  src/models/Competition.ts / Registration.ts
  src/middleware/error.middleware.ts     -> JSON 400/409/500 for API consumers
  src/seed.ts                            -> seeds 5 competitions covering every lifecycle state
```

Flow: `App` → `listCompetitions()` → user picks a competition → `CompetitionScreen`
→ `getCompetition(id, userId)` → render → tap CTA → `registerCompetition(id, userId)`
→ refetch to reflect the new `isRegistered` / counts.

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Backend  | Node.js, Express 5, Mongoose 9, TypeScript, tsx        |
| Frontend | Expo SDK 57, React Native 0.86, React 19, axios        |
| Database | MongoDB (local, standalone)                            |

## Prerequisites

- Node.js 20+
- MongoDB running locally on `localhost:27017` (see MongoDB setup)
- Expo Go on a device, or an emulator / `expo start --web`

## MongoDB Setup

The server expects a local MongoDB. On Windows/macOS/Linux with MongoDB
installed:

```bash
# start the database (service or manual daemon), e.g.
mongod --dbpath ./data/db
```

Connection string is read from `MONGODB_URI` (default:
`mongodb://localhost:27017/`). `retryWrites=false` is used so it works on a
standalone instance (no replica set). No tables need to be created — Mongoose
creates collections/indexes automatically, including the unique
`(competitionId, userId)` index.

## Environment Variables

### `server/.env`

| Variable     | Example                             | Purpose            |
| ------------ | ----------------------------------- | ------------------ |
| `PORT`       | `5000`                              | API port           |
| `MONGODB_URI`| `mongodb://localhost:27017/`        | MongoDB connection |

### `mobile/.env` (optional — overrides defaults)

| Variable               | Default | Purpose                                |
| ---------------------- | ------- | -------------------------------------- |
| `EXPO_PUBLIC_API_URL`  | `http://localhost:5000/api` | API base URL |
| `EXPO_PUBLIC_USER_ID`  | `demo-user` | userId used for registrations |

> On a physical device, `localhost` points to the phone, so set
> `EXPO_PUBLIC_API_URL=http://<your-machine-lan-ip>:5000/api`.
> Android emulator: `http://10.0.2.2:5000/api`.

No secrets are committed. Add `.\server\.env` / `.\mobile\.env` locally from the
`.env.example` files.

## Setup & Commands

```bash
# --- Backend ---
cd server
npm install
cp .env.example .env          # then adjust if needed
npm run seed                  # seed 5 competitions across all lifecycle states
npm run dev                   # tsx watch on http://localhost:5000

# build (type-check + emit)
npm run build

# --- Mobile ---
cd ../mobile
npm install
cp .env.example .env          # set EXPO_PUBLIC_API_URL for your target
npm start                     # Expo dev server (scan QR in Expo Go)
npx tsc --noEmit              # typecheck
npx expo lint                 # lint
npx expo-doctor               # dependency/config health
npm run web                   # run in a browser for quick preview
```

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Path                     | Description                                                 |
| ------ | ------------------------ | ----------------------------------------------------------- |
| GET    | `/api/health`            | Liveness probe                                             |
| GET    | `/api/competitions`      | List summaries: `id`, `title`, `category`, `status`, `availability` |
| GET    | `/api/competitions/:id`  | Full detail; pass `?userId=` to include `user.isRegistered` |
| POST   | `/api/competitions/:id/register` | Body `{ "userId": "..." }` → `201` or a `4xx` JSON error |

### `GET /api/competitions/:id` response

```jsonc
{
  "competition": { /* all detail fields: title, prizePool, entryFee, dates,
                       judge, description, judgingParameters, rules,
                       rewards, previousWinners, ... */ },
  "status": "REGISTRATION_OPEN",        // UPCOMING | REGISTRATION_OPEN | SUBMISSION_OPEN | COMPLETED
  "availability": { "capacity": 20, "registered": 3, "remaining": 17, "isFull": false },
  "user": { "id": "demo-user", "isRegistered": false }
}
```

### Error responses

| Status | Scenario                                            |
| ------ | --------------------------------------------------- |
| 400    | Invalid competition id, or missing/empty `userId`    |
| 404    | Competition not found                               |
| 409    | Registration closed/full, or user already registered |
| 500    | Unexpected server error (JSON `{ "message": ... }`) |

## Registration Flow

1. Client calls `POST /api/competitions/:id/register` with `{ userId }`.
2. Server rejects a missing/blank `userId` (`400`).
3. Server checks for an existing active registration (`409` if present).
4. Server atomically increments `registeredCount` **only if** the registration
   window is open **and** `registeredCount < capacity` (single
   `findOneAndUpdate` with `$expr`).
5. Server inserts a `Registration` document; a duplicate-key error rolls the
   counter back and returns `409`.
6. On success the client refetches the competition, so the UI immediately shows
   "You're registered" and the updated count — this also survives a reload.

## Lifecycle Logic

Status is computed **only on the backend** (server clock), never re-derived in
the client (`getCompetitionStatus` in `competition.service.ts`):

```
now <  registrationStart        -> UPCOMING
now <= registrationEnd          -> REGISTRATION_OPEN
now <= submissionEnd            -> SUBMISSION_OPEN
otherwise                       -> COMPLETED
```

The registration endpoint is guarded by the same dates, so a `same` status can
never be contradicted by the CTA. The CTA responds to the backend status:

| Status            | CTA                                  |
| ----------------- | ------------------------------------ |
| UPCOMING          | `Registrations open <date>` (disabled) |
| REGISTRATION_OPEN | `Register now · ₹99` (enabled, unless full/already registered) |
| SUBMISSION_OPEN   | `Registrations closed` (disabled)    |
| COMPLETED         | `Competition completed` (disabled)   |

## Concurrency Strategy

Registration is safe under concurrent requests using two independent defenses:

1. **Atomic capacity check** — `Competition.findOneAndUpdate` increments
   `registeredCount` only when `$expr: [registeredCount, capacity]` holds,
   making the "last slot" reservation single-step. Oversubscription is
   impossible: N parallel requests for M remaining slots yields exactly M×`201`.
2. **Unique index** — `(competitionId, userId)` is unique on `Registration`, so
   a user can never register twice even when two requests race. The counter is
   rolled back on any insert failure so `registeredCount` always matches live
   documents.

Verified with a 20-way concurrent registration into 16 slots: exactly 16
accepted, 4 refused, final count `20/20`, and stored documents match the count.

## Assumptions

- Single-competition-detail product screen; competition id is discovered via the
  list endpoint rather than hard-coded.
- `userId` is passed by the client (no auth system in scope).
- Standalone MongoDB (no replica set), so multi-document transactions are not
  used.
- Registrations are not cancellable in this demo, so only `REGISTERED` status
  exists today.

## Technical Decisions

- **Server-computed status**: single source of truth; the client stays a pure
  renderer and cannot drift from the server's clock/dates.
- **Lean Mongoose queries** for reads; `exists()` instead of full doc loads for
  checks.
- **Typed API client + `ApiError`**: screens handle status (e.g. `404` vs
  `500`) without leaking axios.
- **No new RN dependencies**: UI is built with core `react-native` primitives
  (no navigation/state/animation libs) to keep the demo dependency-light.
- **Error middleware** turns Mongoose `CastError` and duplicate-key errors into
  clean JSON `4xx` responses instead of HTML 500s.

## Tradeoffs

- **Rollback-based de-dup**: fail the duplicate *after* incrementing, then
  decrement. Under a crash between the two steps the count could drift; the
  unique index still prevents real duplicates. A production system would use
  transactions or a reservation collection.
- **Statuses are date-range based**: during the (never-seeded here) gap between
  `registrationEnd` and `submissionStart`, the status is `SUBMISSION_OPEN`
  (registrations closed, submissions not yet open) because there is no separate
  "CLOSED" status.
- **Manual userId**: there is no auth; `userId` is trusted as provided.

## Production Improvements

- Add authentication (JWT/session) and derive `userId` from the token.
- Move to a MongoDB replica set and wrap register in a transaction (or use a
  single `findAndModify` on a reservation doc).
- Add idempotency to the register endpoint and support cancelling registrations
  with a seat-release flow.
- Paginate the competition list; cache hot reads (Redis/CDN).
- Add rate limiting, request validation (zod), and structured logging.
- Store submission/results models and a scheduled job to transition statuses
  explicitly.
- E2E UI tests (Detox/Maestro) plus API contract tests.