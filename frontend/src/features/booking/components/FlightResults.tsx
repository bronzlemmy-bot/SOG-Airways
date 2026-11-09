"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Plane,
  SearchX,
} from "lucide-react";

import type { Flight } from "@/types/flight";

interface FlightResultProps {
  flights: Flight[];
  loading?: boolean;
  error?: string | null;
  onSelectFlight?: (
    flight: Flight,
  ) => void;
}

export default function FlightResult({
  flights,
  loading = false,
  error = null,
  onSelectFlight,
}: FlightResultProps) {
  if (loading) {
    return (
      <section
        aria-label="Loading flight results"
        className="w-full"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <div className="h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-4 h-8 w-64 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
                  <div className="mt-3 h-4 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
                </div>

                <div className="h-12 w-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        aria-label="Flight search error"
        className="w-full"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              We couldn&apos;t load the flights
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
              {error}
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  if (flights.length === 0) {
    return (
      <section
        aria-label="No flight results"
        className="w-full"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <SearchX className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            No flights found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            We couldn&apos;t find any flights matching
            your search. Try changing your dates,
            route, or cabin class.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      aria-label="Available flights"
      className="w-full"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Plane className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Available Flights
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {flights.length}{" "}
            {flights.length === 1
              ? "flight"
              : "flights"}{" "}
            available for your search
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {flights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            <FlightResultCardPlaceholder
              flight={flight}
              onSelectFlight={
                onSelectFlight
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

interface FlightResultCardPlaceholderProps {
  flight: Flight;
  onSelectFlight?: (
    flight: Flight,
  ) => void;
}

function FlightResultCardPlaceholder({
  flight,
  onSelectFlight,
}: FlightResultCardPlaceholderProps) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelectFlight?.(flight)
      }
      disabled={!onSelectFlight}
      className={`w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-950 ${
        onSelectFlight
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:hover:border-sky-800"
          : "cursor-default"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {flight.flightNumber}
            </span>

            <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {flight.type}
            </span>

            <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {flight.status}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {flight.schedule.departureTime}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {flight.route.departureAirportCode}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {flight.route.departureAirportName}
              </p>
            </div>

            <div className="flex flex-1 items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <div className="shrink-0 text-center">
                <Plane className="mx-auto h-4 w-4 rotate-90 text-sky-500" />

                <p className="mt-1 text-xs text-slate-400">
                  {flight.schedule.durationMinutes} min
                </p>
              </div>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {flight.schedule.arrivalTime}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {flight.route.arrivalAirportCode}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {flight.route.arrivalAirportName}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 lg:w-44 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            From
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {flight.currency}{" "}
            {flight.price.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {flight.availableSeats} seats
            available
          </p>

          <span className="mt-3 inline-flex rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
            Select flight
          </span>
        </div>
      </div>
    </button>
  );
}