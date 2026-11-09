import Link from "next/link";
import { ArrowLeft, Plane } from "lucide-react";

import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <Plane className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Forgot your password?
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter the email address connected to your SOG Airways account and
          we&apos;ll send instructions to reset your password.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <ForgotPasswordForm />

        <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
        If you don&apos;t receive an email, check your spam folder or{" "}
        <Link
          href="/contact"
          className="underline underline-offset-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        >
          contact our support team
        </Link>
        .
      </p>
    </div>
  );
}
