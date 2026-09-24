import { ICompetition } from "../models/Competition";

export type CompetitionStatus =
  | "UPCOMING"
  | "REGISTRATION_OPEN"
  | "SUBMISSION_OPEN"
  | "COMPLETED";

export function getCompetitionStatus(
  competition: ICompetition,
  now = new Date()
): CompetitionStatus {
  if (now < competition.registrationStart) {
    return "UPCOMING";
  }

  if (now <= competition.registrationEnd) {
    return "REGISTRATION_OPEN";
  }

  if (now <= competition.submissionEnd) {
    return "SUBMISSION_OPEN";
  }

  return "COMPLETED";
}

export function getCompetitionAvailability(competition: ICompetition) {
  const remaining = Math.max(
    competition.capacity - competition.registeredCount,
    0
  );

  return {
    capacity: competition.capacity,
    registered: competition.registeredCount,
    remaining,
    isFull: remaining === 0,
  };
}

export function getCompetitionSummary(competition: ICompetition) {
  return {
    id: competition._id,
    title: competition.title,
    category: competition.category,
    status: getCompetitionStatus(competition),
    availability: getCompetitionAvailability(competition),
  };
}