
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

interface AuthenticatedUserContext {
  id: string;
  role?: string;
  email?: string;
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization) {
    return next(
      new ApiError("Authentication is required.", 401, {
        code: "AUTHENTICATION_REQUIRED",
      }),
    );
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorization);

  if (!match) {
    return next(
      new ApiError("A valid Bearer token is required.", 401, {
        code: "INVALID_AUTHORIZATION_HEADER",
      }),
    );
  }

  if (!env.JWT_SECRET) {
    return next(
      new ApiError("Authentication is not configured.", 500, {
        code: "AUTH_CONFIGURATION_ERROR",
        isOperational: false,
      }),
    );
  }

  try {
    const payload = jwt.verify(match[1], env.JWT_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      payload.sub.trim() === ""
    ) {
      return next(
        new ApiError("The authentication token is invalid.", 401, {
          code: "INVALID_TOKEN_PAYLOAD",
        }),
      );
    }

    if (payload.role === "customer" && payload.emailVerified === false) {
      return next(
        new ApiError("Email verification is required.", 401, {
          code: "EMAIL_NOT_VERIFIED",
        }),
      );
    }

    const authenticatedUser: AuthenticatedUserContext = {
      id: payload.sub,
    };

    if (typeof payload.role === "string") {
      authenticatedUser.role = payload.role;
    }

    if (typeof payload.email === "string") {
      authenticatedUser.email = payload.email;
    }

    res.locals.authenticatedUser = authenticatedUser;

    return next();
  } catch {
    return next(
      new ApiError("The authentication token is invalid or has expired.", 401, {
        code: "INVALID_OR_EXPIRED_TOKEN",
      }),
    );
  }
};
