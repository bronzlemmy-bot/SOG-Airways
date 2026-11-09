"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";

import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <Plane className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Sign in to your SOG Airways account to manage your journeys.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <LoginForm onSuccess={() => router.push("/users/dashboard")} />

        <div className="mt-7 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
        By signing in, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        >
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
