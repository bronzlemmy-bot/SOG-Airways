
import type { RequestHandler } from "express";
import { ApiError } from "../utils/api-error.js";

interface AuthenticatedUserContext {
  id: string;
  role?: string;
  email?: string;
}

export function authorize(...allowedRoles: string[]): RequestHandler {
  if (allowedRoles.length === 0) {
    throw new Error(
      "authorize() requires at least one allowed role.",
    );
  }

  const normalizedRoles = new Set(
    allowedRoles.map((role) => role.trim().toLowerCase()),
  );

  if (normalizedRoles.has("")) {
    throw new Error("Allowed roles cannot be empty.");
  }

  return (_req, res, next) => {
    const user = res.locals
      .authenticatedUser as AuthenticatedUserContext | undefined;

    if (!user) {
      return next(
        new ApiError("Authentication is required.", 401, {
          code: "AUTHENTICATION_REQUIRED",
        }),
      );
    }

    if (!user.role) {
      return next(
        new ApiError("Your account does not have an assigned role.", 403, {
          code: "USER_ROLE_MISSING",
        }),
      );
    }

    const userRole = user.role.trim().toLowerCase();

    if (!normalizedRoles.has(userRole)) {
      return next(
        new ApiError("You do not have permission to perform this action.", 403, {
          code: "INSUFFICIENT_PERMISSIONS",
        }),
      );
    }

    return next();
  };
}
