
"use client";

import { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  CreditCard,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type { Payment, PaymentStatus } from "@/types";

interface PaymentStatsProps {
  payments: Payment[];
  loading?: boolean;
}

interface StatItem {
  label: string;
  value: string;
  description: string;
  icon: typeof CreditCard;
  iconClass: string;
  iconBackground: string;
}

function formatAmountByCurrency(
  payments: Payment[],
  predicate: (payment: Payment) => boolean,
): string {
  const totals = new Map<string, number>();

  for (const payment of payments) {
    if (!predicate(payment)) continue;

    const currency = payment.currency || "NGN";
    totals.set(
      currency,
      (totals.get(currency) ?? 0) + payment.amount,
    );
  }

  if (totals.size === 0) return "—";

  return Array.from(totals.entries())
    .sort(([currencyA], [currencyB]) =>
      currencyA.localeCompare(currencyB),
    )
    .map(([currency, amount]) =>
      `${currency} ${new Intl.NumberFormat("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)}`,
    )
    .join(" · ");
}

function isSuccessful(status: PaymentStatus): boolean {
  return status === "successful";
}

function isPending(status: PaymentStatus): boolean {
  return status === "pending" || status === "processing";
}

function isFailed(status: PaymentStatus): boolean {
  return status === "failed" || status === "cancelled";
}

function isRefunded(status: PaymentStatus): boolean {
  return status === "refunded" || status === "partially-refunded";
}

export default function PaymentStats({
  payments,
  loading = false,
}: PaymentStatsProps) {
  const stats = useMemo(() => {
    const successful = payments.filter((payment) =>
      isSuccessful(payment.status),
    );

    const pending = payments.filter((payment) =>
      isPending(payment.status),
    );

    const failed = payments.filter((payment) =>
      isFailed(payment.status),
    );

    const refunded = payments.filter((payment) =>
      isRefunded(payment.status),
    );

    const successfulAmounts = formatAmountByCurrency(
      payments,
      (payment) => isSuccessful(payment.status),
    );

    const refundedAmounts = formatAmountByCurrency(
      payments,
      (payment) => isRefunded(payment.status),
    );

    const totalAmounts = formatAmountByCurrency(
      payments,
      () => true,
    );

    const items: StatItem[] = [
      {
        label: "Total Transactions",
        value: payments.length.toLocaleString(),
        description: totalAmounts === "—"
          ? "No transaction amounts"
          : totalAmounts,
        icon: CreditCard,
        iconClass: "text-sky-600",
        iconBackground: "bg-sky-50 dark:bg-sky-500/10",
      },
      {
        label: "Successful Payments",
        value: successful.length.toLocaleString(),
        description: successfulAmounts === "—"
          ? "No successful payments"
          : successfulAmounts,
        icon: CheckCircle2,
        iconClass: "text-emerald-600",
        iconBackground: "bg-emerald-50 dark:bg-emerald-500/10",
      },
      {
        label: "Pending Payments",
        value: pending.length.toLocaleString(),
        description: "Pending or processing",
        icon: Clock3,
        iconClass: "text-amber-600",
        iconBackground: "bg-amber-50 dark:bg-amber-500/10",
      },
      {
        label: "Failed / Cancelled",
        value: failed.length.toLocaleString(),
        description: "Unsuccessful transactions",
        icon: XCircle,
        iconClass: "text-rose-600",
        iconBackground: "bg-rose-50 dark:bg-rose-500/10",
      },
      {
        label: "Refunded Payments",
        value: refunded.length.toLocaleString(),
        description: refundedAmounts === "—"
          ? "No refunded payments"
          : refundedAmounts,
        icon: RotateCcw,
        iconClass: "text-violet-600",
        iconBackground: "bg-violet-50 dark:bg-violet-500/10",
      },
      {
        label: "Payment Activity",
        value: `${payments.length.toLocaleString()} records`,
        description: "Across all payment statuses",
        icon: Activity,
        iconClass: "text-indigo-600",
        iconBackground: "bg-indigo-50 dark:bg-indigo-500/10",
      },
    ];

    return items;
  }, [payments]);

  return (
    <section
      aria-label="Payment statistics"
      className="w-full"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              {loading ? (
                <div
                  className="animate-pulse space-y-4"
                  aria-label={`Loading ${stat.label}`}
                >
                  <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-40 max-w-full rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>

                      <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>

                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBackground}`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-5 w-5 ${stat.iconClass}`}
                      />
                    </span>
                  </div>

                  <p
                    title={stat.description}
                    className="mt-4 break-words text-xs leading-5 text-slate-500 dark:text-slate-400"
                  >
                    {stat.description}
                  </p>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
