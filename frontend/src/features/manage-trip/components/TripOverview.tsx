"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Plane,
  Ticket,
  Users,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { Trip, TripSegment, TripStatus } from "@/types";

interface TripOverviewProps {
  trip: Trip;
  onViewDetails?: () => void;
  className?: string;
}

const statusConfig: Record<
  TripStatus,
  {
    label: string;
    variant: "default" | "success" | "warning" | "danger" | "info";
  }
> = {
  upcoming: {
    label: "Upcoming",
    variant: "info",
  },
  "in-progress": {
    label: "In Progress",
    variant: "success",
  },
  completed: {
    label: "Completed",
    variant: "default",
  },
  cancelled: {
    label: "Cancelled",
    variant: "danger",
  },
};

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date || "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate) return "Dates not available";

  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

function formatTime(time: string): string {
  if (!time) return "Time unavailable";

  const match = time.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return time;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2000, 0, 1, hours, minutes));
}

function getFirstSegment(segments: TripSegment[]): TripSegment | undefined {
  return [...segments].sort((a, b) => {
    const dateA = new Date(
      `${a.departureDate}T${a.departureTime || "00:00"}`,
    ).getTime();

    const dateB = new Date(
      `${b.departureDate}T${b.departureTime || "00:00"}`,
    ).getTime();

    return dateA - dateB;
  })[0];
}

function getLastSegment(segments: TripSegment[]): TripSegment | undefined {
  return [...segments].sort((a, b) => {
    const dateA = new Date(
      `${a.arrivalDate}T${a.arrivalTime || "00:00"}`,
    ).getTime();

    const dateB = new Date(
      `${b.arrivalDate}T${b.arrivalTime || "00:00"}`,
    ).getTime();

    return dateB - dateA;
  })[0];
}

export default function TripOverview({
  trip,
  onViewDetails,
  className = "",
}: TripOverviewProps) {
  const status = statusConfig[trip.status];
  const firstSegment = getFirstSegment(trip.segments);
  const lastSegment = getLastSegment(trip.segments);

  const departureCode =
    firstSegment?.departureAirportCode || "N/A";

  const arrivalCode =
    lastSegment?.arrivalAirportCode || "N/A";

  const departureName =
    firstSegment?.departureAirportName || "Departure airport";

  const arrivalName =
    lastSegment?.arrivalAirportName || trip.destination || "Arrival airport";

  const tripTitle =
    trip.title?.trim() || `${departureCode} to ${arrivalCode}`;

  const tripType = trip.type.replaceAll("-", " ");

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      <div className="relative overflow-hidden bg-linear-to-br from-sky-950 via-blue-900 to-indigo-900 p-5 text-white sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-sky-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-indigo-300/10 blur-2xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium capitalize text-sky-100">
                <Plane className="h-3.5 w-3.5" />
                {tripType}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                {trip.segments.length}{" "}
                {trip.segments.length === 1 ? "flight" : "flights"}
              </span>
            </div>

            <h2 className="wrap-break-words text-xl font-bold tracking-tight sm:text-2xl">
              {tripTitle}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-sky-100/80">
              <Ticket className="h-4 w-4 shrink-0" />
              Booking reference:
              <span className="break-all font-semibold tracking-wider text-white">
                {trip.bookingReference || "Unavailable"}
              </span>
            </p>
          </div>

          <div className="relative shrink-0">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <div className="min-w-0">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {departureCode}
            </p>
            <p className="mt-1 truncate text-sm text-sky-100">
              {departureName}
            </p>
            {firstSegment && (
              <p className="mt-2 text-xs text-sky-100/75">
                {formatTime(firstSegment.departureTime)}
              </p>
            )}
          </div>

          <div className="flex min-w-12 flex-col items-center gap-2 text-sky-200">
            <Plane className="h-5 w-5 rotate-90" />
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-sky-200/70" />
              <span className="h-px w-8 bg-sky-200/60 sm:w-12" />
              <span className="h-1 w-1 rounded-full bg-sky-200/70" />
            </div>
            <span className="text-[10px] uppercase tracking-widest">
              Route
            </span>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {arrivalCode}
            </p>
            <p className="mt-1 truncate text-sm text-sky-100">
              {arrivalName}
            </p>
            {lastSegment && (
              <p className="mt-2 text-xs text-sky-100/75">
                {formatTime(lastSegment.arrivalTime)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Travel dates
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Passengers
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {trip.passengerCount}{" "}
              {trip.passengerCount === 1 ? "passenger" : "passengers"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Clock3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Last updated
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {formatDate(trip.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {trip.destination && (
        <div className="mx-5 flex items-center gap-2 border-t border-slate-100 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:mx-6">
          <MapPin className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
          <span className="font-medium">Destination:</span>
          <span className="min-w-0 wrap-break-words">{trip.destination}</span>
        </div>
      )}

      {onViewDetails && (
        <div className="flex justify-end border-t border-slate-100 p-4 dark:border-slate-800 sm:px-6">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            View trip details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.article>
  );
}
