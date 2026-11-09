
"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  History,
  LoaderCircle,
  Wallet,
} from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";



interface PaymentBalanceCardProps {
  balance: number;
  currency?: string;
  lastReplenishedAt?: string;
  onReplenish: () => void | Promise<void>;
  onViewHistory: () => void;
  formatCurrency?: (amount: number, currency: string) => string;
}

const defaultFormatCurrency = (
  amount: number,
  currency: string,
): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export default function PaymentBalanceCard({
  balance,
  currency = "NGN",
  lastReplenishedAt,
  onReplenish,
  onViewHistory,
  formatCurrency = defaultFormatCurrency,
}: PaymentBalanceCardProps) {
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formattedBalance = formatCurrency(balance, currency);

  async function handleReplenish() {
    if (isReplenishing) return;

    setIsReplenishing(true);
    setError(null);
    setSuccess(null);

    try {
      await onReplenish();
      setSuccess("Replenishment request completed.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to replenish the demo balance. Please try again.",
      );
    } finally {
      setIsReplenishing(false);
    }
  }

  const formattedLastReplenished = lastReplenishedAt
    ? new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastReplenishedAt))
    : null;

  return (
    <section
      aria-labelledby="payment-balance-heading"
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-500/10 blur-2xl"
      />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Wallet className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <h2 id="payment-balance-heading">Admin demo balance</h2>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Available funds for simulated booking payments.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            Demo only
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Available balance
          </p>

          <p className="mt-1 break-words text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {formattedBalance}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ArrowUpRight className="h-4 w-4" />
            <span>Demo funds only — no real money is transferred.</span>
          </div>
        </div>

        {formattedLastReplenished && (
          <div className="mt-4 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
            <History className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Last replenished: {formattedLastReplenished}
            </span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PrimaryButton
            onClick={handleReplenish}
            disabled={isReplenishing}
          >
            {isReplenishing ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="mr-2 h-4 w-4" />
            )}
            {isReplenishing ? "Processing..." : "Replenish demo funds"}
          </PrimaryButton>

          <OutlineButton
            onClick={() => {
              setError(null);
              setSuccess(null);
              onViewHistory();
            }}
            disabled={isReplenishing}
          >
            <History className="mr-2 h-4 w-4" />
            View funding history
          </OutlineButton>
        </div>

        {success && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            {success}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
