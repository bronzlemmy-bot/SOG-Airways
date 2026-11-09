"use client";

import { motion } from "framer-motion";
import {
  Plane,
  MapPin,
  CalendarDays,
  Armchair,
  Banknote,
} from "lucide-react";

import type { Flight } from "@/types/flight";
import FlightActions from "./FlightActions";
import FlightStatusBadge from "./FlightStatusBadge";
import FlightEmptyState from "./FlightEmptyState";

interface FlightTableProps {
  flights: Flight[];
  onView: (flight: Flight) => void;
  onEdit: (flight: Flight) => void;
  onDelete: (flight: Flight) => void;
  onStatusChange?: (flight: Flight, status: Flight["status"]) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddFlight?: () => void;
  onResetFilters?: () => void;
  emptyMessage?: string;
  className?: string;
}

function formatDate(date: string): string {
  if (!date) return "—";

  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatTime(time: string): string {
  if (!time) return "—";

  const match = time.match(/^(\d{1,2}):(\d{2})/);

  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return time;

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2020, 0, 1, hours, minutes)));
}

function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "—";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

function formatPrice(price: number, currency: string): string {
  if (!Number.isFinite(price)) return "—";

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency || ""} ${price.toLocaleString()}`.trim();
  }
}

function TableSkeleton() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }, (_, index) => (
        <td key={index} className="px-5 py-5">
          <div className="h-4 w-full max-w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
        </td>
      ))}
    </tr>
  );
}

export default function FlightTable({
  flights,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
  error = null,
  onRetry,
  onAddFlight,
  onResetFilters,
  emptyMessage = "No flights match your current filters.",
  className = "",
}: FlightTableProps) {
  if (error && !loading) {
    return (
      <FlightEmptyState
        type="error"
        title="Unable to load flights"
        description={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (!loading && flights.length === 0) {
    return (
      <FlightEmptyState
        type={onResetFilters ? "filtered" : "empty"}
        title={onResetFilters ? "No matching flights" : "No flights yet"}
        description={emptyMessage}
        onAddFlight={onAddFlight}
        onResetFilters={onResetFilters}
        className={className}
      />
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Flight Schedule
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review routes, departure times, fares, and operational status.
          </p>
        </div>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Loading flights…" : `${flights.length} flight${flights.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-262.5 border-collapse text-left">
          <thead className="bg-slate-50 dark:bg-slate-950/60">
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Flight
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Route
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Departure
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Duration
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Seats
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fare
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading
              ? Array.from({ length: 5 }, (_, index) => (
                  <TableSkeleton key={index} />
                ))
              : flights.map((flight, index) => (
                  <motion.tr
                    key={flight.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.025 }}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                          <Plane className="h-5 w-5" />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => onView(flight)}
                            className="font-semibold text-slate-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white dark:hover:text-blue-400"
                          >
                            {flight.flightNumber}
                          </button>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {flight.aircraftRegistration || flight.aircraftId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                        <span>{flight.route.departureAirportCode}</span>
                        <span className="text-slate-400">→</span>
                        <span>{flight.route.arrivalAirportCode}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="max-w-56 truncate">
                          {flight.route.departureAirportName} to{" "}
                          {flight.route.arrivalAirportName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                        <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                        {formatDate(flight.schedule.departureDate)}
                      </div>
                      <p className="mt-1 pl-6 text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(flight.schedule.departureTime)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {formatDuration(flight.schedule.durationMinutes)}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                        {flight.type}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <Armchair className="h-4 w-4 text-slate-400" />
                        {flight.availableSeats} / {flight.totalSeats}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        available
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                        <Banknote className="h-4 w-4 shrink-0 text-slate-400" />
                        {formatPrice(flight.price, flight.currency)}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        per passenger
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <FlightStatusBadge status={flight.status} />
                      {flight.status === "delayed" &&
                        typeof flight.delayMinutes === "number" && (
                          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                            +{flight.delayMinutes} min
                          </p>
                        )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end">
                        <FlightActions
                          flight={flight}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onStatusChange={onStatusChange}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && flights.length > 0 && (
        <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Showing {flights.length} flight{flights.length === 1 ? "" : "s"}.
          Flight changes should be handled through the parent page and shared
          flight service.
        </div>
      )}
    </div>
  );
}
