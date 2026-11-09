"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
  Ticket,
  Users,
} from "lucide-react";

import TripStatusBadge from "@/features/manage-trip/components/TripStatusBadge";
import type { Trip } from "@/types";

interface TripSummaryProps {
  trip: Trip;
  onClick?: (trip: Trip) => void;
  onViewDetails?: (trip: Trip) => void;
  showStatus?: boolean;
  showPassengers?: boolean;
  className?: string;
}

function formatDate(date: string): string {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate) return "Dates unavailable";

  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

export default function TripSummary({
  trip,
  onClick,
  onViewDetails,
  showStatus = true,
  showPassengers = true,
  className = "",
}: TripSummaryProps) {
  const firstSegment = trip.segments[0];
  const lastSegment = trip.segments[trip.segments.length - 1];

  const departureCode =
    firstSegment?.departureAirportCode || "N/A";

  const arrivalCode =
    lastSegment?.arrivalAirportCode || "N/A";

  const departureName =
    firstSegment?.departureAirportName || "Departure airport";

  const arrivalName =
    lastSegment?.arrivalAirportName ||
    trip.destination ||
    "Arrival airport";

  const title =
    trip.title?.trim() || `${departureCode} to ${arrivalCode}`;

  const isClickable = Boolean(onClick);
  const handleCardClick = () => onClick?.(trip);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 ${
        isClickable
          ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          : ""
      } ${className}`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Ticket className="h-4 w-4 shrink-0" />
              Booking reference
            </div>

            <p className="mt-1 break-all text-sm font-bold tracking-wide text-slate-900 dark:text-white">
              {trip.bookingReference || "Unavailable"}
            </p>
          </div>

          {showStatus && <TripStatusBadge status={trip.status} />}
        </div>

        <div className="mt-5">
          <h3 className="wrap-break-words text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {departureCode}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {departureName}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-sky-700 dark:text-sky-400">
              <Plane className="h-5 w-5 rotate-90" />
              <div className="h-px w-10 bg-sky-200 dark:bg-sky-900 sm:w-14" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                Flight
              </span>
            </div>

            <div className="min-w-0 text-right">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {arrivalCode}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {arrivalName}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Travel dates
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
          </div>

          {showPassengers && (
            <div className="flex items-start gap-2.5">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Passengers
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {trip.passengerCount}{" "}
                  {trip.passengerCount === 1 ? "passenger" : "passengers"}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Destination
              </p>
              <p className="mt-1 wrap-break-words text-sm font-medium text-slate-800 dark:text-slate-200">
                {trip.destination || arrivalName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Plane className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Flight segments
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {trip.segments.length}{" "}
                {trip.segments.length === 1 ? "flight" : "flights"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {onViewDetails && (
        <div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/40 sm:px-6">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetails(trip);
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-sky-400 dark:hover:bg-slate-800"
          >
            View details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </motion.article>
  );
}
