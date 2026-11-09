"use client";

import {
  CreditCard,
  Landmark,
  Wallet,
  Banknote,
  Smartphone,
  CircleDollarSign,
  UserRound,
  CalendarDays,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import PaymentActions from "./PaymentActions";
import PaymentStatusBadge from "./PaymentStatusBadge";
import type { AdminPayment } from "./admin-payments-data/PaymentsData";



interface PaymentCardProps {
  payment: AdminPayment;
  onView: (payment: AdminPayment) => void;
  onStatusChange: (
    paymentId: string,
    status: AdminPayment["status"],
  ) => void;
  onRefund: (payment: AdminPayment) => void;
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

function getPaymentMethod(payment: AdminPayment): string {
  const record = payment as AdminPayment & {
    method?: string;
    paymentMethod?: string;
  };

  return record.method ?? record.paymentMethod ?? "other";
}

export default function PaymentCard({
  payment,
  onView,
  onStatusChange,
  onRefund,
}: PaymentCardProps) {
  const method = getPaymentMethod(payment);
  const methodDetails = methodConfig[method] ?? methodConfig.other;
  const MethodIcon = methodDetails.icon;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {payment.paymentId}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {payment.transactionReference}
            </p>
          </div>
        </div>

        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="my-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Payment amount
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formatAmount(payment.amount, payment.currency)}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Passenger
            </p>
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
              {payment.passengerName || "Unknown passenger"}
            </p>
            {payment.passengerEmail && (
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {payment.passengerEmail}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Booking reference
            </p>
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
              {payment.bookingId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MethodIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Payment method
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {methodDetails.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Payment date
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <PaymentActions
          payment={payment}
          onView={onView}
          onStatusChange={onStatusChange}
          onRefund={onRefund}
        />
      </div>
    </article>
  );
}