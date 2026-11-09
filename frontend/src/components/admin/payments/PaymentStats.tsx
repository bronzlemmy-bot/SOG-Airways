"use client";

import {
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,

  TrendingUp,
  CircleDollarSign,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { AdminPayment } from "./admin-payments-data/PaymentsData";

interface PaymentStatsProps {
  payments: AdminPayment[];
}

function formatAmount(amount: number, currency: string): string {
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

function isCompleted(status: AdminPayment["status"]): boolean {
  return status === "completed" || status === "successful";
}

function isRefunded(status: AdminPayment["status"]): boolean {
  return status === "refunded" || status === "partially-refunded";
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function PaymentStats({ payments }: PaymentStatsProps) {
  const total = payments.length;

  const completed = payments.filter((payment) =>
    isCompleted(payment.status),
  ).length;

  const pending = payments.filter(
    (payment) =>
      payment.status === "pending" || payment.status === "processing",
  ).length;

  const failed = payments.filter(
    (payment) =>
      payment.status === "failed" || payment.status === "cancelled",
  ).length;

  const refunded = payments.filter((payment) =>
    isRefunded(payment.status),
  ).length;

  const successRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const netTotals = payments.reduce<Record<string, number>>(
    (totals, payment) => {
      if (!isCompleted(payment.status) && !isRefunded(payment.status)) {
        return totals;
      }

      const refundAmount =
        payment.status === "refunded"
          ? payment.amount
          : payment.status === "partially-refunded"
            ? Number(
                (
                  payment as AdminPayment & { refundAmount?: number }
                ).refundAmount ?? 0,
              )
            : 0;

      const netAmount = Math.max(0, payment.amount - refundAmount);

      totals[payment.currency] =
        (totals[payment.currency] ?? 0) +
        (isRefunded(payment.status) ? 0 : netAmount);

      return totals;
    },
    {},
  );

  const revenueSummary =
    Object.entries(netTotals).filter(([, amount]) => amount > 0).length > 0
      ? Object.entries(netTotals)
          .filter(([, amount]) => amount > 0)
          .map(([currency, amount]) => formatAmount(amount, currency))
          .join(" · ")
      : "No completed revenue";

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Payments"
          value={total.toLocaleString("en-NG")}
          description="Payments matching your current filters"
          icon={CreditCard}
          iconClass="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />

        <StatCard
          title="Completed"
          value={completed.toLocaleString("en-NG")}
          description={`${successRate}% of matching payments completed successfully`}
          icon={CheckCircle2}
          iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Pending / Processing"
          value={pending.toLocaleString("en-NG")}
          description="Payments awaiting a final outcome"
          icon={Clock3}
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title="Failed / Cancelled"
          value={failed.toLocaleString("en-NG")}
          description={`${refunded.toLocaleString("en-NG")} refunded or partially refunded`}
          icon={XCircle}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Net completed revenue
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {revenueSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:self-center">
            <TrendingUp className="h-4 w-4" />
            {successRate}% success rate
          </div>
        </div>
      </div>
    </section>
  );
}