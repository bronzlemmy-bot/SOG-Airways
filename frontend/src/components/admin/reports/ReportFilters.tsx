"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import type {
  ReportPeriod,
  ReportStatus,
  ReportType,
} from "./admin-reports-data/ReportsData";

export type ReportSortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "revenue-high"
  | "revenue-low";

export interface ReportFilterValues {
  search: string;
  reportType: ReportType | "all";
  status: ReportStatus | "all";
  period: ReportPeriod | "all";
  sortBy: ReportSortOption;
}

interface ReportFiltersProps {
  filters: ReportFilterValues;
  onChange: (filters: ReportFilterValues) => void;
  onReset: () => void;
}

export default function ReportFilters({
  filters,
  onChange,
  onReset,
}: ReportFiltersProps) {
  const updateFilter = <K extends keyof ReportFilterValues>(
    key: K,
    value: ReportFilterValues[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Report Filters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search and organize your reports
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search reports..."
            aria-label="Search reports"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <select
          value={filters.reportType}
          onChange={(event) =>
            updateFilter(
              "reportType",
              event.target.value as ReportFilterValues["reportType"],
            )
          }
          aria-label="Filter by report type"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">All Types</option>
          <option value="overview">Overview</option>
          <option value="revenue">Revenue</option>
          <option value="bookings">Bookings</option>
          <option value="passengers">Passengers</option>
          <option value="flights">Flights</option>
          <option value="payments">Payments</option>
        </select>

        <select
          value={filters.status}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value as ReportFilterValues["status"],
            )
          }
          aria-label="Filter by report status"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={filters.period}
          onChange={(event) =>
            updateFilter(
              "period",
              event.target.value as ReportFilterValues["period"],
            )
          }
          aria-label="Filter by report period"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">All Periods</option>
          <option value="today">Today</option>
          <option value="7-days">Last 7 Days</option>
          <option value="30-days">Last 30 Days</option>
          <option value="90-days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) =>
            updateFilter(
              "sortBy",
              event.target.value as ReportFilterValues["sortBy"],
            )
          }
          aria-label="Sort reports"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="revenue-high">Revenue: High–Low</option>
          <option value="revenue-low">Revenue: Low–High</option>
        </select>
      </div>
    </section>
  );
}