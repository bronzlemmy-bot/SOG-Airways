"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LockKeyhole, Plane } from "lucide-react";

import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <Plane className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Create a new password
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          Choose a strong new password for your SOG Airways account.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <ResetPasswordForm token={token} />

        <div className="mt-7 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <LockKeyhole className="mr-1 inline h-4 w-4" />
            Your password is sent securely to the configured auth service.
          </p>
          <Link
            href="/login"
            className="mt-3 inline-block text-sm font-semibold text-slate-900 hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-slate-500">
          Loading password reset form...
        </p>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
