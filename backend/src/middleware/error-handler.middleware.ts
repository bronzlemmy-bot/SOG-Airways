
import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

const isProduction = process.env.NODE_ENV === "production";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred.";
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    code = error.code;

    message =
      isProduction && statusCode >= 500
        ? "An unexpected error occurred."
        : error.message;

    if (statusCode < 500) {
      details = error.details;
    }
  } else if (error instanceof ZodError) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Request validation failed.";

    details = error.issues.map((issue) => ({
      field: issue.path.map(String).join("."),
      message: issue.message,
    }));
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = "DATABASE_VALIDATION_ERROR";
    message = "The supplied data is invalid.";

    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    code = "INVALID_DATABASE_VALUE";
    message = "An invalid value was supplied.";

    details = {
      field: error.path,
    };
  } else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    statusCode = 409;
    code = "DUPLICATE_RECORD";
    message = "A record with one or more unique fields already exists.";

    if ("keyValue" in error && typeof error.keyValue === "object") {
      details = {
        fields: Object.keys(error.keyValue ?? {}),
      };
    }
  } else if (error instanceof Error) {
    if (!isProduction) {
      message = error.message;
    }

    console.error("[SOG Airways API Error]", error);
  } else {
    console.error("[SOG Airways API Error]", error);
  }

  if (statusCode >= 500 && !(error instanceof ApiError)) {
    console.error("[SOG Airways API Error] Unexpected server failure.");
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  });
};
