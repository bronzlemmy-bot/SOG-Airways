import { apiService, clearAccessToken, setAccessToken, ApiError } from "./api";

import type {
  AuthResponse,
  AuthUserSummary,
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  RefreshTokenResponse,
  RegisterData,
  RegisterResponse,
  ResetPasswordData,
} from "@/types";

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      {
        email: credentials.email,
        password: credentials.password,
      },
    );
    setAccessToken(response.tokens.accessToken);
    return response;
  },

  async register(
    data: RegisterData,
  ): Promise<RegisterResponse> {
    return apiService.post<RegisterResponse>(
      "/auth/register",
      {
        firstName: data.firstName,
        ...(data.middleName ? { middleName: data.middleName } : {}),
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        ...(data.phone ? { phoneNumber: data.phone } : {}),
        ...(data.dateOfBirth ? { dateOfBirth: data.dateOfBirth } : {}),
        ...(data.gender ? { gender: data.gender } : {}),
      },
    );
  },

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    return apiService.get<AuthResponse["user"]>("/auth/me");
  },

  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileInput,
  ): Promise<AuthUserSummary> {
    return apiService.patch<AuthUserSummary>(
      `/users/${encodeURIComponent(userId)}`,
      data,
    );
  },

  async logout(): Promise<void> {
    clearAccessToken();
  },

  async refreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    void refreshToken;
    throw new ApiError("Token refresh is not implemented by the backend.", 501);
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    void data;
    throw new ApiError("Password reset is not implemented by the backend.", 501);
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    void data;
    throw new ApiError("Password reset is not implemented by the backend.", 501);
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    void data;
    throw new ApiError("Password change is not implemented by the backend.", 501);
  },

  async verifyEmail(email: string, code: string): Promise<void> {
    await apiService.post<void>("/auth/verify-email", { email, code });
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await apiService.post<void>("/auth/resend-verification", { email });
  },
};