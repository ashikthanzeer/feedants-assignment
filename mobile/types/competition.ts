export interface Judge {
  name: string;
  role: string;
  experience: string;
  image?: string;
}

export interface Reward {
  position: number;
  label: string;
  amount: number;
}

export interface Winner {
  name: string;
  position: string;
  image?: string;
}

export interface Competition {
  _id: string;
  title: string;
  category: string;
  type: string;

  prizePool: number;
  entryFee: number;

  capacity: number;
  registeredCount: number;

  registrationStart: string;
  registrationEnd: string;

  submissionStart: string;
  submissionEnd: string;

  resultDate: string;

  judge: Judge;

  description: string;
  judgingParameters: string[];
  rules: string[];

  rewards: Reward[];
  previousWinners: Winner[];
}

export type CompetitionStatus =
  | "UPCOMING"
  | "REGISTRATION_OPEN"
  | "SUBMISSION_OPEN"
  | "COMPLETED";

export interface CompetitionAvailability {
  capacity: number;
  registered: number;
  remaining: number;
  isFull: boolean;
}

export interface CompetitionResponse {
  competition: Competition;
  status: CompetitionStatus;
  availability: CompetitionAvailability;

  user: {
    id: string | null;
    isRegistered: boolean;
  };
}

export interface CompetitionSummary {
  id: string;
  title: string;
  category: string;
  status: CompetitionStatus;
  availability: CompetitionAvailability;
}

export interface CompetitionSummaryResponse {
  competitions: CompetitionSummary[];
}