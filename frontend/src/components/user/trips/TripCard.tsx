"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
Clock3,
Luggage,
MapPin,
Plane,
Users,
} from "lucide-react";
import type { Trip } from "./trips-data/TripsData";
import TripStatusBadge from "./TripStatusBadge";

interface TripCardProps {
trip: Trip;
onSelect: (tripId: string) => void;
}

function formatDate(date: string) {
const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
}

function formatPrice(price: number, currency: string) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(price);
}

export default function TripCard({
trip,
onSelect,
}: TripCardProps) {
const isCancelled = trip.status === "cancelled";

return (
<motion.article
layout
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -12 }}
whileHover={{ y: -3 }}
transition={{ duration: 0.3 }}
className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition-shadow hover:shadow-lg dark:bg-slate-900 ${
        isCancelled
          ? "border-red-200 dark:border-red-950"
          : "border-slate-200 dark:border-slate-800"
      }`}
>
{/* Header */} <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"> <Plane className="h-5 w-5" /> </div>


        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
            {trip.bookingReference}
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {trip.tripType}
          </p>
        </div>
      </div>

      <TripStatusBadge status={trip.status} />
    </div>
  </div>

  {/* Route */}
  <div className="px-5 py-5 sm:px-6">
    <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
      {/* Departure */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          Departure
        </div>

        <div className="mt-2">
          <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {trip.outbound.departureAirport}
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {trip.outbound.departureCity}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(trip.outbound.departureDate)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {trip.outbound.departureTime}
            </span>
          </div>
        </div>
      </div>

      {/* Flight connector */}
      <div className="hidden md:flex md:flex-col md:items-center md:gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {trip.outbound.flightNumber}
        </span>

        <div className="flex w-24 items-center">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <div className="mx-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Plane className="h-4 w-4 rotate-90" />
          </div>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          {trip.outbound.duration}
        </span>
      </div>

      {/* Mobile connector */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {trip.outbound.flightNumber}
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Arrival */}
      <div className="md:text-right">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 md:justify-end">
          <MapPin className="h-3.5 w-3.5" />
          Arrival
        </div>

        <div className="mt-2">
          <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {trip.outbound.arrivalAirport}
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {trip.outbound.arrivalCity}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 md:justify-end">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(trip.outbound.arrivalDate)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {trip.outbound.arrivalTime}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Details */}
    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-4">
      <TripMeta
        icon={<Users className="h-4 w-4" />}
        label="Passengers"
        value={String(trip.passengers)}
      />

      <TripMeta
        icon={<Plane className="h-4 w-4" />}
        label="Cabin"
        value={trip.cabinClass}
      />

      <TripMeta
        icon={<Luggage className="h-4 w-4" />}
        label="Baggage"
        value={trip.baggage}
      />

      <TripMeta
        icon={<CalendarDays className="h-4 w-4" />}
        label="Booked"
        value={formatDate(trip.createdAt)}
      />
    </div>
  </div>

  {/* Footer */}
  <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
    <div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Total fare
      </p>

      <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
        {formatPrice(trip.price, trip.currency)}
      </p>
    </div>

    <motion.button
      type="button"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(trip.id)}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:w-auto"
    >
      View Trip
      <ArrowRight className="h-4 w-4" />
    </motion.button>
  </div>
</motion.article>


);
}

interface TripMetaProps {
icon: React.ReactNode;
label: string;
value: string;
}

function TripMeta({
icon,
label,
value,
}: TripMetaProps) {
return ( <div className="min-w-0 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"> <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
{icon} <span className="truncate text-xs font-medium">
{label} </span> </div>


  <p className="mt-1.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
    {value}
  </p>
</div>


);
}
