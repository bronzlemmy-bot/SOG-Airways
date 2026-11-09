"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Plane,
  Users,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { Trip, TripStatus } from "@/types";

export interface TripHeaderProps {
  trip: Trip;
  onBack?: () => void;
  title?: string;
  showBackButton?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  TripStatus,
  {
    label: string;
    variant: "default" | "success" | "warning" | "danger" | "info";
  }
> = {
  upcoming: { label: "Upcoming", variant: "info" },
  "in-progress": { label: "In progress", variant: "success" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

function formatDate(date: string): string {
  if (!date) return "Date unavailable";

  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function TripHeader({
  trip,
  onBack,
  title,
  showBackButton = true,
  className = "",
}: TripHeaderProps) {
  const status = STATUS_CONFIG[trip.status];

  const firstSegment = trip.segments[0];
  const lastSegment = trip.segments[trip.segments.length - 1];

  const departureCode =
    firstSegment?.departureAirportCode || "Departure";

  const arrivalCode =
    lastSegment?.arrivalAirportCode || trip.destination || "Destination";

  const tripTitle =
    title ||
    trip.title ||
    `${departureCode} to ${arrivalCode}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-sky-900 p-5 text-white shadow-xl sm:p-8 lg:p-10 ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10">
        {showBackButton && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-100">
                <Plane className="h-3.5 w-3.5" />
                Manage trip
              </span>

              <Badge variant={status.variant}>
                {status.label}
              </Badge>
            </div>

            <h1 className="wrap-break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {tripTitle}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-blue-100 sm:text-base">
              <span>Booking reference:</span>
              <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 font-mono font-bold tracking-wider text-white">
                {trip.bookingReference}
              </span>
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:min-w-48">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
              Trip type
            </p>

            <p className="mt-2 text-base font-semibold capitalize text-white">
              {trip.type.replaceAll("-", " ")}
            </p>

            <div className="mt-4 border-t border-white/15 pt-3">
              <p className="text-xs text-blue-200">Flight segments</p>
              <p className="mt-1 text-xl font-bold">
                {trip.segments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="my-7 h-px bg-linear-to-r from-white/30 via-white/15 to-transparent" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200">
              <MapPin className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                Route
              </p>

              <p className="mt-1 wrap-break-words text-sm font-semibold text-white sm:text-base">
                {departureCode}
                <span className="mx-2 text-sky-300">→</span>
                {arrivalCode}
              </p>

              <p className="mt-1 text-xs text-blue-200">
                {trip.segments.length > 1
                  ? `${trip.segments.length} flight segments`
                  : "Flight itinerary"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                Departure
              </p>

              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {formatDate(trip.startDate)}
              </p>

              <p className="mt-1 text-xs text-blue-200">
                Start of your trip
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                Return / arrival
              </p>

              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {formatDate(trip.endDate)}
              </p>

              <p className="mt-1 text-xs text-blue-200">
                End of your trip
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200">
              <Users className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                Passengers
              </p>

              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {trip.passengerCount}{" "}
                {trip.passengerCount === 1 ? "passenger" : "passengers"}
              </p>

              <p className="mt-1 text-xs text-blue-200">
                Travellers on this booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}