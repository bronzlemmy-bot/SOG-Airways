"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { validateEmail } from "@/lib/validations/authentication";

import Input from "@/components/forms/Input";
import FormField from "@/components/forms/FormField";
import FormError from "@/components/forms/FormError";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordForm({
  onSuccess,
}: ForgotPasswordFormProps) {
  const {
    forgotPassword,
    loading,
    error,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
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

    const emailResult = validateEmail(email);

    if (!emailResult.valid) {
      setErrors({
        email: emailResult.message,
      });
      return;
    }

    try {
      await forgotPassword({
        email: email.trim(),
      });

      setEmail("");
      setErrors({});
      setSuccessMessage(
        "If an account exists for this email address, a password reset link has been sent.",
      );

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

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <FormField
        label="Email address"
        htmlFor="forgot-password-email"
        required
        error={errors.email}
        helperText="Enter the email address associated with your SOG Airways account."
      >
        <Input
          id="forgot-password-email"
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
          aria-invalid={Boolean(errors.email)}
        />
      </FormField>

      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
      >
        Send reset link
      </PrimaryButton>
    </form>
  );
}