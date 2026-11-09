"use client";

import { useCallback, useState } from "react";

import { authService } from "@/services/authService";

import type {
  AuthUserSummary,
  AuthResponse,
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  RegisterResponse,
  RegisterData,
  ResetPasswordData,
} from "@/types";

interface UseAuthState {
  user: AuthUserSummary | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ): Promise<AuthResponse> => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const response =
          await authService.login(credentials);

        setState({
          user: response.user,
          loading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to log in.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const register = useCallback(
    async (
      data: RegisterData,
    ): Promise<RegisterResponse> => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const response =
          await authService.register(data);

        setState({
          user: null,
          loading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create account.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const fetchCurrentUser = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const user =
        await authService.getCurrentUser();

      setState({
        user,
        loading: false,
        error: null,
      });

      return user;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch current user.";

      setState((previous) => ({
        ...previous,
        user: null,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await authService.logout();

      setState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to log out.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const forgotPassword = useCallback(
    async (data: ForgotPasswordData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await authService.forgotPassword(data);

        setState((previous) => ({
          ...previous,
          loading: false,
          error: null,
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to request password reset.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await authService.resetPassword(data);

        setState((previous) => ({
          ...previous,
          loading: false,
          error: null,
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to reset password.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (data: ChangePasswordData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await authService.changePassword(data);

        setState((previous) => ({
          ...previous,
          loading: false,
          error: null,
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to change password.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await authService.verifyEmail(email, code);

        setState((previous) => ({
          ...previous,
          loading: false,
          error: null,
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to verify email.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const resendVerificationEmail = useCallback(
    async (email: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await authService.resendVerificationEmail(
          email,
        );

        setState((previous) => ({
          ...previous,
          loading: false,
          error: null,
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to resend verification email.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  const clearUser = useCallback(() => {
    setState((previous) => ({
      ...previous,
      user: null,
    }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    fetchCurrentUser,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    clearError,
    clearUser,
  };
}