
"use client";

import {
  Activity,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type { Payment } from "@/types";
import PaymentStats from "./PaymentStats";

interface PaymentOverviewProps {
  payments: Payment[];
  loading?: boolean;
  currency?: string;
  onViewAllTransactions: () => void;
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function PaymentOverview({
  payments,
  loading = false,
  currency = "NGN",
  onViewAllTransactions,
}: PaymentOverviewProps) {
  const successful = payments.filter(
    (payment) => payment.status === "successful",
  );

  const pending = payments.filter(
    (payment) =>
      payment.status === "pending" ||
      payment.status === "processing",
  );

  const failed = payments.filter(
    (payment) =>
      payment.status === "failed" ||
      payment.status === "cancelled",
  );

  const refunded = payments.filter(
    (payment) =>
      payment.status === "refunded" ||
      payment.status === "partially-refunded",
  );

  const successfulAmount = successful.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const refundedAmount = refunded.reduce(
    (total, payment) => total + (payment.refundAmount ?? 0),
    0,
  );

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Activity
            className="h-5 w-5 text-sky-600 dark:text-sky-400"
            aria-hidden="true"
          />
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Payment overview
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A summary of payment activity and recent demo transactions.
        </p>
      </div>

      <PaymentStats payments={payments} loading={loading} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Successful payments"
          value={successful.length.toLocaleString("en-NG")}
          detail={formatCurrency(successfulAmount, currency)}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="emerald"
        />

        <SummaryCard
          title="Pending payments"
          value={pending.length.toLocaleString("en-NG")}
          detail="Awaiting processing or confirmation"
          icon={<Clock3 className="h-5 w-5" />}
          tone="amber"
        />

        <SummaryCard
          title="Failed or cancelled"
          value={failed.length.toLocaleString("en-NG")}
          detail="Review transactions requiring attention"
          icon={<XCircle className="h-5 w-5" />}
          tone="rose"
        />

        <SummaryCard
          title="Refunded payments"
          value={refunded.length.toLocaleString("en-NG")}
          detail={formatCurrency(refundedAmount, currency)}
          icon={<RotateCcw className="h-5 w-5" />}
          tone="violet"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white">
              Recent transactions
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The five most recently created payment records.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllTransactions}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            View all transactions
          </button>
        </div>

        {loading ? (
          <div
            role="status"
            className="p-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Loading payment overview…
          </div>
        ) : recentPayments.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
              No transactions yet
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Payment records will appear here when available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900 dark:text-white">
                    {payment.paymentReference}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Booking: {payment.bookingId}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <PaymentStatusLabel status={payment.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone: "emerald" | "amber" | "rose" | "violet";
}

function SummaryCard({
  title,
  value,
  detail,
  icon,
  tone,
}: SummaryCardProps) {
  const tones = {
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    violet:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </p>
        <span className={`rounded-xl p-2 ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function PaymentStatusLabel({
  status,
}: {
  status: Payment["status"];
}) {
  const styles: Record<Payment["status"], string> = {
    pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    processing:
      "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    successful:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    failed:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    cancelled:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    refunded:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    "partially-refunded":
      "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  };

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status.replaceAll("-", " ")}
    </span>
  );
}
