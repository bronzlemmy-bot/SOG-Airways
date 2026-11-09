
"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  CreditCard,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";


interface PaymentHeaderProps {
  onRefresh: () => void | Promise<void>;
  onExport: () => void | Promise<void>;
  lastUpdatedAt?: string;
}

export default function PaymentHeader({
  onRefresh,
  onExport,
  lastUpdatedAt,
}: PaymentHeaderProps) {
  const [activeAction, setActiveAction] = useState<
    "refresh" | "export" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  async function runAction(
    action: "refresh" | "export",
    callback: () => void | Promise<void>,
  ) {
    if (activeAction) return;

    setActiveAction(action);
    setError(null);

    try {
      await callback();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to ${action === "refresh" ? "refresh payments" : "export the report"}. Please try again.`,
      );
    } finally {
      setActiveAction(null);
    }
  }

  const formattedLastUpdated = lastUpdatedAt
    ? new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastUpdatedAt))
    : null;

  return (
    <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <CreditCard className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-400">
            SOG Airways · Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Payment Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Manage demo transactions, monitor booking payments, review refunds,
            and track funding activity from one place.
          </p>

          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            Demo payment environment — no real-money transactions.
          </p>

          {formattedLastUpdated && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Last updated: {formattedLastUpdated}
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
        <OutlineButton
          onClick={() => runAction("refresh", onRefresh)}
          disabled={activeAction !== null}
        >
          {activeAction === "refresh" ? (
            <LoaderCircle
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <RefreshCw
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            />
          )}
          {activeAction === "refresh" ? "Refreshing..." : "Refresh"}
        </OutlineButton>

        <PrimaryButton
          onClick={() => runAction("export", onExport)}
          disabled={activeAction !== null}
        >
          {activeAction === "export" ? (
            <LoaderCircle
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <ArrowDownToLine
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            />
          )}
          {activeAction === "export" ? "Exporting..." : "Export report"}
        </PrimaryButton>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-red-700 dark:text-red-300 lg:basis-full"
        >
          {error}
        </p>
      )}
    </header>
  );
}
