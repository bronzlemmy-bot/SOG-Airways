"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { validateLoginForm } from "@/lib/validations/authentication";

import Input from "@/components/forms/Input";
import FormField from "@/components/forms/FormField";
import FormError from "@/components/forms/FormError";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm({
  onSuccess,
}: LoginFormProps) {
  const {
    login,
    loading,
    error,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [errors, setErrors] =
    useState<FormErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrors({});
    clearError();

    const validationResult =
      validateLoginForm(
        email,
        password,
      );

    if (!validationResult.valid) {
      const nextErrors: FormErrors = {};

      if (!email.trim()) {
        nextErrors.email =
          "Email address is required.";
      } else if (
        validationResult.message?.toLowerCase().includes("email")
      ) {
        nextErrors.email =
          validationResult.message;
      } else if (!password) {
        nextErrors.password =
          validationResult.message;
      }

      if (
        !nextErrors.email &&
        !password
      ) {
        nextErrors.password =
          "Password is required.";
      }

      setErrors(nextErrors);
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });

      onSuccess?.();
    } catch {
      // useAuth stores the API error.
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full space-y-6"
    >
      {error && (
        <FormError message={error} />
      )}

      <FormField
        label="Email address"
        htmlFor="login-email"
        required
        error={errors.email}
      >
        <Input
          id="login-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);

            if (errors.email) {
              setErrors((previous) => ({
                ...previous,
                email: undefined,
              }));
            }
          }}
          placeholder="Enter your email address"
          autoComplete="email"
          leftIcon={<Mail size={18} />}
          aria-invalid={Boolean(
            errors.email,
          )}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="login-password"
        required
        error={errors.password}
      >
        <Input
          id="login-password"
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);

            if (errors.password) {
              setErrors((previous) => ({
                ...previous,
                password: undefined,
              }));
            }
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
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

      <div className="flex flex-wrap justify-between gap-4">
        <Link
          href="/verify-email"
          className="text-sm font-semibold text-slate-900 transition hover:text-slate-600"
        >
          Verify your email
        </Link>
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-slate-900 transition hover:text-slate-600"
        >
          Forgot password?
        </Link>
      </div>

      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
      >
        Sign in
      </PrimaryButton>
    </form>
  );
}