"use client";

import {
CalendarDays,
CreditCard,
Filter,
Search,
X,
} from "lucide-react";

import type {
AdminBookingClass,
AdminBookingStatus,
AdminPaymentStatus,
} from "./admin-bookings-data/AdminBookingsData";

interface BookingFiltersProps {
searchQuery: string;
statusFilter: AdminBookingStatus | "all";
paymentFilter: AdminPaymentStatus | "all";
classFilter: AdminBookingClass | "all";
onSearchChange: (value: string) => void;
onStatusChange: (
value: AdminBookingStatus | "all",
) => void;
onPaymentChange: (
value: AdminPaymentStatus | "all",
) => void;
onClassChange: (
value: AdminBookingClass | "all",
) => void;
onClearFilters: () => void;
}

export default function BookingFilters({
searchQuery,
statusFilter,
paymentFilter,
classFilter,
onSearchChange,
onStatusChange,
onPaymentChange,
onClassChange,
onClearFilters,
}: BookingFiltersProps) {
const hasActiveFilters =
searchQuery.trim() !== "" ||
statusFilter !== "all" ||
paymentFilter !== "all" ||
classFilter !== "all";

return ( <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"> <div className="flex flex-col gap-4"> <div className="flex items-center justify-between gap-3"> <div className="flex items-center gap-2"> <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Filter className="h-4 w-4" /> </div>


        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Filter Bookings
          </h2>

          <p className="hidden text-xs text-slate-400 sm:block">
            Search and filter booking records
          </p>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>

    <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.5fr)_repeat(3,minmax(150px,1fr))]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search booking, passenger, flight..."
          aria-label="Search bookings"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>

      <div className="relative">
        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(
              event.target.value as AdminBookingStatus | "all",
            )
          }
          aria-label="Filter by booking status"
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      <div className="relative">
        <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          value={paymentFilter}
          onChange={(event) =>
            onPaymentChange(
              event.target.value as AdminPaymentStatus | "all",
            )
          }
          aria-label="Filter by payment status"
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 1.04l-4.25 4.5a.75.75 0 01-1.06-.02.75.75 0 01.02-1.06l3.71-3.94-3.71-3.94a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
              transform="rotate(90 10 10)"
            />
          </svg>
        </span>
      </div>

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <select
          value={classFilter}
          onChange={(event) =>
            onClassChange(
              event.target.value as AdminBookingClass | "all",
            )
          }
          aria-label="Filter by cabin class"
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          <option value="all">All Classes</option>
          <option value="Economy">Economy</option>
          <option value="Premium Economy">Premium Economy</option>
          <option value="Business">Business</option>
          <option value="First">First</option>
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 111.08-1.04l-4.25 4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</div>


);
}
