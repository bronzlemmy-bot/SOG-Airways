import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Plane,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { TripSegment, TripStatus } from "@/types";

export interface TripFlightDetailsProps {
  segments: TripSegment[];
  title?: string;
  className?: string;
  showRouteTimeline?: boolean;
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

  const parsedDate = new Date(`${date.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatTime(time: string): string {
  if (!time) return "Time unavailable";

  const match = time.match(/^(\d{1,2}):(\d{2})/);

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

export default function TripFlightDetails({
  segments,
  title = "Flight details",
  className = "",
  showRouteTimeline = true,
}: TripFlightDetailsProps) {
  if (segments.length === 0) {
    return (
      <section
        className={`rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900 ${className}`}
      >
        <Plane className="mx-auto h-8 w-8 text-slate-400" />

        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
          No flight details available
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Flight information will appear here when it is available.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="trip-flight-details-heading"
      className={`space-y-5 ${className}`}
    >
      <div>
        <h2
          id="trip-flight-details-heading"
          className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl"
        >
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review your flight schedule and airport information.
        </p>
      </div>

      <div className="space-y-5">
        {segments.map((segment, index) => {
          const status = STATUS_CONFIG[segment.status];

          return (
            <motion.article
              key={segment.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
              }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Plane className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {segment.flightNumber || "Flight number unavailable"}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Flight {index + 1}
                      {segments.length > 1
                        ? ` of ${segments.length}`
                        : ""}
                    </p>
                  </div>
                </div>

                <Badge variant={status.variant}>
                  {status.label}
                </Badge>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Departure
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                      {segment.departureAirportCode || "—"}
                    </p>

                    <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />

                      <span>
                        {segment.departureAirportName || "Departure airport"}
                      </span>
                    </p>

                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        <Clock3 className="h-4 w-4 text-slate-400" />
                        {formatTime(segment.departureTime)}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(segment.departureDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-2 sm:px-2 sm:py-0">
                    <div className="flex w-full items-center gap-3 sm:w-24 sm:flex-col sm:gap-2">
                      <div className="h-px flex-1 bg-linear-to-r from-sky-300 to-blue-500 sm:hidden" />

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
                        <ArrowRight className="h-5 w-5 sm:rotate-90" />
                      </div>

                      <div className="hidden w-full items-center sm:flex">
                        <div className="h-px flex-1 bg-sky-300 dark:bg-sky-800" />
                        <Plane className="mx-1 h-4 w-4 rotate-90 text-sky-600 dark:text-sky-400" />
                        <div className="h-px flex-1 bg-sky-300 dark:bg-sky-800" />
                      </div>

                      <p className="whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                        {showRouteTimeline ? "Flight route" : "To"}
                      </p>

                      <div className="h-px flex-1 bg-linear-to-r from-blue-500 to-sky-300 sm:hidden" />
                    </div>
                  </div>

                  <div className="min-w-0 sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Arrival
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                      {segment.arrivalAirportCode || "—"}
                    </p>

                    <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-300 sm:justify-end">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />

                      <span>
                        {segment.arrivalAirportName || "Arrival airport"}
                      </span>
                    </p>

                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:justify-end">
                        <Clock3 className="h-4 w-4 text-slate-400" />
                        {formatTime(segment.arrivalTime)}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 sm:justify-end">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(segment.arrivalDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {showRouteTimeline && index < segments.length - 1 && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-300">
                      <Plane className="h-4 w-4" />
                    </div>

                    <p className="text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">
                      Next flight segment
                      <span className="mx-1.5 text-slate-400">·</span>
                      {segment.arrivalAirportCode || "Arrival"} to{" "}
                      {segments[index + 1].departureAirportCode || "Next departure"}
                    </p>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}