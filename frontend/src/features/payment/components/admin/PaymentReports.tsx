
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  ReceiptText,
} from "lucide-react";


import type { Payment } from "@/types";
import PrimaryButton from "@/components/buttons/PrimaryButton";

type ReportPeriod = "all" | "today" | "week" | "month";

interface PaymentReportsProps {
  payments: Payment[];
  loading?: boolean;
  onExportReport: (payments: Payment[]) => void | Promise<void>;
}

function getStartDate(period: ReportPeriod): Date | null {
  const now = new Date();
  const start = new Date(now);

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return start;

    case "week":
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return start;

    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return start;

    default:
      return null;
  }
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

export default function PaymentReports({
  payments,
  loading = false,
  onExportReport,
}: PaymentReportsProps) {
  const [period, setPeriod] = useState<ReportPeriod>("all");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredPayments = useMemo(() => {
    const startDate = getStartDate(period);

    if (!startDate) return payments;

    return payments.filter((payment) => {
      const createdAt = new Date(payment.createdAt);

      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt >= startDate
      );
    });
  }, [payments, period]);

  const summary = useMemo(() => {
    const successful = filteredPayments.filter(
      (payment) => payment.status === "successful",
    );
    const pending = filteredPayments.filter(
      (payment) =>
        payment.status === "pending" ||
        payment.status === "processing",
    );
    const failed = filteredPayments.filter(
      (payment) =>
        payment.status === "failed" ||
        payment.status === "cancelled",
    );
    const refunded = filteredPayments.filter(
      (payment) =>
        payment.status === "refunded" ||
        payment.status === "partially-refunded",
    );

    return {
      totalTransactions: filteredPayments.length,
      successfulCount: successful.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      refundedCount: refunded.length,
      successfulAmount: successful.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      ),
      refundedAmount: refunded.reduce(
        (sum, payment) => sum + (payment.refundAmount ?? 0),
        0,
      ),
    };
  }, [filteredPayments]);

  const currencyGroups = useMemo(() => {
    const totals = new Map<string, number>();

    for (const payment of filteredPayments) {
      if (payment.status === "successful") {
        totals.set(
          payment.currency,
          (totals.get(payment.currency) ?? 0) + payment.amount,
        );
      }
    }

    return Array.from(totals.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [filteredPayments]);

  async function handleExport() {
    if (exporting || loading) return;

    setExporting(true);
    setError(null);
    setSuccess(null);

    try {
      await onExportReport(filteredPayments);
      setSuccess("Report export completed.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export the report. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <FileSpreadsheet className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              Payment reports
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Review demo payment activity for a selected period and export
              the matching transaction records.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 dark:border-slate-700">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <span className="sr-only">Report period</span>
            <select
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value as ReportPeriod);
                setError(null);
                setSuccess(null);
              }}
              disabled={loading || exporting}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 outline-none dark:text-slate-200"
            >
              <option value="all">All available dates</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">This month</option>
            </select>
          </label>

          <PrimaryButton
            type="button"
            aria-label="Export report"
            className="flex min-h-10 items-center justify-center gap-2"
            onClick={handleExport}
            disabled={loading || exporting}
          >
            {exporting ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {exporting ? "Exporting..." : "Export report"}
          </PrimaryButton>
        </div>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/30">
        <div className="flex items-start gap-3">
          <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
          <div>
            <p className="font-semibold text-sky-900 dark:text-sky-200">
              Demo transaction report
            </p>
            <p className="mt-1 text-sm text-sky-800 dark:text-sky-300">
              These records describe simulated payment activity and do not
              represent actual money received or transferred.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div role="status" className="py-8 text-center text-sm text-slate-500">
          Preparing report…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ReportMetric
              label="Transactions"
              value={summary.totalTransactions.toLocaleString("en-NG")}
            />
            <ReportMetric
              label="Successful"
              value={summary.successfulCount.toLocaleString("en-NG")}
            />
            <ReportMetric
              label="Pending / processing"
              value={summary.pendingCount.toLocaleString("en-NG")}
            />
            <ReportMetric
              label="Failed / cancelled"
              value={summary.failedCount.toLocaleString("en-NG")}
            />
            <ReportMetric
              label="Refunded"
              value={summary.refundedCount.toLocaleString("en-NG")}
            />
            <ReportMetric
              label="Refund amount recorded"
              value={currencyGroups.length === 0
                ? "No successful payments"
                : `${summary.refundedCount} refund record(s)`}
            />
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Successful payment amounts by currency
            </h3>

            {currencyGroups.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                No successful payments are available for this period.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {currencyGroups.map(([currency, amount]) => (
                  <li
                    key={currency}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {currency}
                    </span>
                    <span className="font-semibold text-slate-950 dark:text-white">
                      {formatCurrency(amount, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </section>
  );
}

function ReportMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </article>
  );
}
