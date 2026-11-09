
"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SupportSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  resultCount?: number;
  resultLabel?: string;
  disabled?: boolean;
}

export default function SupportSearch({
  value,
  onChange,
  placeholder = "Search tickets, topics, or questions...",
  label = "Search Support",
  resultCount,
  resultLabel = "results",
  disabled = false,
}: SupportSearchProps) {
  const hasQuery = value.trim().length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <label
        htmlFor="support-feature-search"
        className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        />

        <input
          id="support-feature-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-950"
        />

        {hasQuery && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            aria-label="Clear support search"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          Search by ticket number, subject, category, or keywords.
        </p>

        {typeof resultCount === "number" && (
          <p
            aria-live="polite"
            className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            {resultCount} {resultLabel}
          </p>
        )}
      </div>
    </motion.section>
  );
}
