"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { Booking } from "@/types/booking";

type PaymentStatus = "paid" | "pending" | "failed" | "refunded" | "unknown";

interface TripPaymentDetailsProps {
  booking: Booking;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  onViewReceipt?: () => void;
  className?: string;
}

const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;
    variant: "default" | "success" | "warning" | "danger" | "info";
    icon: typeof CheckCircle2;
  }
> = {
  paid: {
    label: "Paid",
    variant: "success",
    icon: CheckCircle2,
  },
  pending: {
    label: "Payment pending",
    variant: "warning",
    icon: Clock3,
  },
  failed: {
    label: "Payment failed",
    variant: "danger",
    icon: ShieldCheck,
  },
  refunded: {
    label: "Refunded",
    variant: "info",
    icon: Wallet,
  },
  unknown: {
    label: "Status unavailable",
    variant: "default",
    icon: Clock3,
  },
};

function formatCurrency(amount: number, currency: string): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currency || "NGN"} ${safeAmount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function getPaymentStatus(
  bookingStatus: Booking["status"],
  override?: PaymentStatus,
): PaymentStatus {
  if (override) return override;

  switch (bookingStatus) {
    case "confirmed":
    case "completed":
      return "paid";
    case "pending":
      return "pending";
    case "refunded":
      return "refunded";
    case "cancelled":
      return "unknown";
    default:
      return "unknown";
  }
}

function PaymentRow({
  label,
  amount,
  currency,
  emphasized = false,
}: {
  label: string;
  amount: number;
  currency: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${
        emphasized
          ? "border-t border-slate-200 pt-4 dark:border-slate-700"
          : ""
      }`}
    >
      <span
        className={`text-sm ${
          emphasized
            ? "font-semibold text-slate-900 dark:text-white"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-right tabular-nums ${
          emphasized
            ? "text-lg font-bold text-slate-900 dark:text-white"
            : "text-sm font-medium text-slate-800 dark:text-slate-200"
        }`}
      >
        {formatCurrency(amount, currency)}
      </span>
    </div>
  );
}

export default function TripPaymentDetails({
  booking,
  paymentStatus: paymentStatusOverride,
  paymentMethod,
  paymentReference,
  onViewReceipt,
  className = "",
}: TripPaymentDetailsProps) {
  const currency = booking.currency || "NGN";
  const status = getPaymentStatus(booking.status, paymentStatusOverride);
  const statusConfig = paymentStatusConfig[status];
  const StatusIcon = statusConfig.icon;

  const subtotal = Number.isFinite(booking.subtotal) ? booking.subtotal : 0;
  const taxes = Number.isFinite(booking.taxes) ? booking.taxes : 0;
  const fees = Number.isFinite(booking.fees) ? booking.fees : 0;
  const discount = Number.isFinite(booking.discount) ? booking.discount ?? 0 : 0;
  const total = Number.isFinite(booking.totalAmount)
    ? booking.totalAmount
    : subtotal + taxes + fees - discount;

  const resolvedPaymentMethod =
    paymentMethod?.trim() || "Not provided";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Payment details
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fare breakdown and payment information
            </p>
            <p className="mt-2 break-all text-xs text-slate-500 dark:text-slate-400">
              Booking reference:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {booking.bookingReference || "Unavailable"}
              </span>
            </p>
          </div>
        </div>

        <Badge variant={statusConfig.variant}>
          <span className="inline-flex items-center gap-1.5">
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </span>
        </Badge>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            Fare breakdown
          </h3>

          <div className="space-y-4">
            <PaymentRow
              label="Subtotal"
              amount={subtotal}
              currency={currency}
            />

            <PaymentRow
              label="Taxes"
              amount={taxes}
              currency={currency}
            />

            <PaymentRow
              label="Additional fees"
              amount={fees}
              currency={currency}
            />

            {discount > 0 && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-emerald-700 dark:text-emerald-400">
                  Discount
                </span>
                <span className="text-right text-sm font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                  −{formatCurrency(discount, currency)}
                </span>
              </div>
            )}

            <PaymentRow
              label="Total amount"
              amount={total}
              currency={currency}
              emphasized
            />
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
              Amounts are shown in {currency}. Confirm the final charge and any
              refund eligibility with the payment record before processing
              changes.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Payment information
          </h3>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <CreditCard className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payment method
              </p>
              <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
                {resolvedPaymentMethod}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Banknote className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payment reference
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-slate-900 dark:text-white">
                {paymentReference?.trim() ||
                  booking.paymentId ||
                  "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Booking date
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {booking.bookedAt
                  ? new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(booking.bookedAt))
                  : "Not available"}
              </p>
            </div>
          </div>

          {onViewReceipt && (
            <button
              type="button"
              onClick={onViewReceipt}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              <ReceiptText className="h-4 w-4" />
              View receipt
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
