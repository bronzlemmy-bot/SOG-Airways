"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
Filter,
RotateCcw,
Search,
SlidersHorizontal,
X,
} from "lucide-react";

import type { PassengerStatus } from "./admin-passengers-data/AdminPassengersData";

export type PassengerSortOption =
| "newest"
| "oldest"
| "name-asc"
| "name-desc"
| "bookings-high"
| "bookings-low";

export interface PassengerFilterValues {
search: string;
status: PassengerStatus | "all";
nationality: string;
sortBy: PassengerSortOption;
}

interface PassengerFiltersProps {
filters: PassengerFilterValues;
nationalities: string[];
onChange: (filters: PassengerFilterValues) => void;
onReset: () => void;
}

const statusOptions: Array<{
value: PassengerStatus | "all";
label: string;
}> = [
{
value: "all",
label: "All Statuses",
},
{
value: "active",
label: "Active",
},
{
value: "inactive",
label: "Inactive",
},
{
value: "pending",
label: "Pending",
},
{
value: "suspended",
label: "Suspended",
},
];

const sortOptions: Array<{
value: PassengerSortOption;
label: string;
}> = [
{
value: "newest",
label: "Newest Registered",
},
{
value: "oldest",
label: "Oldest Registered",
},
{
value: "name-asc",
label: "Name A–Z",
},
{
value: "name-desc",
label: "Name Z–A",
},
{
value: "bookings-high",
label: "Most Bookings",
},
{
value: "bookings-low",
label: "Fewest Bookings",
},
];

export default function PassengerFilters({
filters,
nationalities,
onChange,
onReset,
}: PassengerFiltersProps) {
const hasActiveFilters =
filters.search.trim() !== "" ||
filters.status !== "all" ||
filters.nationality !== "" ||
filters.sortBy !== "newest";

const updateSearch = (value: string) => {
onChange({
...filters,
search: value,
});
};

const updateStatus = (value: PassengerStatus | "all") => {
onChange({
...filters,
status: value,
});
};

const updateNationality = (value: string) => {
onChange({
...filters,
nationality: value,
});
};

const updateSort = (value: PassengerSortOption) => {
onChange({
...filters,
sortBy: value,
});
};

const clearSearch = () => {
updateSearch("");
};

return (
<motion.section
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
className="w-full"
> <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
{/* HEADER */} <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 dark:border-slate-800"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400"> <SlidersHorizontal className="h-5 w-5" /> </div>


          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Passenger Filters
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Search and organize passenger records
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* FILTER CONTENT */}
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* SEARCH */}
        <div className="md:col-span-2 xl:col-span-2">
          <label
            htmlFor="passenger-search"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Search Passengers
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

            <input
              id="passenger-search"
              type="search"
              value={filters.search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search by name, ID, email, phone or passport..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

            <AnimatePresence>
              {filters.search && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearSearch}
                  aria-label="Clear passenger search"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label
            htmlFor="passenger-status"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Status
          </label>

          <select
            id="passenger-status"
            value={filters.status}
            onChange={(event) =>
              updateStatus(
                event.target.value as PassengerStatus | "all",
              )
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* NATIONALITY */}
        <div>
          <label
            htmlFor="passenger-nationality"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Nationality
          </label>

          <select
            id="passenger-nationality"
            value={filters.nationality}
            onChange={(event) =>
              updateNationality(event.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="">All Nationalities</option>

            {nationalities.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SORT */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Filter className="h-4 w-4" />

          <span>Sort passenger records</span>
        </div>

        <div className="w-full sm:w-64">
          <label htmlFor="passenger-sort" className="sr-only">
            Sort passenger records
          </label>

          <select
            id="passenger-sort"
            value={filters.sortBy}
            onChange={(event) =>
              updateSort(event.target.value as PassengerSortOption)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
</motion.section>


);
}
