"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
Clock3,
CreditCard,
FileText,
MapPin,
Plane,
UserRound,
Users,
} from "lucide-react";


import type { Booking } from "./BookingCard";
import BookingStatus from "./BookingStatus";

interface BookingDetailsProps {
booking: Booking;
}

const formatDate = (date?: string) => {
if (!date) return "—";

const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
weekday: "short",
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
};

export default function BookingDetails({
booking,
}: BookingDetailsProps) {
const bookingKey = encodeURIComponent(booking.id);

return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, ease: "easeOut" }}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
>
{/* Header */} <div className="border-b border-slate-100 px-4 py-5 sm:px-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-start gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"> <FileText className="h-5 w-5" /> </div>

```
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Booking Details
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {booking.bookingReference || booking.id}
          </h2>
        </div>
      </div>

      <BookingStatus status={booking.status} />
    </div>
  </div>

  {/* Flight Summary */}
  <div className="p-4 sm:p-6">
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {booking.airline || "Airline"}
          </p>

          {booking.flightNumber && (
            <p className="mt-0.5 text-xs text-slate-500">
              Flight {booking.flightNumber}
            </p>
          )}
        </div>

        <Plane className="h-5 w-5 text-slate-400" />
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {/* Departure */}
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {booking.origin.code}
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {booking.origin.city}
          </p>

          {booking.origin.airport && (
            <p className="mt-1 text-xs text-slate-400">
              {booking.origin.airport}
            </p>
          )}

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(booking.departureDate)}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" />
              {booking.departureTime || "Departure time unavailable"}
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center justify-center sm:block">
          <div className="flex w-full max-w-40 items-center">
            <div className="h-px flex-1 bg-slate-300" />

            <div className="mx-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
              <Plane className="h-4 w-4 rotate-90 text-slate-600" />
            </div>

            <div className="h-px flex-1 bg-slate-300" />
          </div>
        </div>

        {/* Arrival */}
        <div className="sm:text-right">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {booking.destination.code}
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {booking.destination.city}
          </p>

          {booking.destination.airport && (
            <p className="mt-1 text-xs text-slate-400">
              {booking.destination.airport}
            </p>
          )}

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 sm:justify-end">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(
                booking.arrivalDate || booking.departureDate,
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:justify-end">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" />
              {booking.arrivalTime || "Arrival time unavailable"}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Information Grid */}
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium">Passengers</span>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          {booking.passengerCount !== undefined
            ? `${booking.passengerCount} ${
                booking.passengerCount === 1
                  ? "Passenger"
                  : "Passengers"
              }`
            : "—"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Plane className="h-4 w-4" />
          <span className="text-xs font-medium">Cabin Class</span>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          {booking.cabinClass || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <CreditCard className="h-4 w-4" />
          <span className="text-xs font-medium">Booking Reference</span>
        </div>

        <p className="mt-2 truncate text-sm font-semibold text-slate-900">
          {booking.bookingReference || booking.id}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <UserRound className="h-4 w-4" />
          <span className="text-xs font-medium">Status</span>
        </div>

        <div className="mt-2">
          <BookingStatus status={booking.status} showIcon={false} />
        </div>
      </div>
    </div>

    {/* Route Information */}
    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-slate-500" />

        <h3 className="text-sm font-semibold text-slate-900">
          Journey Route
        </h3>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            From
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {booking.origin.code} — {booking.origin.city}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            To
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {booking.destination.code} —{" "}
            {booking.destination.city}
          </p>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Link
        href={`/users/manage-trips?bookingReference=${bookingKey}`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      >
        Manage Trip
      </Link>

      <Link
        href={`/users/booking-details/${bookingKey}`}
        className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      >
        Open Full Details
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  </div>
</motion.section>


);
}
