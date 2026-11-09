"use client";

import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";

import type {
AirportStatus,
AirportType,
} from "./airports-data/AirportsData";

interface AirportFiltersProps {
searchQuery: string;
statusFilter: AirportStatus | "all";
typeFilter: AirportType | "all";
countryFilter: string;
countries: string[];
onSearchChange: (value: string) => void;
onStatusChange: (value: AirportStatus | "all") => void;
onTypeChange: (value: AirportType | "all") => void;
onCountryChange: (value: string) => void;
onClearFilters: () => void;
}

export default function AirportFilters({
searchQuery,
statusFilter,
typeFilter,
countryFilter,
countries,
onSearchChange,
onStatusChange,
onTypeChange,
onCountryChange,
onClearFilters,
}: AirportFiltersProps) {
const hasActiveFilters =
searchQuery.trim() !== "" ||
statusFilter !== "all" ||
typeFilter !== "all" ||
countryFilter !== "all";

return (
<motion.section
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}
className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
> <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-center gap-2"> <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"> <Filter className="h-4 w-4" /> </div>


      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Filter Airports
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search and narrow down airport records.
        </p>
      </div>
    </div>

    {hasActiveFilters && (
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClearFilters}
        className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:self-auto"
      >
        <X className="h-3.5 w-3.5" />
        Clear filters
      </motion.button>
    )}
  </div>

  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    <div className="relative md:col-span-2 xl:col-span-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search airport, code, city..."
        aria-label="Search airports"
        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
      />
    </div>

    <select
      value={statusFilter}
      onChange={(event) =>
        onStatusChange(event.target.value as AirportStatus | "all")
      }
      aria-label="Filter by airport status"
      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      <option value="all">All Statuses</option>
      <option value="operational">Operational</option>
      <option value="limited">Limited Operations</option>
      <option value="closed">Closed</option>
    </select>

    <select
      value={typeFilter}
      onChange={(event) =>
        onTypeChange(event.target.value as AirportType | "all")
      }
      aria-label="Filter by airport type"
      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      <option value="all">All Types</option>
      <option value="international">International</option>
      <option value="domestic">Domestic</option>
      <option value="regional">Regional</option>
    </select>

    <select
      value={countryFilter}
      onChange={(event) => onCountryChange(event.target.value)}
      aria-label="Filter by country"
      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      <option value="all">All Countries</option>

      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  </div>
</motion.section>


);
}
