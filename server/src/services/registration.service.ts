import mongoose from "mongoose";
import { Competition } from "../models/Competition";
import { Registration } from "../models/Registration";

export class DuplicateRegistrationError extends Error {
  constructor() {
    super("You are already registered for this competition.");
    this.name = "DuplicateRegistrationError";
  }
}

export class CompetitionUnavailableError extends Error {
  constructor() {
    super("Competition registration is closed or full.");
    this.name = "CompetitionUnavailableError";
  }
}

export async function registerUser(
  competitionId: string,
  userId: string
) {
  const now = new Date();

  const existing = await Registration.exists({
    competitionId,
    userId,
    status: "REGISTERED",
  });

  if (existing) {
    throw new DuplicateRegistrationError();
  }

  const competition = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      registrationStart: { $lte: now },
      registrationEnd: { $gte: now },
      $expr: { $lt: ["$registeredCount", "$capacity"] },
    },
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  if (!competition) {
    throw new CompetitionUnavailableError();
  }

  try {
    await Registration.create({
      competitionId,
      userId,
      status: "REGISTERED",
    });
  } catch (error) {
    await Competition.updateOne(
      { _id: competitionId },
      { $inc: { registeredCount: -1 } }
    );

    const err = error as { code?: number };

    if (err.code === 11000) {
      throw new DuplicateRegistrationError();
    }

    throw error;
  }

  return competition;
}