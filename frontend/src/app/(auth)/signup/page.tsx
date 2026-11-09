"use client";

import Link from "next/link";
import { useState } from "react";
import { Plane } from "lucide-react";

import RegisterForm from "@/features/auth/components/RegisterForm";
import VerifyEmail from "@/features/auth/components/VerifyEmail";

export default function SignupPage() {
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null,
  );

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <Plane className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {verificationEmail ? "Check your inbox" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {verificationEmail
            ? "Enter the one-time code we sent to verify your email."
            : "Join SOG Airways and make your next journey easier."}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        {verificationEmail ? (
          <VerifyEmail email={verificationEmail} />
        ) : (
          <RegisterForm onSuccess={setVerificationEmail} />
        )}

        <div className="mt-7 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {verificationEmail ? "Already verified?" : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 dark:text-white"
            >
              Sign in
            </Link>
          </p>
          {!verificationEmail && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Need a new verification code?{" "}
              <Link
                href="/verify-email"
                className="font-semibold text-slate-900 dark:text-white"
              >
                Request one
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
