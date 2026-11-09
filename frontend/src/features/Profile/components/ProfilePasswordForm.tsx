
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";

export interface ProfilePasswordValues {
  currentPassword: string;
  newPassword: string;
}

interface ProfilePasswordFormProps {
  onSubmit: (values: ProfilePasswordValues) => void | Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  error?: string;
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  placeholder: string;
  error?: string;
  autoComplete: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

function PasswordField({
  id,
  label,
  value,
  visible,
  placeholder,
  error,
  autoComplete,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 dark:border-slate-700"
          }`}
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProfilePasswordForm({
  onSubmit,
  onCancel,
  isSaving = false,
  error,
}: ProfilePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submittedErrors, setSubmittedErrors] = useState<
    Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>
  >({});

  const [submitError, setSubmitError] = useState("");

  const requirements = [
    {
      label: "At least 8 characters",
      met: newPassword.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(newPassword),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(newPassword),
    },
    {
      label: "One number",
      met: /\d/.test(newPassword),
    },
  ];

  const strength = requirements.filter((item) => item.met).length;
  const strengthLabel = ["Not set", "Weak", "Fair", "Good", "Strong"][strength];

  const validate = () => {
    const nextErrors: typeof submittedErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword = "Enter your current password.";
    }

    if (!newPassword) {
      nextErrors.newPassword = "Enter your new password.";
    } else {
      if (newPassword.length < 8) {
        nextErrors.newPassword = "Your new password must contain at least 8 characters.";
      } else if (!/[A-Z]/.test(newPassword)) {
        nextErrors.newPassword = "Add at least one uppercase letter.";
      } else if (!/[a-z]/.test(newPassword)) {
        nextErrors.newPassword = "Add at least one lowercase letter.";
      } else if (!/\d/.test(newPassword)) {
        nextErrors.newPassword = "Add at least one number.";
      } else if (newPassword === currentPassword) {
        nextErrors.newPassword = "Your new password must differ from your current password.";
      }
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your new password.";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "The passwords do not match.";
    }

    setSubmittedErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving || !validate()) return;

    setSubmitError("");

    try {
      await onSubmit({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmittedErrors({});
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch {
      setSubmitError("The password could not be updated. Please try again.");
    }
  };

  const handleCancel = () => {
    if (isSaving) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSubmittedErrors({});
    setSubmitError("");
    onCancel();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-5 py-6 dark:border-slate-800 dark:from-blue-950/30 dark:via-slate-950 dark:to-indigo-950/20 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <KeyRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Change Password
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Update your password regularly to help keep your SOG Airways account secure.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
              Protect your account
            </p>
            <p className="mt-1 text-sm leading-6 text-blue-800/80 dark:text-blue-300/80">
              Choose a password you do not use for other accounts. Never share your password with anyone.
            </p>
          </div>
        </div>

        <PasswordField
          id="profile-current-password"
          label="Current Password"
          value={currentPassword}
          visible={showCurrentPassword}
          placeholder="Enter your current password"
          autoComplete="current-password"
          error={submittedErrors.currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            setSubmittedErrors((previous) => ({
              ...previous,
              currentPassword: undefined,
            }));
            setSubmitError("");
          }}
          onToggleVisibility={() => setShowCurrentPassword((value) => !value)}
        />

        <div className="space-y-4">
          <PasswordField
            id="profile-new-password"
            label="New Password"
            value={newPassword}
            visible={showNewPassword}
            placeholder="Enter your new password"
            autoComplete="new-password"
            error={submittedErrors.newPassword}
            onChange={(value) => {
              setNewPassword(value);
              setSubmittedErrors((previous) => ({
                ...previous,
                newPassword: undefined,
                confirmPassword: undefined,
              }));
              setSubmitError("");
            }}
            onToggleVisibility={() => setShowNewPassword((value) => !value)}
          />

          {newPassword && (
            <div aria-live="polite" className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Password strength
                </span>
                <span
                  className={`text-xs font-bold ${
                    strength <= 1
                      ? "text-red-600 dark:text-red-400"
                      : strength === 2
                        ? "text-amber-600 dark:text-amber-400"
                        : strength === 3
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {strengthLabel}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {requirements.map((requirement, index) => (
                  <div
                    key={requirement.label}
                    className={`h-1.5 rounded-full transition-colors ${
                      index < strength
                        ? strength <= 1
                          ? "bg-red-500"
                          : strength === 2
                            ? "bg-amber-500"
                            : strength === 3
                              ? "bg-blue-500"
                              : "bg-emerald-500"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {requirements.map((requirement) => (
                  <li
                    key={requirement.label}
                    className={`flex items-center gap-2 text-xs ${
                      requirement.met
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Check
                      className={`h-3.5 w-3.5 ${
                        requirement.met ? "" : "opacity-30"
                      }`}
                    />
                    {requirement.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <PasswordField
          id="profile-confirm-password"
          label="Confirm New Password"
          value={confirmPassword}
          visible={showConfirmPassword}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          error={submittedErrors.confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setSubmittedErrors((previous) => ({
              ...previous,
              confirmPassword: undefined,
            }));
            setSubmitError("");
          }}
          onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
        />

        {(error || submitError) && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error || submitError}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            aria-busy={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {isSaving ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </motion.section>
  );
}
