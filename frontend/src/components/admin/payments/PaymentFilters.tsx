"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  CreditCard,
  Filter,
  RotateCcw,
  Search,
  WalletCards,
  X,
} from "lucide-react";

import type {
  PaymentCurrency,
  PaymentMethod,
  PaymentStatus,
} from "./admin-payments-data/PaymentsData";

export type PaymentSortOption =
  | "newest"
  | "oldest"
  | "amount-high"
  | "amount-low"
  | "name-asc"
  | "name-desc";

export interface PaymentFilterValues {
  search: string;
  status: PaymentStatus | "all";
  paymentMethod: PaymentMethod | "all";
  currency: PaymentCurrency | "all";
  sortBy: PaymentSortOption;
}

interface PaymentFiltersProps {
  filters: PaymentFilterValues;
  onChange: (filters: PaymentFilterValues) => void;
  onReset: () => void;
}

const statusOptions: Array<{
  value: PaymentStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "partially-refunded", label: "Partially Refunded" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentMethodOptions: Array<{
  value: PaymentMethod | "all";
  label: string;
}> = [
  { value: "all", label: "All Methods" },
  { value: "card", label: "Card" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "wallet", label: "Wallet" },
  { value: "cash", label: "Cash" },
  { value: "mobile-money", label: "Mobile Money" },
  { value: "other", label: "Other" },
];

const currencyOptions: Array<{
  value: PaymentCurrency | "all";
  label: string;
}> = [
  { value: "all", label: "All Currencies" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "EUR", label: "EUR — Euro" },
];

const sortOptions: Array<{
  value: PaymentSortOption;
  label: string;
}> = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount-high", label: "Amount: High to Low" },
  { value: "amount-low", label: "Amount: Low to High" },
  { value: "name-asc", label: "Passenger: A to Z" },
  { value: "name-desc", label: "Passenger: Z to A" },
];

export default function PaymentFilters({
  filters,
  onChange,
  onReset,
}: PaymentFiltersProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.paymentMethod !== "all" ||
    filters.currency !== "all" ||
    filters.sortBy !== "newest";

  const updateFilter = <K extends keyof PaymentFilterValues>(
    key: K,
    value: PaymentFilterValues[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const formatStatusLabel = (status: PaymentStatus) =>
    status
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const formatMethodLabel = (method: PaymentMethod) =>
    method
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:p-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Filter className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Payment Filters
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search and organize payment records
              </p>
            </div>
          </div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search by passenger, payment ID, booking ID, or transaction reference..."
            aria-label="Search payment records"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />

          {filters.search && (
            <button
              type="button"
              onClick={() => updateFilter("search", "")}
              aria-label="Clear payment search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="payment-status-filter"
              className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Status
            </label>

            <select
              id="payment-status-filter"
              value={filters.status}
              onChange={(event) =>
                updateFilter(
                  "status",
                  event.target.value as PaymentFilterValues["status"],
                )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-method-filter"
              className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Payment Method
            </label>

            <select
              id="payment-method-filter"
              value={filters.paymentMethod}
              onChange={(event) =>
                updateFilter(
                  "paymentMethod",
                  event.target.value as PaymentFilterValues["paymentMethod"],
                )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              {paymentMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-currency-filter"
              className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Currency
            </label>

            <select
              id="payment-currency-filter"
              value={filters.currency}
              onChange={(event) =>
                updateFilter(
                  "currency",
                  event.target.value as PaymentFilterValues["currency"],
                )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-sort-filter"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              <ArrowDownUp className="h-3.5 w-3.5" />
              Sort By
            </label>

            <select
              id="payment-sort-filter"
              value={filters.sortBy}
              onChange={(event) =>
                updateFilter(
                  "sortBy",
                  event.target.value as PaymentFilterValues["sortBy"],
                )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 overflow-hidden border-t border-slate-100 pt-3 dark:border-slate-800"
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Active:
              </span>

              {filters.search.trim() && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Search className="h-3 w-3" />
                  Search
                </span>
              )}

              {filters.status !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <CreditCard className="h-3 w-3" />
                  {formatStatusLabel(filters.status)}
                </span>
              )}

              {filters.paymentMethod !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <WalletCards className="h-3 w-3" />
                  {formatMethodLabel(filters.paymentMethod)}
                </span>
              )}

              {filters.currency !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {filters.currency}
                </span>
              )}

              {filters.sortBy !== "newest" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {filters.sortBy === "name-asc" ? (
                    <ArrowDownAZ className="h-3 w-3" />
                  ) : filters.sortBy === "name-desc" ? (
                    <ArrowUpAZ className="h-3 w-3" />
                  ) : (
                    <ArrowDownUp className="h-3 w-3" />
                  )}
                  Sorted
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}