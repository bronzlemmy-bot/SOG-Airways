"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Plane,
  Users,
} from "lucide-react";

import { formatCurrency } from "@/lib/formatters/currency";
import {
  formatFlightDuration,
  formatFlightStatus,
} from "@/lib/formatters/flight";
import type { Flight } from "@/types/flight";

interface FlightResultCardProps {
  flight: Flight;
  selected?: boolean;
  onSelect?: (flight: Flight) => void;
}

export default function FlightResultCard({
  flight,
  selected = false,
  onSelect,
}: FlightResultCardProps) {
  const handleSelect = () => {
    onSelect?.(flight);
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition dark:bg-slate-950 ${
        selected
          ? "border-sky-500 ring-2 ring-sky-500/10"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {selected && (
        <div className="absolute right-4 top-4">
          <CheckCircle2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Plane className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {flight.flightNumber}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {flight.type === "international"
                  ? "International flight"
                  : "Domestic flight"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                flight.status === "scheduled"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : flight.status === "delayed"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : flight.status === "cancelled"
                      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      : "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
              }`}
            >
              {formatFlightStatus(flight.status)}
            </span>

            {flight.terminal && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                Terminal {flight.terminal}
              </span>
            )}
          </div>
        </div>

        {/* Route */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Departure */}
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {flight.schedule.departureTime}
            </p>

            <p className="mt-1 text-lg font-bold text-slate-700 dark:text-slate-200">
              {flight.route.departureAirportCode}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {flight.route.departureAirportName}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {flight.schedule.departureDate}
            </p>
          </div>

          {/* Flight Path */}
          <div className="flex items-center gap-3 lg:min-w-45 lg:flex-col">
            <div className="hidden h-px w-full bg-slate-200 lg:block dark:bg-slate-800" />

            <div className="flex shrink-0 items-center gap-2 text-slate-400">
              <Clock3 className="h-4 w-4" />

              <span className="text-xs font-medium">
                {formatFlightDuration(
                  flight.schedule.durationMinutes,
                )}
              </span>
            </div>

            <div className="flex w-full items-center gap-2 lg:hidden">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <ArrowRight className="h-4 w-4 shrink-0 text-sky-500" />

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="hidden h-px w-full bg-slate-200 lg:block dark:bg-slate-800" />
          </div>

          {/* Arrival */}
          <div className="lg:text-right">
            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {flight.schedule.arrivalTime}
            </p>

            <p className="mt-1 text-lg font-bold text-slate-700 dark:text-slate-200">
              {flight.route.arrivalAirportCode}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {flight.route.arrivalAirportName}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {flight.schedule.arrivalDate}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />

              <span className="text-xs text-slate-500 dark:text-slate-400">
                Seats available
              </span>
            </div>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {flight.availableSeats}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cabin classes
            </p>

            <div className="mt-1 flex flex-wrap gap-1.5">
              {flight.cabinClasses.map(
                (cabinClass) => (
                  <span
                    key={cabinClass}
                    className="text-xs font-medium capitalize text-slate-700 dark:text-slate-300"
                  >
                    {cabinClass.replace(
                      "-",
                      " ",
                    )}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2 lg:col-span-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aircraft
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {flight.aircraftRegistration ||
                flight.aircraftId}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fare from
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(
                flight.price,
                flight.currency,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Per passenger
            </p>
          </div>

          <button
            type="button"
            onClick={handleSelect}
            disabled={!onSelect}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              onSelect
                ? selected
                  ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  : "bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            {selected
              ? "Selected"
              : "Select flight"}

            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}