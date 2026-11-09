"use client";

import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  CheckCheck,
  RotateCcw,
  X,
} from "lucide-react";
import type { NotificationType } from "@/types";

export type NotificationReadFilter = "all" | "read" | "unread";

interface NotificationFiltersProps {
  search: string;
  selectedType: NotificationType | "all";
  readFilter: NotificationReadFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: NotificationType | "all") => void;
  onReadFilterChange: (value: NotificationReadFilter) => void;
  onReset: () => void;
  resultCount: number;
}

const notificationTypes: {
  label: string;
  value: NotificationType | "all";
}[] = [
  { label: "All categories", value: "all" },
  { label: "Bookings", value: "booking" },
  { label: "Flights", value: "flight" },
  { label: "Payments", value: "payment" },
  { label: "Travel", value: "travel" },
  { label: "Check-in", value: "check-in" },
  { label: "System", value: "system" },
];

const readOptions: {
  label: string;
  value: NotificationReadFilter;
}[] = [
  { label: "All notifications", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

export default function NotificationFilters({
  search,
  selectedType,
  readFilter,
  onSearchChange,
  onTypeChange,
  onReadFilterChange,
  onReset,
  resultCount,
}: NotificationFiltersProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedType !== "all" ||
    readFilter !== "all";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
      aria-label="Filter notifications"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Find notifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search and narrow down your updates.
            </p>
          </div>
        </div>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">
            {resultCount}
          </span>{" "}
          {resultCount === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_minmax(180px,1fr)_auto]">
        <div className="relative">
          <label
            htmlFor="notification-search"
            className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Search
          </label>

          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-[42px] -translate-y-1/2 text-slate-400"
          />

          <input
            id="notification-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search titles or messages..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-[42px] -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div>
          <label
            htmlFor="notification-type"
            className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Category
          </label>

          <select
            id="notification-type"
            value={selectedType}
            onChange={(event) =>
              onTypeChange(event.target.value as NotificationType | "all")
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {notificationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="notification-read-status"
            className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Read status
          </label>

          <div className="relative">
            <CheckCheck
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              id="notification-read-status"
              value={readFilter}
              onChange={(event) =>
                onReadFilterChange(
                  event.target.value as NotificationReadFilter,
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {readOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 md:col-span-2 xl:col-span-1"
          >
            <RotateCcw size={15} />
            Reset filters
          </button>
        </div>
      </div>
    </motion.section>
  );
}