
import type {
  UserRole,
  UserStatus,
} from "../../users/models/user.model.js";

/**
 * Claims included in a SOG Airways access token.
 * The subject (sub) identifies the authenticated user.
 */
export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
  emailVerified?: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Authenticated user's identity available to application code.
 */
export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
}

/**
 * Safe user information returned by registration and login.
 * Never include passwordHash in authentication responses.
 */
export interface AuthUserSummary {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Access-token details returned to the client.
 */
export interface AuthTokens {
  accessToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
}

/**
 * Standard authentication result.
 */
export interface AuthResult {
  user: AuthUserSummary;
  tokens: AuthTokens;
}

/**
 * Registration and login response data.
 */
export interface AuthResponseData extends AuthResult {}

export interface RegistrationResult {
  email: string;
  verificationRequired: true;
}

export interface EmailVerificationResult {
  email: string;
  verified: true;
}
