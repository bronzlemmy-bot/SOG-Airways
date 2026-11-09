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
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
}

export default function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const { changePassword, loading, error } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [successMessage, setSuccessMessage] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrors({});
    setSuccessMessage("");

    const nextErrors: FormErrors = {};

    if (!currentPassword.trim()) {
      nextErrors.currentPassword =
        "Current password is required.";
    }

    const newPasswordResult =
      validatePassword(newPassword);

    if (!newPasswordResult.valid) {
      nextErrors.newPassword =
        newPasswordResult.message;
    }

    const confirmPasswordResult =
      validateConfirmPassword(
        newPassword,
        confirmPassword,
      );

    if (!confirmPasswordResult.valid) {
      nextErrors.confirmPassword =
        confirmPasswordResult.message;
    }

    if (currentPassword === newPassword) {
      nextErrors.newPassword =
        "New password must be different from your current password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setErrors({});
      setSuccessMessage(
        "Your password has been changed successfully.",
      );

      onSuccess?.();
    } catch {
      // The universal useAuth hook already stores
      // the API error in its error state.
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
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
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
        label="Current password"
        htmlFor="current-password"
        required
        error={errors.currentPassword}
      >
        <Input
          id="current-password"
          name="currentPassword"
          type={
            showCurrentPassword
              ? "text"
              : "password"
          }
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(event.target.value)
          }
          placeholder="Enter your current password"
          autoComplete="current-password"
          leftIcon={<LockKeyhole size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword(
                  (previous) => !previous,
                )
              }
              aria-label={
                showCurrentPassword
                  ? "Hide current password"
                  : "Show current password"
              }
              className="pointer-events-auto rounded-md p-1 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {showCurrentPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          }
        />
      </FormField>

      <FormField
        label="New password"
        htmlFor="new-password"
        required
        error={errors.newPassword}
        helperText="Use at least 8 characters with uppercase, lowercase, a number, and a special character."
      >
        <Input
          id="new-password"
          name="newPassword"
          type={
            showNewPassword
              ? "text"
              : "password"
          }
          value={newPassword}
          onChange={(event) =>
            setNewPassword(event.target.value)
          }
          placeholder="Enter your new password"
          autoComplete="new-password"
          leftIcon={<LockKeyhole size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  (previous) => !previous,
                )
              }
              aria-label={
                showNewPassword
                  ? "Hide new password"
                  : "Show new password"
              }
              className="pointer-events-auto rounded-md p-1 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {showNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          }
        />
      </FormField>

      <FormField
        label="Confirm new password"
        htmlFor="confirm-password"
        required
        error={errors.confirmPassword}
      >
        <Input
          id="confirm-password"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value,
            )
          }
          placeholder="Confirm your new password"
          autoComplete="new-password"
          leftIcon={<LockKeyhole size={18} />}
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
        />
      </FormField>

      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
      >
        Change password
      </PrimaryButton>
    </form>
  );
}