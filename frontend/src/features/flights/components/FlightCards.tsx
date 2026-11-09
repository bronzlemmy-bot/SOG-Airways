"use client";

import { motion } from "framer-motion";
import {
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Users,
  Armchair,
  CalendarDays,
  Clock3,
  MapPin,
  Banknote,
} from "lucide-react";
import type { Flight } from "@/types/flight";
import FlightActions from "./FlightActions";
import FlightStatusBadge from "./FlightStatusBadge";

interface FlightCardsProps {
  flights: Flight[];
  onView: (flight: Flight) => void;
  onEdit: (flight: Flight) => void;
  onDelete: (flight: Flight) => void;
  onStatusChange?: (
    flight: Flight,
    status: Flight["status"],
  ) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function formatDate(date: string): string {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatTime(time: string): string {
  if (!time) return "--:--";

  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return time;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(2000, 0, 1, hours, minutes));
}

function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "N/A";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

function formatPrice(price: number, currency: string): string {
  if (!Number.isFinite(price)) return "Price unavailable";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency || ""} ${price.toLocaleString("en-NG")}`.trim();
  }
}

export default function FlightCards({
  flights,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
  emptyMessage = "No flights found. Try adjusting your filters or add a new flight.",
  className = "",
}: FlightCardsProps) {
  if (flights.length === 0) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center dark:border-slate-700 dark:bg-slate-950 ${className}`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
          <Plane className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          No flights to display
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-5 xl:grid-cols-2 ${className}`}>
      {flights.map((flight, index) => (
        <motion.article
          key={flight.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
          className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                <Plane className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Flight number
                </p>
                <h3 className="truncate text-lg font-bold text-slate-950 dark:text-white">
                  {flight.flightNumber}
                </h3>
              </div>
            </div>
            <FlightStatusBadge status={flight.status} />
          </div>

          <div className="p-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-950 dark:text-white">
                  {flight.route.departureAirportCode}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                  {flight.route.departureAirportName}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <PlaneTakeoff className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{formatTime(flight.schedule.departureTime)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(flight.schedule.departureDate)}
                </p>
              </div>

              <div className="flex min-w-0 flex-col items-center gap-2 px-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {formatDuration(flight.schedule.durationMinutes)}
                </span>
                <div className="flex w-full items-center">
                  <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
                  <Plane className="mx-1 h-4 w-4 shrink-0 rotate-90 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
                </div>
                <span className="text-center text-[10px] uppercase tracking-wider text-slate-400">
                  {flight.type}
                </span>
              </div>

              <div className="min-w-0 text-right">
                <p className="text-2xl font-bold text-slate-950 dark:text-white">
                  {flight.route.arrivalAirportCode}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                  {flight.route.arrivalAirportName}
                </p>
                <div className="mt-3 flex items-center justify-end gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span>{formatTime(flight.schedule.arrivalTime)}</span>
                  <PlaneLanding className="h-4 w-4 shrink-0" aria-hidden="true" />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(flight.schedule.arrivalDate)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Seats available
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                  {flight.availableSeats.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    / {flight.totalSeats.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Banknote className="h-4 w-4" aria-hidden="true" />
                  Base fare
                </div>
                <p className="mt-2 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
                  {formatPrice(flight.price, flight.currency)}
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-900 sm:col-span-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Armchair className="h-4 w-4" aria-hidden="true" />
                  Cabin classes
                </div>
                <p className="mt-2 text-sm font-semibold capitalize text-slate-900 dark:text-white">
                  {flight.cabinClasses.length > 0
                    ? flight.cabinClasses
                        .map((cabinClass) => cabinClass.replaceAll("-", " "))
                        .join(", ")
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {flight.terminal ? `Terminal ${flight.terminal}` : "Terminal TBD"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                {flight.departureGate
                  ? `Gate ${flight.departureGate}`
                  : "Gate TBD"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {flight.aircraftRegistration || flight.aircraftId}
              </span>
            </div>

            {(flight.status === "delayed" && flight.delayReason) ||
            (flight.status === "cancelled" && flight.cancellationReason) ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <p className="font-semibold">
                  {flight.status === "delayed"
                    ? `Delayed${flight.delayMinutes ? ` by ${flight.delayMinutes} minutes` : ""}`
                    : "Cancellation information"}
                </p>
                <p className="mt-1">
                  {flight.status === "delayed"
                    ? flight.delayReason
                    : flight.cancellationReason}
                </p>
              </div>
            ) : null}

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <FlightActions
                flight={flight}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                loading={loading}
                compact={false}
              />
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}