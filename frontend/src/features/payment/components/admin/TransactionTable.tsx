
"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  ReceiptText,
} from "lucide-react";

import type { Payment } from "@/types";

import { useMemo, useState } from "react";


type SortKey =
  | "paymentReference"
  | "amount"
  | "createdAt"
  | "status";

type SortDirection = "asc" | "desc";

interface TransactionTableProps {
  payments: Payment[];
  loading?: boolean;
  onViewDetails: (payment: Payment) => void;
  onViewReceipt?: (payment: Payment) => void;
  formatCurrency?: (amount: number, currency: string) => string;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

const STATUS_CONFIG: Record<
  Payment["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  processing: {
    label: "Processing",
    className:
      "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  },
  successful: {
    label: "Successful",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  failed: {
    label: "Failed",
    className:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  "partially-refunded": {
    label: "Partially refunded",
    className:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  },
};

const METHOD_LABELS: Record<Payment["methodType"], string> = {
  card: "Card",
  "bank-transfer": "Bank transfer",
  "mobile-money": "Mobile money",
  wallet: "Wallet",
  other: "Other",
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

function formatDate(value: string) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getSortValue(payment: Payment, key: SortKey) {
  switch (key) {
    case "amount":
      return payment.amount;
    case "createdAt":
      return new Date(payment.createdAt).getTime() || 0;
    case "status":
      return payment.status;
    case "paymentReference":
      return payment.paymentReference;
  }
}

function SortButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  const Icon = !active
    ? ArrowUpDown
    : direction === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300"
    >
      {label}
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

export default function TransactionTable({
  payments,
  loading = false,
  onViewDetails,
  onViewReceipt,
  formatCurrency = defaultFormatCurrency,
  page = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  emptyMessage = "No transactions found.",
}: TransactionTableProps) {
 
const [sortKey, setSortKey] =
  useState<SortKey>("createdAt");

const [sortDirection, setSortDirection] =
  useState<SortDirection>("desc");

const sortedPayments = useMemo(() => {
  return [...payments].sort((a, b) => {
    const first = getSortValue(a, sortKey);
    const second = getSortValue(b, sortKey);

    let comparison = 0;

    if (typeof first === "number" && typeof second === "number") {
      comparison = first - second;
    } else {
      comparison = String(first).localeCompare(String(second));
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });
}, [payments, sortKey, sortDirection]);


  const itemCount = totalItems ?? payments.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(itemCount / safePageSize));
  const startItem =
    itemCount === 0 ? 0 : (page - 1) * safePageSize + 1;
  const endItem = Math.min(page * safePageSize, itemCount);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((direction) =>
        direction === "asc" ? "desc" : "asc",
      );
    } else {
      setSortKey(key);
      setSortDirection(key === "createdAt" ? "desc" : "asc");
    }
  };

  const goToPage = (nextPage: number) => {
    if (!onPageChange || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Payment transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and inspect payment records.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {itemCount.toLocaleString()} records
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-4">
                <SortButton
                  label="Reference"
                  active={sortKey === "paymentReference"}
                  direction={sortDirection}
                  onClick={() => handleSort("paymentReference")}
                />
              </th>
              <th className="px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Booking / Customer
                </span>
              </th>
              <th className="px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Method
                </span>
              </th>
              <th className="px-5 py-4">
                <SortButton
                  label="Amount"
                  active={sortKey === "amount"}
                  direction={sortDirection}
                  onClick={() => handleSort("amount")}
                />
              </th>
              <th className="px-5 py-4">
                <SortButton
                  label="Status"
                  active={sortKey === "status"}
                  direction={sortDirection}
                  onClick={() => handleSort("status")}
                />
              </th>
              <th className="px-5 py-4">
                <SortButton
                  label="Date"
                  active={sortKey === "createdAt"}
                  direction={sortDirection}
                  onClick={() => handleSort("createdAt")}
                />
              </th>
              <th className="px-5 py-4 text-right">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              sortedPayments.map((payment) => {
                const status = STATUS_CONFIG[payment.status];

                return (
                  <tr
                    key={payment.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <p className="max-w-52 break-all text-sm font-semibold text-slate-900 dark:text-white">
                        {payment.paymentReference}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        ID: {payment.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        Booking: {payment.bookingId || "—"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Customer: {payment.userId || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <ReceiptText
                          className="h-4 w-4 text-slate-400"
                          aria-hidden="true"
                        />
                        {METHOD_LABELS[payment.methodType]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      {typeof payment.refundAmount === "number" &&
                        payment.refundAmount > 0 && (
                          <p className="mt-1 whitespace-nowrap text-xs text-violet-600 dark:text-violet-300">
                            Refunded:{" "}
                            {formatCurrency(
                              payment.refundAmount,
                              payment.currency,
                            )}
                          </p>
                        )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
                        {formatDate(payment.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onViewDetails(payment)}
                          aria-label={`View details for ${payment.paymentReference}`}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-sky-800 dark:hover:bg-sky-500/10 dark:hover:text-sky-300"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          View
                        </button>

                        {onViewReceipt &&
                          (payment.status === "successful" ||
                            payment.status === "refunded" ||
                            payment.status === "partially-refunded") && (
                            <button
                              type="button"
                              onClick={() => onViewReceipt(payment)}
                              aria-label={`View receipt for ${payment.paymentReference}`}
                              className="ml-2 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              Receipt
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!loading && sortedPayments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <ReceiptText className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {emptyMessage}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {startItem}–{endItem} of {itemCount} transactions
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={!onPageChange || page <= 1 || loading}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>

          <span className="px-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={!onPageChange || page >= totalPages || loading}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
