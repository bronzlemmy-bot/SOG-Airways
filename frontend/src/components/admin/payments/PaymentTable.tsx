"use client";

import {

  ArrowUpDown,
  CreditCard,
  Landmark,
  Wallet,
  Banknote,
  Smartphone,
  CircleDollarSign,
  UserRound,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { AdminPayment } from "./admin-payments-data/PaymentsData";
import PaymentActions from "./PaymentActions";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentTableProps {
  payments: AdminPayment[];
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

function getMethod(payment: AdminPayment): string {
  const record = payment as AdminPayment & {
    method?: string;
    paymentMethod?: string;
  };

  return record.method ?? record.paymentMethod ?? "other";
}

function getPassengerName(payment: AdminPayment): string {
  const record = payment as AdminPayment & {
    passengerName?: string;
    customerName?: string;
  };

  return record.passengerName ?? record.customerName ?? "Unknown passenger";
}

function getPassengerEmail(payment: AdminPayment): string | undefined {
  const record = payment as AdminPayment & {
    passengerEmail?: string;
    customerEmail?: string;
  };

  return record.passengerEmail ?? record.customerEmail;
}



export default function PaymentTable({
  payments,
  onView,
  onStatusChange,
  onRefund,
}: PaymentTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] divide-y divide-slate-200 text-left dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/70">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Payment
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Passenger
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Booking
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Amount
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Method
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Date
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <ReceiptText className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      No payments found
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const method = getMethod(payment);
                const methodDetails = methodConfig[method] ?? methodConfig.other;
                const MethodIcon = methodDetails.icon;
                const passengerName = getPassengerName(payment);
                const passengerEmail = getPassengerEmail(payment);

                return (
                  <tr
                    key={payment.paymentId}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          <ReceiptText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[160px] truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {payment.paymentId}
                          </p>
                          <p className="mt-1 max-w-[160px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {payment.transactionReference}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                        <div className="min-w-0">
                          <p className="max-w-[170px] truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                            {passengerName}
                          </p>
                          {passengerEmail && (
                            <p className="mt-1 max-w-[170px] truncate text-xs text-slate-500 dark:text-slate-400">
                              {passengerEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex max-w-[140px] items-center gap-1.5 truncate text-sm text-slate-600 dark:text-slate-300">
                        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{payment.bookingId}</span>
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MethodIcon className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                          {methodDetails.label}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                        {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <PaymentStatusBadge status={payment.status} />
                    </td>

                    <td className="px-5 py-4">
                      <PaymentActions
                        payment={payment}
                        onView={onView}
                        onStatusChange={onStatusChange}
                        onRefund={onRefund}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing <strong className="text-slate-700 dark:text-slate-200">{payments.length}</strong>{" "}
          {payments.length === 1 ? "payment" : "payments"}
        </span>
        <span>Amounts are displayed in each payment&apos;s currency.</span>
      </div>
    </div>
  );
}