"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Route,
} from "lucide-react";
import type { Booking } from "@/types/booking";

type BookingFlightDetailsProps = {
  booking: Booking;
  className?: string;
};

type FlightDetailsData = Booking & {
  flightNumber?: string;
  flight?: {
    flightNumber?: string;
    airline?: string;
    departureAirport?: string | { code?: string; name?: string; city?: string };
    arrivalAirport?: string | { code?: string; name?: string; city?: string };
    departureTime?: string;
    arrivalTime?: string;
    departureDate?: string;
    arrivalDate?: string;
    duration?: string;
    stops?: number;
    cabinClass?: string;
  };
  departureAirport?: string | { code?: string; name?: string; city?: string };
  arrivalAirport?: string | { code?: string; name?: string; city?: string };
  departureTime?: string;
  arrivalTime?: string;
  departureDate?: string;
  arrivalDate?: string;
  flightDate?: string;
  duration?: string;
  stops?: number;
  cabinClass?: string;
};

function getAirport(value: unknown) {
  if (typeof value === "string") {
    return { code: value, name: value, city: "" };
  }

  if (value && typeof value === "object") {
    const airport = value as {
      code?: string;
      name?: string;
      city?: string;
    };

    return {
      code: airport.code || "TBA",
      name: airport.name || airport.code || "Airport details unavailable",
      city: airport.city || "",
    };
  }

  return {
    code: "TBA",
    name: "Airport details unavailable",
    city: "",
  };
}

function formatDate(value?: string) {
  if (!value) return "Date to be confirmed";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value?: string) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (/^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return value;
}

function AirportBlock({
  label,
  airport,
  time,
}: {
  label: string;
  airport: ReturnType<typeof getAirport>;
  time?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="wrap-break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        {airport.code}
      </p>

      <p className="mt-1 wraap-break-words text-sm font-medium text-slate-700 dark:text-slate-200">
        {airport.city || airport.name}
      </p>

      {airport.city && (
        <p className="mt-1 wrap-break-words text-xs text-slate-500">
          {airport.name}
        </p>
      )}

      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
        {formatTime(time)}
      </p>
    </div>
  );
}

export default function BookingFlightDetails({
  booking,
  className = "",
}: BookingFlightDetailsProps) {
  const data = booking as FlightDetailsData;
  const flight = data.flight;

  const departure = getAirport(
    flight?.departureAirport ?? data.departureAirport,
  );

  const arrival = getAirport(
    flight?.arrivalAirport ?? data.arrivalAirport,
  );

  const flightNumber = flight?.flightNumber ?? data.flightNumber;
  const departureTime = flight?.departureTime ?? data.departureTime;
  const arrivalTime = flight?.arrivalTime ?? data.arrivalTime;
  const departureDate =
    flight?.departureDate ?? data.departureDate ?? data.flightDate;
  const arrivalDate = flight?.arrivalDate ?? data.arrivalDate;
  const duration = flight?.duration ?? data.duration;
  const stops = flight?.stops ?? data.stops;
  const cabinClass = flight?.cabinClass ?? data.cabinClass;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
      aria-labelledby="booking-flight-details-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/60 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Plane className="h-5 w-5" />
          </div>

          <div>
            <h2
              id="booking-flight-details-title"
              className="text-lg font-bold text-slate-950 dark:text-white"
            >
              Flight itinerary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review your departure and arrival details
            </p>
          </div>
        </div>

        {flightNumber && (
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {flightNumber}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            {formatDate(departureDate)}
          </span>

          {cabinClass && (
            <>
              <span className="hidden text-slate-300 sm:inline">•</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
                {cabinClass}
              </span>
            </>
          )}
        </div>

        <div className="flex items-start gap-3 sm:gap-5">
          <AirportBlock
            label="Departure"
            airport={departure}
            time={departureTime}
          />

          <div className="flex min-w-19 flex-col items-center pt-8 sm:min-w-30">
            <PlaneTakeoff className="mb-2 h-5 w-5 text-blue-600" />

            <div className="flex w-full items-center">
              <div className="h-px flex-1 border-t border-dashed border-slate-300 dark:border-slate-700" />
              <ArrowRight className="mx-1 h-4 w-4 shrink-0 text-blue-600" />
            </div>

            <div className="mt-3 flex flex-col items-center gap-1 text-center">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Clock3 className="h-3.5 w-3.5" />
                {duration || "Duration TBA"}
              </span>

              <span className="text-xs text-slate-500">
                {stops === undefined
                  ? "Stops TBA"
                  : stops === 0
                    ? "Non-stop"
                    : `${stops} ${stops === 1 ? "stop" : "stops"}`}
              </span>
            </div>
          </div>

          <AirportBlock
            label="Arrival"
            airport={arrival}
            time={arrivalTime}
          />
        </div>

        {arrivalDate && arrivalDate !== departureDate && (
          <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
            <span className="font-semibold">Arrival date:</span>{" "}
            {formatDate(arrivalDate)}
          </div>
        )}

        <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <PlaneTakeoff className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-slate-500">
                Departure airport
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {departure.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <PlaneLanding className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-slate-500">
                Arrival airport
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {arrival.name}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-dashed border-slate-200 p-4 dark:border-slate-800">
          <Route className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Flight information is displayed from the booking record. Any
            unavailable details will need to be supplied by the booking data
            or backend when it is connected.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
