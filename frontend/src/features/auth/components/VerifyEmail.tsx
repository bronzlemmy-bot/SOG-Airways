"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, MailCheck, RefreshCw } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import FormError from "@/components/forms/FormError";
import FormField from "@/components/forms/FormField";
import Input from "@/components/forms/Input";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface VerifyEmailProps {
  email?: string;
}

export default function VerifyEmail({ email }: VerifyEmailProps) {
  const { verifyEmail, resendVerificationEmail, loading, error, clearError } =
    useAuth();
  const [address, setAddress] = useState(email ?? "");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(Boolean(email));
  const [verified, setVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const requestCode = async () => {
    clearError();
    setFormError("");
    setMessage("");

    if (!address.trim()) {
      setFormError("Enter the email address you used to register.");
      return;
    }

    setResendLoading(true);
    try {
      await resendVerificationEmail(address.trim());
      setCodeRequested(true);
      setMessage(
        "If the address is eligible, a verification code will be sent shortly.",
      );
    } catch {
      // useAuth stores the API error.
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    setFormError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setFormError("Enter the 6-digit code from your email.");
      return;
    }

    try {
      await verifyEmail(address.trim(), code);
      setVerified(true);
    } catch {
      // useAuth stores the API error.
    }
  };

  if (verified) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Email verified
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Your account is ready. Sign in to continue.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-800 dark:bg-sky-300/10 dark:text-sky-200">
          <MailCheck size={30} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Verify your email
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
          Enter the one-time code sent to your inbox. It expires after 10
          minutes.
        </p>
      </div>

      {(error || formError) && (
        <FormError message={formError || error || ""} />
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200"
        >
          {message}
        </div>
      )}

      <FormField
        label="Email address"
        htmlFor="verification-email"
        required
      >
        <Input
          id="verification-email"
          name="email"
          type="email"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Enter your email address"
          autoComplete="email"
          disabled={Boolean(email)}
        />
      </FormField>

      {codeRequested ? (
        <form onSubmit={handleVerify} className="space-y-5">
          <FormField
            label="6-digit verification code"
            htmlFor="verification-code"
            required
          >
            <Input
              id="verification-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              aria-describedby="verification-code-help"
            />
          </FormField>
          <p
            id="verification-code-help"
            className="-mt-3 text-xs text-slate-500 dark:text-slate-400"
          >
            The code can be used once.
          </p>
          <PrimaryButton type="submit" fullWidth loading={loading}>
            Verify email
          </PrimaryButton>
        </form>
      ) : (
        <PrimaryButton
          type="button"
          fullWidth
          loading={resendLoading}
          onClick={() => void requestCode()}
        >
          Send verification code
        </PrimaryButton>
      )}

      {codeRequested && (
        <button
          type="button"
          onClick={() => void requestCode()}
          disabled={resendLoading || loading}
          className="mx-auto flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-200 dark:hover:bg-white/5"
        >
          <RefreshCw size={16} aria-hidden="true" />
          {resendLoading ? "Requesting code..." : "Resend code"}
        </button>
      )}
    </div>
  );
}
