import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { Competition } from "../models/Competition";
import { Registration } from "../models/Registration";

import {
  getCompetitionStatus,
  getCompetitionAvailability,
  getCompetitionSummary,
} from "../services/competition.service";

import {
  registerUser,
  DuplicateRegistrationError,
  CompetitionUnavailableError,
} from "../services/registration.service";

function isValidCompetitionId(id: string) {
  return mongoose.isValidObjectId(id);
}

export async function listCompetitions(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const competitions = await Competition.find()
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      competitions: competitions.map(getCompetitionSummary),
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompetition(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);

    if (!isValidCompetitionId(id)) {
      return res.status(400).json({
        message: "Invalid competition id",
      });
    }

    const userId =
      typeof req.query.userId === "string"
        ? req.query.userId
        : undefined;

    const competition = await Competition.findById(id).lean();

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    const status = getCompetitionStatus(competition);
    const availability = getCompetitionAvailability(competition);

    let isRegistered = false;

    if (userId) {
      isRegistered = !!(await Registration.exists({
        competitionId: competition._id,
        userId,
        status: "REGISTERED",
      }));
    }

    res.json({
      competition,
      status,
      availability,
      user: {
        id: userId ?? null,
        isRegistered,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function registerCompetition(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);

    if (!isValidCompetitionId(id)) {
      return res.status(400).json({
        message: "Invalid competition id",
      });
    }

    const userId = (req.body as { userId?: unknown } | undefined)?.userId;

    if (typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const competition = await registerUser(id, userId.trim());

    res.status(201).json({
      message: "Successfully registered",
      competition: {
        id: competition._id,
        registeredCount: competition.registeredCount,
        capacity: competition.capacity,
        remaining:
          competition.capacity - competition.registeredCount,
      },
    });
  } catch (error) {
    if (error instanceof DuplicateRegistrationError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (error instanceof CompetitionUnavailableError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    next(error);
  }
}