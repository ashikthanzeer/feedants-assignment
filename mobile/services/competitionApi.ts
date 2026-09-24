import axios, { isAxiosError } from "axios";

import {
  CompetitionResponse,
  CompetitionSummary,
  CompetitionSummaryResponse,
} from "../types/competition";

export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
  "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new ApiError(status, message);
  }

  return new ApiError(
    0,
    error instanceof Error ? error.message : "Unexpected error"
  );
}

export async function listCompetitions(): Promise<CompetitionSummary[]> {
  try {
    const response = await axios.get<CompetitionSummaryResponse>(
      `${API_BASE_URL}/competitions`
    );

    return response.data.competitions;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getCompetition(
  competitionId: string,
  userId?: string
): Promise<CompetitionResponse> {
  try {
    const response = await axios.get<CompetitionResponse>(
      `${API_BASE_URL}/competitions/${competitionId}`,
      {
        params: userId ? { userId } : undefined,
      }
    );

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function registerCompetition(
  competitionId: string,
  userId: string
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/competitions/${competitionId}/register`,
      { userId }
    );

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}