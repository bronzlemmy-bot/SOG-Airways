"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  validateConfirmPassword,
  validatePassword,
} from "@/lib/validations/authentication";

import Input from "@/components/forms/Input";
import FormField from "@/components/forms/FormField";
import FormError from "@/components/forms/FormError";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function ResetPasswordForm({
  token,
  onSuccess,
}: ResetPasswordFormProps) {
  const {
    resetPassword,
    loading,
    error,
    clearError,
  } = useAuth();

  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrors({});
    setSuccessMessage("");
    clearError();

    if (!token.trim()) {
      setErrors({
        form:
          "This password reset link is invalid or has expired.",
      });
      return;
    }

    const nextErrors: FormErrors = {};

    const passwordResult =
      validatePassword(password);

    if (!passwordResult.valid) {
      nextErrors.password =
        passwordResult.message;
    }

    const confirmPasswordResult =
      validateConfirmPassword(
        password,
        confirmPassword,
      );

    if (!confirmPasswordResult.valid) {
      nextErrors.confirmPassword =
        confirmPasswordResult.message;
    }

    if (
      Object.keys(nextErrors).length > 0
    ) {
      setErrors(nextErrors);
      return;
    }

    try {
      await resetPassword({
        token: token.trim(),
        password,
        confirmPassword,
      });

      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setSuccessMessage(
        "Your password has been reset successfully.",
      );

      onSuccess?.();
    } catch {
      // useAuth stores the API error.
    }
  };

  const formError =
    errors.form ?? error ?? undefined;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full space-y-6"
    >
      {formError && (
        <FormError message={formError} />
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <FormField
        label="New password"
        htmlFor="reset-password"
        required
        error={errors.password}
        helperText="Use at least 8 characters with uppercase, lowercase, a number, and a special character."
      >
        <Input
          id="reset-password"
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={password}
          onChange={(event) => {
            setPassword(
              event.target.value,
            );

            if (errors.password) {
              setErrors((previous) => ({
                ...previous,
                password: undefined,
              }));
            }
          }}
          placeholder="Enter your new password"
          autoComplete="new-password"
          leftIcon={
            <LockKeyhole size={18} />
          }
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous,
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="pointer-events-auto rounded-md p-1 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          }
          aria-invalid={Boolean(
            errors.password,
          )}
        />
      </FormField>

      <FormField
        label="Confirm new password"
        htmlFor="reset-confirm-password"
        required
        error={errors.confirmPassword}
      >
        <Input
          id="reset-confirm-password"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(
              event.target.value,
            );

            if (errors.confirmPassword) {
              setErrors((previous) => ({
                ...previous,
                confirmPassword:
                  undefined,
              }));
            }
          }}
          placeholder="Confirm your new password"
          autoComplete="new-password"
          leftIcon={
            <LockKeyhole size={18} />
          }
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous,
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
              className="pointer-events-auto rounded-md p-1 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          }
          aria-invalid={Boolean(
            errors.confirmPassword,
          )}
        />
      </FormField>

      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
      >
        Reset password
      </PrimaryButton>
    </form>
  );
}