
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import {
  authRateLimiter,
  emailVerificationRateLimiter,
  resendVerificationRateLimiter,
} from "../../../middleware/rate-limit.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  login,
  register,
  getCurrentUser,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller.js";

import {
  loginSchema,
  resendVerificationSchema,
  registerSchema,
  verifyEmailSchema,
} from "../validations/auth.validation.js";

const router = Router();

/**
 * GET /api/v1/auth/me
 * Retrieve the currently authenticated account.
 */
router.get("/me", authenticate, getCurrentUser);

/**
 * POST /api/v1/auth/register
 * Register a new customer account.
 */
router.post(
  "/register",
  authRateLimiter,
  validateRequest({
    body: registerSchema,
  }),
  register,
);

/**
 * POST /api/v1/auth/verify-email
 * Verify an account using the short-lived email OTP.
 */
router.post(
  "/verify-email",
  emailVerificationRateLimiter,
  validateRequest({ body: verifyEmailSchema }),
  verifyEmail,
);

/**
 * POST /api/v1/auth/resend-verification
 * Resend an email OTP with enumeration-safe responses.
 */
router.post(
  "/resend-verification",
  resendVerificationRateLimiter,
  validateRequest({ body: resendVerificationSchema }),
  resendVerificationEmail,
);

/**
 * POST /api/v1/auth/login
 * Authenticate an existing user.
 */
router.post(
  "/login",
  authRateLimiter,
  validateRequest({
    body: loginSchema,
  }),
  login,
);

export default router;
