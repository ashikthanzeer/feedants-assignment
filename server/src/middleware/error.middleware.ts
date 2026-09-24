import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid resource id",
    });
  }

  const errorCode = (error as { code?: number }).code;

  if (errorCode === 11000) {
    return res.status(409).json({
      message: "Duplicate record",
    });
  }

  console.error("Unhandled error:", error);

  res.status(500).json({
    message: "Internal server error",
  });
}