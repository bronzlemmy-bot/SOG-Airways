
"use client";

import {
  ArrowDownUp,
  CalendarDays,
  FilterX,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  TRIP_FILTERS,
  TRIP_SORT_OPTIONS,
} from "@/constants/trip";

type TripFilterValue = (typeof TRIP_FILTERS)[number];
type TripSortValue = (typeof TRIP_SORT_OPTIONS)[number];

interface TripFiltersProps {
  search: string;
  status: TripFilterValue;
  sortBy: TripSortValue;
  startDate: string;
  endDate: string;
  totalCount: number;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TripFilterValue) => void;
  onSortChange: (value: TripSortValue) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

const STATUS_LABELS: Record<TripFilterValue, string> = {
  all: "All statuses",
  upcoming: "Upcoming",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const SORT_LABELS: Record<TripSortValue, string> = {
  "date-asc": "Travel date: earliest first",
  "date-desc": "Travel date: latest first",
  "destination-asc": "Destination: A–Z",
  "destination-desc": "Destination: Z–A",
  status: "Trip status",
};

const inputStyles =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500";

const labelStyles =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

export default function TripFilters({
  search,
  status,
  sortBy,
  startDate,
  endDate,
  totalCount,
  filteredCount,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
  className = "",
}: TripFiltersProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    status !== "all" ||
    startDate.length > 0 ||
    endDate.length > 0 ||
    sortBy !== "date-desc";

  return (
    <section
      aria-label="Filter trips"
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}
    >
      {/* Section header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <SlidersHorizontal size={19} aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              Search and filter
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Find trips by booking reference, status, or travel date.
            </p>
          </div>
        </div>

        <p
          aria-live="polite"
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Showing{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {filteredCount}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {totalCount}
          </span>{" "}
          {totalCount === 1 ? "trip" : "trips"}
        </p>
      </div>

      {/* Search input */}
      <div className="mt-5">
        <label htmlFor="trip-search" className={labelStyles}>
          Search trips
        </label>

        <div className="relative">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="trip-search"
            name="tripSearch"
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search booking reference, trip ID, user, flight, or destination..."
            className={`${inputStyles} pl-10`}
          />
        </div>
      </div>

      {/* Status, sorting and date filters */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="trip-status-filter"
            className={labelStyles}
          >
            Trip status
          </label>

          <select
            id="trip-status-filter"
            name="tripStatus"
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value as TripFilterValue,
              )
            }
            className={inputStyles}
          >
            {TRIP_FILTERS.map((filter) => (
              <option key={filter} value={filter}>
                {STATUS_LABELS[filter]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="trip-sort" className={labelStyles}>
            Sort by
          </label>

          <div className="relative">
            <ArrowDownUp
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              id="trip-sort"
              name="tripSort"
              value={sortBy}
              onChange={(event) =>
                onSortChange(
                  event.target.value as TripSortValue,
                )
              }
              className={`${inputStyles} pl-10`}
            >
              {TRIP_SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {SORT_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="trip-start-date"
            className={labelStyles}
          >
            Travel date from
          </label>

          <div className="relative">
            <CalendarDays
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="trip-start-date"
              name="tripStartDate"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) =>
                onStartDateChange(event.target.value)
              }
              className={`${inputStyles} pl-10`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="trip-end-date"
            className={labelStyles}
          >
            Travel date to
          </label>

          <div className="relative">
            <CalendarDays
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="trip-end-date"
              name="tripEndDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) =>
                onEndDateChange(event.target.value)
              }
              className={`${inputStyles} pl-10`}
            />
          </div>
        </div>
      </div>

      {/* Reset action */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          Results update automatically when you change a filter.
        </p>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
        >
          <FilterX size={16} aria-hidden="true" />
          Reset filters
        </button>
      </div>
    </section>
  );
}
