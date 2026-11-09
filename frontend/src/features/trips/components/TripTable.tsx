
"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  MapPin,
  Plane,
  RefreshCw,
  Users,
} from "lucide-react";

import type { Trip } from "@/types";

import TripActions from "./TripActions";
import TripCard from "./TripCard";
import TripStatusBadge from "./TripStatusBadge";

interface TripTableProps {
  trips: Trip[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  className?: string;
}

const formatDate = (value?: string): string => {
  if (!value) return "Not provided";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateRange = (
  startDate: string,
  endDate: string,
): string => {
  if (!startDate && !endDate) {
    return "Dates unavailable";
  }

  if (!startDate) return formatDate(endDate);
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
};

function TripTableSkeleton() {
  return (
    <div
      aria-label="Loading trips"
      aria-busy="true"
      className="space-y-3"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800/70" />
          <div className="mt-5 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/70" />
        </div>
      ))}
      <span className="sr-only">Loading trip records.</span>
    </div>
  );
}

function EmptyTrips() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
        <Plane size={27} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">
        No trips to display
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        No trips match the current results. Try changing your filters
        or create a trip to get started.
      </p>
    </div>
  );
}

export default function TripTable({
  trips,
  isLoading = false,
  error = null,
  onRetry,
  onView,
  onEdit,
  onCancel,
  onDelete,
  className = "",
}: TripTableProps) {
  if (isLoading && trips.length === 0) {
    return (
      <section className={className}>
        <TripTableSkeleton />
      </section>
    );
  }

  if (trips.length === 0 && !isLoading && error) {
    return (
      <section className={className}>
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600 dark:text-red-300"
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-red-800 dark:text-red-200">
                Unable to load trips
              </h3>

              <p className="mt-1 break-words text-sm text-red-700 dark:text-red-300">
                {error}
              </p>

              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={isLoading}
                  className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (trips.length === 0 && !isLoading) {
    return (
      <section className={className}>
        <EmptyTrips />
      </section>
    );
  }

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Results header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Trip records
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review routes, travel dates, passengers, and trip status.
          </p>
        </div>

        <span
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          aria-live="polite"
        >
          {trips.length} {trips.length === 1 ? "trip" : "trips"}
          {isLoading && (
            <RefreshCw
              size={13}
              className="animate-spin"
              aria-label="Refreshing"
            />
          )}
        </span>
      </div>

      {/* Error while retaining existing results */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <div className="flex-1">
            <p className="font-semibold">
              Trip data could not be refreshed.
            </p>
            <p className="mt-1">{error}</p>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isLoading}
              className="shrink-0 rounded-lg px-3 py-2 font-semibold hover:bg-amber-100 disabled:opacity-50 dark:hover:bg-amber-900/40"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Mobile layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {trips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.025 }}
          >
            <TripCard
              trip={trip}
              onView={onView}
              onEdit={onEdit}
              onCancel={onCancel}
              onDelete={onDelete}
              disabled={isLoading}
            />
          </motion.div>
        ))}
      </div>

      {/* Tablet and desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th
                  scope="col"
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Trip / Booking
                </th>

                <th
                  scope="col"
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Route
                </th>

                <th
                  scope="col"
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Travel dates
                </th>

                <th
                  scope="col"
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Passengers
                </th>

                <th
                  scope="col"
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trips.map((trip, index) => {
                const firstSegment = trip.segments[0];
                const lastSegment =
                  trip.segments[trip.segments.length - 1];

                const heading =
                  trip.title?.trim() ||
                  trip.destination?.trim() ||
                  "Trip";

                const departureCode =
                  firstSegment?.departureAirportCode || "—";

                const arrivalCode =
                  lastSegment?.arrivalAirportCode || "—";

                const departureName =
                  firstSegment?.departureAirportName ||
                  "Departure airport unavailable";

                const arrivalName =
                  lastSegment?.arrivalAirportName ||
                  trip.destination ||
                  "Arrival airport unavailable";

                return (
                  <motion.tr
                    key={trip.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.18,
                      delay: index * 0.02,
                    }}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    {/* Trip and booking */}
                    <td className="max-w-[240px] px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onView(trip)}
                        disabled={isLoading}
                        className="max-w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                      >
                        <span className="block truncate text-sm font-bold text-slate-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-300">
                          {heading}
                        </span>

                        <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">
                          {trip.bookingReference || "No booking reference"}
                        </span>

                        <span className="mt-1 block truncate text-[11px] text-slate-400 dark:text-slate-500">
                          ID: {trip.id}
                        </span>
                      </button>
                    </td>

                    {/* Route */}
                    <td className="px-5 py-4">
                      <div className="flex min-w-[230px] items-center gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {departureCode}
                          </p>
                          <p className="mt-1 max-w-[130px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {departureName}
                          </p>
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Plane size={15} aria-hidden="true" />
                          <div className="h-px w-full border-t border-dashed border-slate-300 dark:border-slate-700" />
                        </div>

                        <div className="min-w-0 text-right">
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {arrivalCode}
                          </p>
                          <p className="mt-1 max-w-[130px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {arrivalName}
                          </p>
                        </div>
                      </div>

                      {trip.segments.length > 1 && (
                        <p className="mt-2 text-[11px] text-slate-400">
                          {trip.segments.length} flight segments
                        </p>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <CalendarDays
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-400"
                          aria-hidden="true"
                        />

                        <span className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                          {formatDateRange(
                            trip.startDate,
                            trip.endDate,
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Passenger count */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Users
                          size={16}
                          className="text-slate-400"
                          aria-hidden="true"
                        />
                        <span>{trip.passengerCount}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <TripStatusBadge status={trip.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <TripActions
                        trip={trip}
                        onView={onView}
                        onEdit={onEdit}
                        onCancel={onCancel}
                        onDelete={onDelete}
                        disabled={isLoading}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {trips.length} {trips.length === 1 ? "record" : "records"}
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={13} aria-hidden="true" />
            SOG Airways Trip Management
          </p>
        </div>
      </div>
    </section>
  );
}
