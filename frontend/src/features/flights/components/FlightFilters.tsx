"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import type { Flight, FlightStatus, FlightType } from "@/types/flight";

export interface FlightFilterValues {
  search: string;
  status: FlightStatus | "all";
  type: FlightType | "all";
  departureDate: string;
}

interface FlightFiltersProps {
  flights: Flight[];
  value: FlightFilterValues;
  onChange: (filters: FlightFilterValues) => void;
  onReset?: () => void;
  className?: string;
}

const STATUS_OPTIONS: {
  value: FlightStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "boarding", label: "Boarding" },
  { value: "departed", label: "Departed" },
  { value: "in-air", label: "In Air" },
  { value: "landed", label: "Landed" },
  { value: "delayed", label: "Delayed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "diverted", label: "Diverted" },
];

const TYPE_OPTIONS: {
  value: FlightType | "all";
  label: string;
}[] = [
  { value: "all", label: "All flight types" },
  { value: "domestic", label: "Domestic" },
  { value: "international", label: "International" },
];

const selectClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500";

export default function FlightFilters({
  flights,
  value,
  onChange,
  onReset,
  className = "",
}: FlightFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (value.status !== "all") count += 1;
    if (value.type !== "all") count += 1;
    if (value.departureDate) count += 1;

    return count;
  }, [value.status, value.type, value.departureDate]);

  const matchingCount = useMemo(() => {
    const search = value.search.trim().toLowerCase();

    return flights.filter((flight) => {
      const searchableText = [
        flight.flightNumber,
        flight.route.departureAirportCode,
        flight.route.departureAirportName,
        flight.route.arrivalAirportCode,
        flight.route.arrivalAirportName,
        flight.aircraftId,
        flight.aircraftRegistration ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesStatus =
        value.status === "all" || flight.status === value.status;

      const matchesType =
        value.type === "all" || flight.type === value.type;

      const matchesDate =
        !value.departureDate ||
        flight.schedule.departureDate.slice(0, 10) ===
          value.departureDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDate
      );
    }).length;
  }, [flights, value]);

  const updateFilter = <K extends keyof FlightFilterValues>(
    key: K,
    nextValue: FlightFilterValues[K],
  ) => {
    onChange({
      ...value,
      [key]: nextValue,
    });
  };

  const resetFilters = () => {
    onReset?.();
    onChange({
      search: "",
      status: "all",
      type: "all",
      departureDate: "",
    });
  };

  const hasActiveFilters =
    value.search.trim() !== "" ||
    value.status !== "all" ||
    value.type !== "all" ||
    value.departureDate !== "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Flight search and filters"
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={value.search}
              onChange={(event) =>
                updateFilter("search", event.target.value)
              }
              placeholder="Search flight number, airport, or aircraft..."
              aria-label="Search flights"
              className={inputClassName}
            />

            {value.search && (
              <button
                type="button"
                onClick={() => updateFilter("search", "")}
                aria-label="Clear flight search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((current) => !current)}
            aria-expanded={showAdvanced}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
              showAdvanced || activeFilterCount > 0
                ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              key="advanced-flight-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="flight-status-filter"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Flight status
                  </label>

                  <select
                    id="flight-status-filter"
                    value={value.status}
                    onChange={(event) =>
                      updateFilter(
                        "status",
                        event.target.value as FlightStatus | "all",
                      )
                    }
                    className={selectClassName}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="flight-type-filter"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Flight type
                  </label>

                  <select
                    id="flight-type-filter"
                    value={value.type}
                    onChange={(event) =>
                      updateFilter(
                        "type",
                        event.target.value as FlightType | "all",
                      )
                    }
                    className={selectClassName}
                  >
                    {TYPE_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="flight-departure-date-filter"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Departure date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />

                    <input
                      id="flight-departure-date-filter"
                      type="date"
                      value={value.departureDate}
                      onChange={(event) =>
                        updateFilter("departureDate", event.target.value)
                      }
                      className={`${selectClassName} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {matchingCount}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {flights.length}
            </span>{" "}
            {flights.length === 1 ? "flight" : "flights"}
          </p>

          {hasActiveFilters && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Filter className="h-3 w-3" />
              Filters applied
            </span>
          )}
        </div>
      </div>
    </motion.section>
  );
}