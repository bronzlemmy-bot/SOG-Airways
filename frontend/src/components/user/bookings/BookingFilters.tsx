
"use client";

import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Filter, Search, X } from "lucide-react";

export interface BookingFilterValues {
  search: string;
  status: string;
  date: string;
}

interface BookingFiltersProps {
  filters: BookingFilterValues;
  onFiltersChange: (
    filters: BookingFilterValues
  ) => void;
  onClear?: () => void;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingFilters({
  filters,
  onFiltersChange,
  onClear,
}: BookingFiltersProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.date !== "";

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      search: event.target.value,
    });
  };

  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    onFiltersChange({
      ...filters,
      status: event.target.value,
    });
  };

  const handleDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      date: event.target.value,
    });
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }

    onFiltersChange({
      search: "",
      status: "all",
      date: "",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      aria-label="Booking filters"
      className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 sm:p-5">
        {/* Filter Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              <Filter className="h-4 w-4 text-slate-700" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Find a Booking
              </h2>

              <p className="text-xs text-slate-500">
                Search and filter your bookings
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:self-auto"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(180px,0.75fr)_minmax(180px,0.75fr)]">

          {/* Search */}
          <div className="relative">
            <label
              htmlFor="booking-search"
              className="sr-only"
            >
              Search bookings
            </label>

            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="booking-search"
              type="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search booking reference, destination..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <label
              htmlFor="booking-status"
              className="sr-only"
            >
              Booking status
            </label>

            <select
              id="booking-status"
              value={filters.status}
              onChange={handleStatusChange}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Date */}
          <div className="relative">
            <label
              htmlFor="booking-date"
              className="sr-only"
            >
              Booking date
            </label>

            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="booking-date"
              type="date"
              value={filters.date}
              onChange={handleDateChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
        </div>

        {/* Active Filter Summary */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25 }}
            className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4"
          >
            <span className="text-xs font-medium text-slate-400">
              Active:
            </span>

            {filters.search.trim() && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                <Search className="h-3 w-3" />
                {filters.search.trim()}
              </span>
            )}

            {filters.status !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                <Filter className="h-3 w-3" />
                {filters.status}
              </span>
            )}

            {filters.date && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                <CalendarDays className="h-3 w-3" />
                {filters.date}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
