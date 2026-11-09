"use client";

import { motion } from "framer-motion";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";

import type {
Aircraft,
AircraftStatus,
AircraftType,
} from "./aircraft-data/AircraftData";

interface AircraftFiltersProps {
aircraft: Aircraft[];
searchQuery: string;
selectedStatus: AircraftStatus | "all";
selectedType: AircraftType | "all";
selectedAirport: string;
onSearchChange: (value: string) => void;
onStatusChange: (value: AircraftStatus | "all") => void;
onTypeChange: (value: AircraftType | "all") => void;
onAirportChange: (value: string) => void;
onReset: () => void;
}

const statusOptions: Array<{
label: string;
value: AircraftStatus | "all";
}> = [
{ label: "All Statuses", value: "all" },
{ label: "Active", value: "active" },
{ label: "Maintenance", value: "maintenance" },
{ label: "Inactive", value: "inactive" },
];

const typeOptions: Array<{
label: string;
value: AircraftType | "all";
}> = [
{ label: "All Aircraft Types", value: "all" },
{ label: "Airbus A320", value: "Airbus A320" },
{ label: "Airbus A321", value: "Airbus A321" },
{ label: "Airbus A330", value: "Airbus A330" },
{ label: "Boeing 737", value: "Boeing 737" },
{ label: "Boeing 787", value: "Boeing 787" },
];

export default function AircraftFilters({
aircraft,
searchQuery,
selectedStatus,
selectedType,
selectedAirport,
onSearchChange,
onStatusChange,
onTypeChange,
onAirportChange,
onReset,
}: AircraftFiltersProps) {
const airportOptions = useMemo(() => {
const airports = Array.from(
new Set(
aircraft.map(
(item) => `${item.currentAirportCode} — ${item.currentAirport}`,
),
),
);


return airports.sort();


}, [aircraft]);

const hasActiveFilters =
searchQuery.trim() !== "" ||
selectedStatus !== "all" ||
selectedType !== "all" ||
selectedAirport !== "all";

return (
<motion.section
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}
className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
>
{/* Header */} <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <SlidersHorizontal className="h-4 w-4" /> </div>

```
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">
            Fleet Filters
          </h2>

          <Filter className="h-3.5 w-3.5 text-slate-400" />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search and narrow the aircraft fleet.
        </p>
      </div>
    </div>

    {hasActiveFilters && (
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 sm:self-auto dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-800 dark:hover:bg-sky-950/30 dark:hover:text-sky-400"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset filters
      </button>
    )}
  </div>

  {/* Search */}
  <div className="relative">
    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

    <input
      type="search"
      value={searchQuery}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search registration, model, aircraft type, or airport..."
      aria-label="Search aircraft"
      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-600 dark:focus:bg-slate-800"
    />
  </div>

  {/* Select filters */}
  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
        Status
      </span>

      <select
        value={selectedStatus}
        onChange={(event) =>
          onStatusChange(
            event.target.value as AircraftStatus | "all",
          )
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-sky-600"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>

    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
        Aircraft Type
      </span>

      <select
        value={selectedType}
        onChange={(event) =>
          onTypeChange(event.target.value as AircraftType | "all")
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-sky-600"
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>

    <label className="block sm:col-span-2 lg:col-span-1">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
        Current Airport
      </span>

      <select
        value={selectedAirport}
        onChange={(event) => onAirportChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-sky-600"
      >
        <option value="all">All Airports</option>

        {airportOptions.map((airport) => (
          <option key={airport} value={airport}>
            {airport}
          </option>
        ))}
      </select>
    </label>
  </div>

  {/* Active filter summary */}
  <div className="mt-4 flex flex-wrap items-center gap-2">
    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
      Filters:
    </span>

    {selectedStatus !== "all" && (
      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
        {selectedStatus}
      </span>
    )}

    {selectedType !== "all" && (
      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
        {selectedType}
      </span>
    )}

    {selectedAirport !== "all" && (
      <span className="max-w-full truncate rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
        {selectedAirport}
      </span>
    )}

    {searchQuery.trim() !== "" && (
      <span className="max-w-full truncate rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
        Search: {searchQuery}
      </span>
    )}

    {!hasActiveFilters && (
      <span className="text-xs text-slate-400 dark:text-slate-500">
        None
      </span>
    )}
  </div>
</motion.section>


);
}
