
"use client";

import { useState } from "react";
import {
  CreditCard,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { Payment, PaymentStatus } from "@/types";

export interface TransactionFilterValues {
  search: string;
  status: PaymentStatus | "all";
  method: Payment["methodType"] | "all";
}

interface TransactionFiltersProps {
  filters: TransactionFilterValues;
  onFiltersChange: (filters: TransactionFilterValues) => void;
  totalTransactions?: number;
  filteredTransactions?: number;
}

const STATUS_OPTIONS: {
  label: string;
  value: PaymentStatus | "all";
}[] = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Successful", value: "successful" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
  { label: "Partially refunded", value: "partially-refunded" },
];

const METHOD_OPTIONS: {
  label: string;
  value: Payment["methodType"] | "all";
}[] = [
  { label: "All methods", value: "all" },
  { label: "Card", value: "card" },
  { label: "Bank transfer", value: "bank-transfer" },
  { label: "Mobile money", value: "mobile-money" },
  { label: "Wallet", value: "wallet" },
  { label: "Other", value: "other" },
];

const EMPTY_FILTERS: TransactionFilterValues = {
  search: "",
  status: "all",
  method: "all",
};

export default function TransactionFilters({
  filters,
  onFiltersChange,
  totalTransactions,
  filteredTransactions,
}: TransactionFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = [
    filters.search.trim() !== "",
    filters.status !== "all",
    filters.method !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const updateFilter = <K extends keyof TransactionFilterValues>(
    key: K,
    value: TransactionFilterValues[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({ ...EMPTY_FILTERS });
    setMobileFiltersOpen(false);
  };

  const selectClassName =
    "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

  const filterControls = (
    <>
      <div className="min-w-0 flex-1">
        <label
          htmlFor="transaction-search"
          className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          Search transactions
        </label>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="transaction-search"
            type="search"
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder="Reference, booking ID or customer ID..."
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          {filters.search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="min-w-0 sm:w-48 sm:flex-none">
        <label
          htmlFor="transaction-status"
          className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          Payment status
        </label>

        <select
          id="transaction-status"
          value={filters.status}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value as PaymentStatus | "all",
            )
          }
          className={selectClassName}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0 sm:w-48 sm:flex-none">
        <label
          htmlFor="transaction-method"
          className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          Payment method
        </label>

        <select
          id="transaction-method"
          value={filters.method}
          onChange={(event) =>
            updateFilter(
              "method",
              event.target.value as Payment["methodType"] | "all",
            )
          }
          className={selectClassName}
        >
          {METHOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <section
      aria-label="Transaction filters"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            <SlidersHorizontal
              className="h-5 w-5"
              aria-hidden="true"
            />
          </span>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Transactions
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Search and filter payment records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {typeof filteredTransactions === "number" && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredTransactions}
              {typeof totalTransactions === "number"
                ? ` of ${totalTransactions}`
                : ""}{" "}
              transactions
            </span>
          )}

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            aria-expanded={mobileFiltersOpen}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 hidden gap-4 sm:flex sm:items-end">
        {filterControls}
      </div>

      {mobileFiltersOpen && (
        <div className="mt-5 space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:hidden">
          {filterControls}

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Apply filters
          </button>
        </div>
      )}
    </section>
  );
}
