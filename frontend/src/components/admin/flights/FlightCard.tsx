"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
Clock3,
Luggage,
Plane,
Wifi,
} from "lucide-react";

import FlightAction from "./FlightActions";
import FlightStatusBadge from "./FlightStatusBadge";
import type { AdminFlight } from "./admin-flights-data/AdminFlightsData";

interface FlightCardProps {
flight: AdminFlight;
onView: (flight: AdminFlight) => void;
onEdit: (flight: AdminFlight) => void;
onDelete: (flight: AdminFlight) => void;
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(new Date(date));
}

function formatCurrency(
amount: number,
currency: string,
) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
}

export default function FlightCard({
flight,
onView,
onEdit,
onDelete,
}: FlightCardProps) {
const occupancy =
flight.totalSeats > 0
? Math.round(
(flight.bookedSeats / flight.totalSeats) * 100,
)
: 0;

return (
<motion.article
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>

```
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {flight.flightNumber}
          </h3>

          <FlightStatusBadge status={flight.status} />
        </div>

        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
          {flight.aircraftType} ·{" "}
          {flight.aircraftRegistration}
        </p>
      </div>
    </div>

    <FlightAction
      onView={() => onView(flight)}
      onEdit={() => onEdit(flight)}
      onDelete={() => onDelete(flight)}
    />
  </div>

  <div className="p-5">
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div>
        <p className="text-xl font-bold text-slate-900 dark:text-white">
          {flight.departureAirportCode}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
          {flight.departureCity}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {flight.departureTime}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">
          {flight.duration}
        </span>

        <div className="my-1 flex items-center gap-1 text-sky-500">
          <span className="h-px w-8 bg-sky-200 dark:bg-sky-500/30" />
          <Plane className="h-4 w-4" />
          <span className="h-px w-8 bg-sky-200 dark:bg-sky-500/30" />
        </div>

        <span className="text-[11px] text-slate-400">
          {flight.distance.toLocaleString()} km
        </span>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold text-slate-900 dark:text-white">
          {flight.arrivalAirportCode}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
          {flight.arrivalCity}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {flight.arrivalTime}
        </p>
      </div>
    </div>

    <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{formatDate(flight.departureDate)}</span>

      <span className="mx-1 text-slate-300 dark:text-slate-700">
        •
      </span>

      <Clock3 className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{flight.departureTime}</span>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-sky-500" />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Seats
          </span>
        </div>

        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
          {flight.bookedSeats} / {flight.totalSeats}
        </p>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {flight.availableSeats} available
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-2">
          <Luggage className="h-4 w-4 text-amber-500" />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Baggage
          </span>
        </div>

        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
          {flight.baggageAllowance}
        </p>

        <div className="mt-1 flex items-center gap-2">
          {flight.wifiAvailable && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <Wifi className="h-3 w-3" />
              Wi-Fi
            </span>
          )}

          {flight.mealService && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Meal
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="mt-4">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-500 dark:text-slate-400">
          Seat occupancy
        </span>

        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {occupancy}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-sky-500 transition-all"
          style={{
            width: `${occupancy}%`,
          }}
        />
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Starting from
      </span>

      <span className="text-sm font-bold text-slate-900 dark:text-white">
        {formatCurrency(
          flight.baseFare,
          flight.currency,
        )}
      </span>
    </div>
  </div>
</motion.article>


);
}
