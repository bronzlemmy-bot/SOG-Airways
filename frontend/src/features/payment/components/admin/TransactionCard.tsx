
"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileText,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type { Payment } from "@/types";

interface TransactionCardProps {
  payment: Payment;
  onViewDetails: (payment: Payment) => void;
  onViewReceipt?: (payment: Payment) => void;
  onDownloadReceipt?: (payment: Payment) => void;
  formatCurrency?: (amount: number, currency: string) => string;
}

const STATUS_STYLES: Record<
  Payment["status"],
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    className:
      "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300",
    icon: Clock3,
  },
  successful: {
    label: "Successful",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className:
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300",
    icon: RotateCcw,
  },
  "partially-refunded": {
    label: "Partially refunded",
    className:
      "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-300",
    icon: RotateCcw,
  },
};

function defaultFormatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getMethodLabel(method: Payment["methodType"]) {
  const labels: Record<Payment["methodType"], string> = {
    card: "Card",
    "bank-transfer": "Bank transfer",
    "mobile-money": "Mobile money",
    wallet: "Wallet",
    other: "Other",
  };

  return labels[method];
}

export default function TransactionCard({
  payment,
  onViewDetails,
  onViewReceipt,
  onDownloadReceipt,
  formatCurrency = defaultFormatCurrency,
}: TransactionCardProps) {
  const [activeAction, setActiveAction] = useState<
    "details" | "receipt" | "download" | null
  >(null);
  const [error, setError] = useState("");

  const status = STATUS_STYLES[payment.status];
  const StatusIcon = status.icon;

  const canViewReceipt =
    payment.status === "successful" ||
    payment.status === "refunded" ||
    payment.status === "partially-refunded";

  const handleAction = async (
    action: "details" | "receipt" | "download",
  ) => {
    setError("");
    setActiveAction(action);

    try {
      if (action === "details") {
        onViewDetails(payment);
      } else if (action === "receipt") {
        if (!onViewReceipt) {
          setError("Receipt viewing is not configured yet.");
          return;
        }

        onViewReceipt(payment);
      } else {
        if (!onDownloadReceipt) {
          setError("Receipt download is not configured yet.");
          return;
        }

        onDownloadReceipt(payment);
      }
    } catch {
      setError("This action could not be completed. Please try again.");
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-sky-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
          <CreditCard className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h3 className="break-all text-sm font-semibold text-slate-900 dark:text-white">
                {payment.paymentReference}
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Booking: {payment.bookingId || "Not linked"}
              </p>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
            >
              <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {status.label}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transaction amount
              </p>
              <p className="mt-1 break-words text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(payment.amount, payment.currency)}
              </p>

              {typeof payment.transactionFee === "number" && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Fee: {formatCurrency(
                    payment.transactionFee,
                    payment.currency,
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CreditCard
                  className="h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <span>{getMethodLabel(payment.methodType)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CalendarDays
                  className="h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <span>{formatDate(payment.createdAt)}</span>
              </div>
            </div>
          </div>

          {payment.failureReason && (
            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {payment.failureReason}
            </p>
          )}

          {typeof payment.refundAmount === "number" &&
            payment.refundAmount > 0 && (
              <p className="mt-3 text-xs text-violet-700 dark:text-violet-300">
                Refund recorded:{" "}
                {formatCurrency(payment.refundAmount, payment.currency)}
              </p>
            )}

          {error && (
            <p
              role="alert"
              className="mt-3 text-sm text-rose-600 dark:text-rose-400"
            >
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => void handleAction("details")}
              disabled={activeAction !== null}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              View details
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>

            {canViewReceipt && onViewReceipt && (
              <button
                type="button"
                onClick={() => void handleAction("receipt")}
                disabled={activeAction !== null}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Receipt
              </button>
            )}

            {canViewReceipt && onDownloadReceipt && (
              <button
                type="button"
                onClick={() => void handleAction("download")}
                disabled={activeAction !== null}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
