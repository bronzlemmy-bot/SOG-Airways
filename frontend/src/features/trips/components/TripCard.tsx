
"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Plane,
  Route,
  Users,
} from "lucide-react";

import type { Trip, TripStatus, TripType } from "@/types";
import TripActions from "./TripActions";

interface TripCardProps {
  trip: Trip;
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  disabled?: boolean;
  className?: string;
}

const STATUS_STYLES: Record<
  TripStatus,
  { label: string; className: string; dotClassName: string }
> = {
  upcoming: {
    label: "Upcoming",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    dotClassName: "bg-blue-500",
  },
  "in-progress": {
    label: "In progress",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    dotClassName: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    className:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dotClassName: "bg-slate-500",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
    dotClassName: "bg-red-500",
  },
};

const TYPE_LABELS: Record<TripType, string> = {
  "one-way": "One-way",
  "round-trip": "Round trip",
  "multi-city": "Multi-city",
};

function formatDate(value: string): string {
  if (!value) return "Date unavailable";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "Dates to be confirmed";
  if (!startDate) return formatDate(endDate);
  if (!endDate || startDate === endDate) return formatDate(startDate);

  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

export default function TripCard({
  trip,
  onView,
  onEdit,
  onCancel,
  onDelete,
  disabled = false,
  className = "",
}: TripCardProps) {
  const status = STATUS_STYLES[trip.status];
  const firstSegment = trip.segments[0];
  const lastSegment = trip.segments[trip.segments.length - 1];

  const departureCode =
    firstSegment?.departureAirportCode || "—";

  const arrivalCode =
    lastSegment?.arrivalAirportCode || "—";

  const departureName =
    firstSegment?.departureAirportName || "Departure airport unavailable";

  const arrivalName =
    lastSegment?.arrivalAirportName ||
    trip.destination ||
    "Destination unavailable";

  const heading =
    trip.title?.trim() ||
    trip.destination?.trim() ||
    (lastSegment
      ? `Trip to ${lastSegment.arrivalAirportName || arrivalCode}`
      : "Trip details");

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="h-1 bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400" />

      <div className="space-y-5 p-5 sm:p-6">
        {/* Trip heading and status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Plane size={13} aria-hidden="true" />
                {trip.bookingReference || "No booking reference"}
              </span>

              <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {TYPE_LABELS[trip.type]}
              </span>
            </div>

            <h3 className="mt-3 truncate text-lg font-bold text-slate-950 dark:text-white">
              {heading}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Trip ID: {trip.id}
            </p>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
            />
            {status.label}
          </span>
        </div>

        {/* Route */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <div className="min-w-0">
              <p className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {departureCode}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {departureName}
              </p>
              {firstSegment?.departureTime && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Clock3 size={13} aria-hidden="true" />
                  {firstSegment.departureTime}
                </p>
              )}
            </div>

            <div className="flex min-w-12 flex-col items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Route size={17} aria-hidden="true" />
              <div className="flex w-full items-center">
                <div className="h-px flex-1 border-t border-dashed border-blue-300 dark:border-blue-800" />
                <ArrowRight size={15} aria-hidden="true" />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {trip.segments.length}{" "}
                {trip.segments.length === 1 ? "flight" : "flights"}
              </span>
            </div>

            <div className="min-w-0 text-right">
              <p className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {arrivalCode}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {arrivalName}
              </p>
              {lastSegment?.arrivalTime && (
                <p className="mt-2 flex items-center justify-end gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Clock3 size={13} aria-hidden="true" />
                  {lastSegment.arrivalTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trip information */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
            <span className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <CalendarDays size={17} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Travel dates
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
            <span className="rounded-lg bg-violet-50 p-2 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              <Users size={17} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Passengers
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {trip.passengerCount}{" "}
                {trip.passengerCount === 1 ? "passenger" : "passengers"}
              </p>
            </div>
          </div>
        </div>

        {trip.destination && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">
              Destination: {trip.destination}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Updated {formatDate(trip.updatedAt)}
          </p>

          <TripActions
            trip={trip}
            onView={onView}
            onEdit={onEdit}
            onCancel={onCancel}
            onDelete={onDelete}
            disabled={disabled}
          />
        </div>
      </div>
    </motion.article>
  );
}
