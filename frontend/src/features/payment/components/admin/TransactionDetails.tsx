
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Hash,
  RotateCcw,
  UserRound,
  XCircle,
} from "lucide-react";

import type { Payment } from "@/types";

interface TransactionDetailsProps {
  payment: Payment;
  onClose: () => void;
  onViewReceipt?: (payment: Payment) => void;
}

const STATUS_CONFIG: Record<
  Payment["status"],
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    className:
      "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    icon: Clock3,
  },
  successful: {
    label: "Successful",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    icon: RotateCcw,
  },
  "partially-refunded": {
    label: "Partially refunded",
    className:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
    icon: RotateCcw,
  },
};

const METHOD_LABELS: Record<Payment["methodType"], string> = {
  card: "Card",
  "bank-transfer": "Bank transfer",
  "mobile-money": "Mobile money",
  wallet: "Wallet",
  other: "Other",
};

function formatCurrency(amount: number, currency: string): string {
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

function formatDate(value?: string): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Hash;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      {Icon && (
        <span className="mt-0.5 text-slate-400">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TransactionDetails({
  payment,
  onClose,
  onViewReceipt,
}: TransactionDetailsProps) {
  const status = STATUS_CONFIG[payment.status];
  const StatusIcon = status.icon;

  const canViewReceipt =
    payment.status === "successful" ||
    payment.status === "refunded" ||
    payment.status === "partially-refunded";

  const totalFee = payment.transactionFee ?? 0;
  const hasRefund =
    typeof payment.refundAmount === "number" &&
    payment.refundAmount > 0;

  return (
    <section
      aria-label="Transaction details"
      className="w-full space-y-6"
    >
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Transaction amount
          </p>

          <p className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {formatCurrency(payment.amount, payment.currency)}
          </p>

          <p className="mt-2 break-all text-xs text-slate-500 dark:text-slate-400">
            Reference: {payment.paymentReference}
          </p>
        </div>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${status.className}`}
        >
          <StatusIcon className="h-4 w-4" aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Transaction information
        </h3>

        <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
          <DetailRow
            label="Payment reference"
            value={payment.paymentReference}
            icon={Hash}
          />

          <DetailRow
            label="Booking ID"
            value={payment.bookingId || "Not linked"}
            icon={FileText}
          />

          <DetailRow
            label="Customer ID"
            value={payment.userId || "Not available"}
            icon={UserRound}
          />

          <DetailRow
            label="Payment method"
            value={METHOD_LABELS[payment.methodType]}
            icon={CreditCard}
          />

          <DetailRow
            label="Payment method ID"
            value={payment.methodId || "Not recorded"}
            icon={CreditCard}
          />

          <DetailRow
            label="Created"
            value={formatDate(payment.createdAt)}
            icon={CalendarDays}
          />

          <DetailRow
            label="Last updated"
            value={formatDate(payment.updatedAt)}
            icon={Clock3}
          />

          <DetailRow
            label="Payment completed"
            value={formatDate(payment.paidAt)}
            icon={CheckCircle2}
          />

          {payment.refundedAt && (
            <DetailRow
              label="Refund date"
              value={formatDate(payment.refundedAt)}
              icon={RotateCcw}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Amount breakdown
        </h3>

        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Payment amount
            </span>
            <span className="text-right font-medium text-slate-900 dark:text-white">
              {formatCurrency(payment.amount, payment.currency)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Transaction fee
            </span>
            <span className="text-right font-medium text-slate-900 dark:text-white">
              {formatCurrency(totalFee, payment.currency)}
            </span>
          </div>

          {hasRefund && (
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Recorded refund
              </span>
              <span className="text-right font-semibold text-violet-600 dark:text-violet-300">
                {formatCurrency(payment.refundAmount!, payment.currency)}
              </span>
            </div>
          )}
        </div>
      </div>

      {payment.failureReason && (
        <div
          role="status"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/60 dark:bg-rose-950/30"
        >
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
            Payment failure reason
          </p>
          <p className="mt-1 break-words text-sm text-rose-700 dark:text-rose-400">
            {payment.failureReason}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Close
        </button>

        {canViewReceipt && onViewReceipt && (
          <button
            type="button"
            onClick={() => onViewReceipt(payment)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            View receipt
          </button>
        )}
      </div>
    </section>
  );
}
