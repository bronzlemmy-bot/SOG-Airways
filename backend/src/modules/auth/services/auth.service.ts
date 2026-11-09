
import { createHmac, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../../config/index.js";
import { ApiError } from "../../../utils/api-error.js";
import { emailProvider, type EmailProvider } from "../../../integrations/email/email.provider.js";
import { userRepository } from "../../users/repositories/user.repository.js";
import { userService } from "../../users/services/user.service.js";

import type {
  AuthResult,
  AuthUserSummary,
  EmailVerificationResult,
  RegistrationResult,
} from "../types/auth.types.js";
import type {
  LoginInput,
  ResendVerificationInput,
  RegisterInput,
  VerifyEmailInput,
} from "../validations/auth.validation.js";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const TOKEN_ISSUER = "sog-airways-api";
const TOKEN_AUDIENCE = "sog-airways-client";
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;

/**
 * Retrieves the configured JWT signing secret.
 */
function getJwtSecret(): string {
  if (!env.JWT_SECRET) {
    throw new ApiError(
      "Authentication is not configured on the server.",
      500,
      {
        code: "AUTH_CONFIGURATION_ERROR",
        isOperational: false,
      },
    );
  }

  return env.JWT_SECRET;
}

/**
 * Converts a database user document into safe public user data.
 * Password hashes are never included in the response.
 */
function toAuthUserSummary(user: {
  _id: { toString(): string };
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: AuthUserSummary["gender"];
  role: AuthUserSummary["role"];
  status: AuthUserSummary["status"];
  emailVerifiedAt: Date | null;
  createdAt?: Date;
  lastLoginAt?: Date | null;
}): AuthUserSummary {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    ...(user.middleName ? { middleName: user.middleName } : {}),
    lastName: user.lastName,
    email: user.email,
    ...(user.phoneNumber
      ? { phoneNumber: user.phoneNumber }
      : {}),
    ...(user.dateOfBirth
      ? { dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10) }
      : {}),
    ...(user.gender ? { gender: user.gender } : {}),
    role: user.role,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    ...(user.createdAt ? { createdAt: user.createdAt.toISOString() } : {}),
    ...(user.lastLoginAt
      ? { lastLoginAt: user.lastLoginAt.toISOString() }
      : {}),
  };
}

/**
 * Creates a signed access token and a safe authentication response.
 */
function createAuthResult(user: {
  _id: { toString(): string };
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: AuthUserSummary["gender"];
  role: AuthUserSummary["role"];
  status: AuthUserSummary["status"];
  emailVerifiedAt: Date | null;
  createdAt?: Date;
  lastLoginAt?: Date | null;
}): AuthResult {
  const accessToken = jwt.sign(
    {
      role: user.role,
      email: user.email,
      emailVerified: user.emailVerifiedAt !== null,
    },
    getJwtSecret(),
    {
      subject: user._id.toString(),
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    },
  );

  return {
    user: toAuthUserSummary(user),
    tokens: {
      accessToken,
      tokenType: "Bearer",
      expiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
    },
  };
}

function hashVerificationCode(email: string, code: string): string {
  return createHmac("sha256", getJwtSecret())
    .update(`email-verification:${email}:${code}`)
    .digest("hex");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character]!;
  });
}

export function createAuthService(
  provider: EmailProvider = emailProvider,
) {
  const requireEmailProvider = () => {
    if (!provider.isEnabled) {
      throw new ApiError(
        "Email verification is not configured. Contact the site administrator.",
        503,
        { code: "EMAIL_DELIVERY_NOT_CONFIGURED" },
      );
    }

    getJwtSecret();
  };

  const issueVerificationCode = async (
    user: {
      _id: { toString(): string };
      email: string;
      firstName: string;
    },
    enforceCooldown: boolean,
  ): Promise<boolean> => {
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const codeHash = hashVerificationCode(user.email, code);
    const now = new Date();
    const challenge = await userRepository.setEmailVerificationChallenge(
      user._id.toString(),
      codeHash,
      new Date(now.getTime() + VERIFICATION_CODE_TTL_MS),
      now,
      enforceCooldown
        ? new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS)
        : undefined,
    );

    if (!challenge) {
      return false;
    }

    const escapedName = escapeHtml(user.firstName);
    try {
      const delivery = await provider.sendEmail({
        to: [{ email: user.email, name: user.firstName }],
        subject: "Your SOG Airways verification code",
        text: `Hello ${user.firstName},\n\nYour SOG Airways email verification code is ${code}. It expires in 10 minutes. If you did not create an account, you can ignore this email.`,
        html: `<p>Hello ${escapedName},</p><p>Your SOG Airways email verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes. If you did not create an account, you can ignore this email.</p>`,
      });

      if (!delivery.success) {
        throw new Error("Email provider did not accept the message.");
      }
    } catch (error) {
      await userRepository.clearEmailVerificationChallenge(
        user._id.toString(),
        codeHash,
      );

      throw new ApiError(
        "The verification email could not be sent. Please try again shortly.",
        503,
        {
          code: "EMAIL_DELIVERY_FAILED",
          cause: error,
        },
      );
    }

    return true;
  };

  return {
    /**
     * Creates a pending customer account and emails a one-time verification code.
     */
    async register(input: RegisterInput): Promise<RegistrationResult> {
      requireEmailProvider();

      const user = await userService.createCustomerUser(input);
      const codeSent = await issueVerificationCode(user, false);

      if (!codeSent) {
        throw new ApiError(
          "The account could not be prepared for email verification.",
          409,
          { code: "EMAIL_VERIFICATION_CHALLENGE_UNAVAILABLE" },
        );
      }

      return {
        email: user.email,
        verificationRequired: true,
      };
    },

    async verifyEmail(
      input: VerifyEmailInput,
    ): Promise<EmailVerificationResult> {
      const email = input.email.trim().toLowerCase();
      const codeHash = hashVerificationCode(email, input.code);
      const now = new Date();
      const user = await userRepository.verifyEmailWithOtp(
        email,
        codeHash,
        now,
      );

      if (!user) {
        await userRepository.incrementEmailVerificationAttempts(email, now);
        throw new ApiError(
          "The verification code is invalid or expired.",
          400,
          { code: "INVALID_OR_EXPIRED_VERIFICATION_CODE" },
        );
      }

      return { email: user.email, verified: true };
    },

    async resendVerificationEmail(
      input: ResendVerificationInput,
    ): Promise<void> {
      requireEmailProvider();

      const user = await userRepository.findByEmail(input.email);
      if (
        !user ||
        user.role !== "customer" ||
        (user.status !== "pending_verification" &&
          user.status !== "active") ||
        user.emailVerifiedAt
      ) {
        return;
      }

      await issueVerificationCode(user, true);
    },

    /**
     * Verifies login credentials and returns an access token.
     */
    async login(input: LoginInput): Promise<AuthResult> {
      const email = input.email.trim().toLowerCase();

      const user = await userRepository.findByEmailWithPasswordHash(email);

      // Use the same response for an unknown email and a wrong password.
      if (!user) {
        throw new ApiError("Invalid email or password.", 401, {
          code: "INVALID_CREDENTIALS",
        });
      }

      const passwordMatches = await bcrypt.compare(
        input.password,
        user.passwordHash,
      );

      if (!passwordMatches) {
        throw new ApiError("Invalid email or password.", 401, {
          code: "INVALID_CREDENTIALS",
        });
      }

      if (user.role === "customer" && !user.emailVerifiedAt) {
        throw new ApiError(
          "Verify your email address before signing in.",
          403,
          { code: "EMAIL_NOT_VERIFIED" },
        );
      }

      if (user.status !== "active") {
        throw new ApiError(
          "This account is not currently available for login.",
          403,
          {
            code: "ACCOUNT_NOT_ACTIVE",
          },
        );
      }

      await userRepository.updateById(user._id.toString(), {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      });

      return createAuthResult(user);
    },

    async getCurrentUser(userId: string): Promise<AuthUserSummary> {
      const user = await userRepository.findById(userId);

      if (!user || user.status !== "active") {
        throw new ApiError("The authenticated account is not available.", 401, {
          code: "ACCOUNT_NOT_AVAILABLE",
        });
      }

      return toAuthUserSummary(user);
    },
  };
}

export const authService = createAuthService();
