import type { UserGender } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: UserGender;
}

export type AuthUserRole =
  | "customer"
  | "staff"
  | "admin"
  | "super_admin";

export type AuthUserStatus =
  | "active"
  | "pending_verification"
  | "suspended"
  | "deactivated";

export interface AuthUserSummary {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: UserGender;
  role: AuthUserRole;
  status: AuthUserStatus;
  emailVerifiedAt: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
}

export interface AuthResponse {
  user: AuthUserSummary;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  email: string;
  verificationRequired: true;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}