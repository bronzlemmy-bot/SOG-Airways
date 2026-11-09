
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";
import { authService } from "../services/auth.service.js";

import type {
  LoginInput,
  ResendVerificationInput,
  RegisterInput,
  VerifyEmailInput,
} from "../validations/auth.validation.js";

/**
 * POST /api/v1/auth/register
 * Registers a new customer account.
 */
export const register: RequestHandler = asyncHandler(
  async (req, res) => {
    const input = req.body as RegisterInput;

    const result = await authService.register(input);

    res.status(201).json({
      success: true,
      message: "Your account was created. Enter the code sent to your email.",
      data: result,
    });
  },
);

/**
 * POST /api/v1/auth/verify-email
 * Verifies a customer email address using its one-time code.
 */
export const verifyEmail: RequestHandler = asyncHandler(
  async (req, res) => {
    const input = req.body as VerifyEmailInput;
    const result = await authService.verifyEmail(input);

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: result,
    });
  },
);

/**
 * POST /api/v1/auth/resend-verification
 * Sends a new email verification code when the account is eligible.
 */
export const resendVerificationEmail: RequestHandler = asyncHandler(
  async (req, res) => {
    const input = req.body as ResendVerificationInput;
    await authService.resendVerificationEmail(input);

    res.status(202).json({
      success: true,
      message:
        "If the address is eligible, verification instructions will be sent shortly.",
      data: null,
    });
  },
);

/**
 * POST /api/v1/auth/login
 * Authenticates a user and returns an access token.
 */
export const login: RequestHandler = asyncHandler(
  async (req, res) => {
    const input = req.body as LoginInput;

    const result = await authService.login(input);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  },
);

/**
 * GET /api/v1/auth/me
 * Returns the safe account summary for the authenticated user.
 */
export const getCurrentUser: RequestHandler = asyncHandler(
  async (_req, res) => {
    const authenticatedUser = res.locals.authenticatedUser as
      | { id?: string }
      | undefined;

    if (!authenticatedUser?.id) {
      throw new ApiError("Authentication is required.", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const user = await authService.getCurrentUser(authenticatedUser.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);
