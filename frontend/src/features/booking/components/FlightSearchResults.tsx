"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
  Filter,
  Plane,
  SlidersHorizontal,
} from "lucide-react";

import type { Flight } from "@/types/flight";
import FlightResult from "./FlightResults";

type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "duration";

interface FlightSearchResultProps {
  flights: Flight[];
  loading?: boolean;
  error?: string | null;
  from?: string;
  to?: string;
  departureDate?: string;
  passengers?: number;
  onSelectFlight?: (
    flight: Flight,
  ) => void;
}

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "recommended",
    label: "Recommended",
  },
  {
    value: "price-low",
    label: "Lowest price",
  },
  {
    value: "price-high",
    label: "Highest price",
  },
  {
    value: "duration",
    label: "Shortest duration",
  },
];

export default function FlightSearchResult({
  flights,
  loading = false,
  error = null,
  from,
  to,
  departureDate,
  passengers = 1,
  onSelectFlight,
}: FlightSearchResultProps) {
  const [sortBy, setSortBy] =
    useState<SortOption>("recommended");

  const [showFilters, setShowFilters] =
    useState(false);

  const sortedFlights = useMemo(() => {
    const result = [...flights];

    switch (sortBy) {
      case "price-low":
        return result.sort(
          (a, b) => a.price - b.price,
        );

      case "price-high":
        return result.sort(
          (a, b) => b.price - a.price,
        );

      case "duration":
        return result.sort(
          (a, b) =>
            a.schedule.durationMinutes -
            b.schedule.durationMinutes,
        );

      case "recommended":
      default:
        return result;
    }
  }, [flights, sortBy]);

  const formattedDate = departureDate
    ? new Date(
        `${departureDate}T00:00:00`,
      ).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : undefined;

  return (
    <section className="w-full">
      {/* Result Header */}
      {!loading &&
        !error &&
        flights.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                  <Plane className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    {from || "Departure"}{" "}
                    <span className="mx-1 text-slate-400">
                      →
                    </span>{" "}
                    {to || "Arrival"}
                  </h2>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    {formattedDate && (
                      <span>
                        {formattedDate}
                      </span>
                    )}

                    <span>
                      {passengers}{" "}
                      {passengers === 1
                        ? "passenger"
                        : "passengers"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {flights.length}{" "}
                  {flights.length === 1
                    ? "flight"
                    : "flights"}{" "}
                  found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Choose the flight that works
                  best for you
                </p>
              </div>
            </div>
          </motion.div>
        )}

      {/* Controls */}
      {!loading &&
        !error &&
        flights.length > 0 && (
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) => !current,
                )
              }
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition sm:w-auto ${
                showFilters
                  ? "border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700"
              }`}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <ArrowDownUp className="h-4 w-4 shrink-0 text-slate-400" />

              <label
                htmlFor="flight-sort"
                className="sr-only"
              >
                Sort flights
              </label>

              <select
                id="flight-sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target
                      .value as SortOption,
                  )
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 sm:w-52 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        )}

      {/* Filters */}
      {!loading &&
        !error &&
        flights.length > 0 &&
        showFilters && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="mb-5 overflow-hidden"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <Filter className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Flight filters
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    More flight filters can be
                    connected here later, such as
                    stops, price range, airline, and
                    departure time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      {/* Results */}
      <FlightResult
        flights={sortedFlights}
        loading={loading}
        error={error}
        onSelectFlight={onSelectFlight}
      />
    </section>
  );
}