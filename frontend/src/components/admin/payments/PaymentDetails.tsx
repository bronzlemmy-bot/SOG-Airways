"use client";

import {
  X,
  ReceiptText,
  UserRound,
  Mail,
  CalendarDays,
  CreditCard,
  Landmark,
  Wallet,
  Banknote,
  Smartphone,
  CircleDollarSign,
  ArrowUpRight,
  Clock3,
  Hash,
  FileText,
  RotateCcw,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { AdminPayment } from "./admin-payments-data/PaymentsData";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentDetailsProps {
  payment: AdminPayment;
  onClose?: () => void;
}

const methodConfig: Record<
  string,
  { label: string; icon: LucideIcon }
> = {
  card: { label: "Card", icon: CreditCard },
  "bank-transfer": { label: "Bank Transfer", icon: Landmark },
  paypal: { label: "PayPal", icon: Wallet },
  wallet: { label: "Wallet", icon: Wallet },
  cash: { label: "Cash", icon: Banknote },
  "mobile-money": { label: "Mobile Money", icon: Smartphone },
  other: { label: "Other", icon: CircleDollarSign },
};

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

function formatDate(value?: string | Date | null): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getValue(
  payment: AdminPayment,
  ...keys: string[]
): string | undefined {
  const record = payment as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function DetailRow({
  icon: Icon,
  label,
  value,
  breakAll = false,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  breakAll?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p
          className={`mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200 ${
            breakAll ? "break-all" : "break-words"
          }`}
        >
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default function PaymentDetails({
  payment,
  onClose,
}: PaymentDetailsProps) {
  const method = getValue(payment, "method", "paymentMethod") ?? "other";
  const methodDetails = methodConfig[method] ?? methodConfig.other;
  const MethodIcon = methodDetails.icon;

  const passengerName =
    getValue(payment, "passengerName", "customerName") ??
    "Unknown passenger";

  const passengerEmail = getValue(
    payment,
    "passengerEmail",
    "customerEmail",
  );

  const transactionReference = getValue(
    payment,
    "transactionReference",
    "paymentReference",
  );

  const description = getValue(payment, "description");

  const refundAmount = Number(
    (payment as AdminPayment & { refundAmount?: number }).refundAmount ?? 0,
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Payment details
            </h2>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {payment.paymentId}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6">
        <section className="rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 p-5 text-white">
          <p className="text-sm font-medium text-white/80">
            Payment amount
          </p>

          <p className="mt-2 break-words text-3xl font-bold tracking-tight">
            {formatAmount(payment.amount, payment.currency)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <PaymentStatusBadge status={payment.status} />

            <span className="inline-flex items-center gap-1.5 text-xs text-white/80">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(payment.createdAt)}
            </span>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
            Transaction information
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <DetailRow
              icon={Hash}
              label="Payment ID"
              value={payment.paymentId}
              breakAll
            />

            <DetailRow
              icon={ReceiptText}
              label="Transaction reference"
              value={transactionReference}
              breakAll
            />

            <DetailRow
              icon={ArrowUpRight}
              label="Booking reference"
              value={payment.bookingId}
              breakAll
            />

            <DetailRow
              icon={MethodIcon}
              label="Payment method"
              value={methodDetails.label}
            />

            <DetailRow
              icon={CalendarDays}
              label="Created at"
              value={formatDate(payment.createdAt)}
            />

            <DetailRow
              icon={CalendarDays}
              label="Last updated"
              value={formatDate(
                getValue(payment, "updatedAt", "updatedAt"),
              )}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
            Passenger information
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <DetailRow
              icon={UserRound}
              label="Passenger name"
              value={passengerName}
            />

            <DetailRow
              icon={Mail}
              label="Email address"
              value={passengerEmail}
              breakAll
            />
          </div>
        </section>

        {refundAmount > 0 && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <RotateCcw className="h-4 w-4" />
              <h3 className="text-sm font-bold">Refund information</h3>
            </div>

            <p className="mt-3 text-sm text-blue-800 dark:text-blue-200">
              Refunded amount:{" "}
              <strong>{formatAmount(refundAmount, payment.currency)}</strong>
            </p>

            <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
              This amount is based on the refund information recorded for this payment.
            </p>
          </section>
        )}

        {description && (
          <section>
            <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
              Description
            </h3>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="break-words text-sm text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </div>
          </section>
        )}
      </div>

      {onClose && (
        <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Close details
          </button>
        </div>
      )}
    </div>
  );
}