"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
CalendarDays,
ChevronRight,
Clock3,
MapPin,
Plane,
Users,
} from "lucide-react";
import BookingStatus from "./BookingStatus";



export interface BookingLocation {
code: string;
city: string;
airport?: string;
}

export interface Booking {
id: string;
bookingReference?: string;
status: string;
airline?: string;
flightNumber?: string;
origin: BookingLocation;
destination: BookingLocation;
departureDate?: string;
departureTime?: string;
arrivalDate?: string;
arrivalTime?: string;
cabinClass?: string;
passengerCount?: number;
}

interface BookingCardProps {
booking: Booking;
index?: number;
}

const formatDate = (date?: string) => {
if (!date) return "—";

const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
};

const getBookingKey = (booking: Booking) =>
encodeURIComponent(booking.id);

export default function BookingCard({
booking,
index = 0,
}: BookingCardProps) {
const bookingKey = getBookingKey(booking);

return (
<motion.article
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.4,
delay: Math.min(index * 0.06, 0.3),
ease: "easeOut",
}}
whileHover={{ y: -2 }}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
>
{/* Header */} <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"> <Plane className="h-5 w-5" /> </div>


      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {booking.airline || "Airline"}
          </h3>

          {booking.flightNumber && (
            <span className="text-xs text-slate-400">
              {booking.flightNumber}
            </span>
          )}
        </div>

        <p className="mt-0.5 text-xs text-slate-500">
          Booking reference:{" "}
          <span className="font-medium text-slate-700">
            {booking.bookingReference || booking.id}
          </span>
        </p>
      </div>
    </div>

    <BookingStatus status={booking.status} />
  </div>

  {/* Flight Information */}
  <div className="px-4 py-5 sm:px-5">
    <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
      {/* Origin */}
      <div>
        <p className="text-2xl font-bold tracking-tight text-slate-900">
          {booking.origin.code}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {booking.origin.city}
        </p>

        {booking.origin.airport && (
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
            {booking.origin.airport}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(booking.departureDate)}
        </div>

        {booking.departureTime && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            {booking.departureTime}
          </div>
        )}
      </div>

      {/* Flight Path */}
      <div className="hidden min-w-28 sm:block">
        <div className="flex items-center">
          <div className="h-px flex-1 bg-slate-200" />

          <div className="mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
            <Plane className="h-3.5 w-3.5 rotate-90" />
          </div>

          <div className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      {/* Destination */}
      <div className="sm:text-right">
        <p className="text-2xl font-bold tracking-tight text-slate-900">
          {booking.destination.code}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {booking.destination.city}
        </p>

        {booking.destination.airport && (
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400 sm:text-right">
            {booking.destination.airport}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 sm:justify-end">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(booking.arrivalDate || booking.departureDate)}
        </div>

        {booking.arrivalTime && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700 sm:justify-end">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            {booking.arrivalTime}
          </div>
        )}
      </div>
    </div>

    {/* Extra Information */}
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
      {booking.cabinClass && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Cabin:{" "}
            <span className="font-medium text-slate-700">
              {booking.cabinClass}
            </span>
          </span>
        </div>
      )}

      {booking.passengerCount !== undefined && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {booking.passengerCount}{" "}
            {booking.passengerCount === 1 ? "Passenger" : "Passengers"}
          </span>
        </div>
      )}
    </div>
  </div>

  {/* Actions */}
  <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-end sm:px-5">
    <Link
      href={`/users/check-in/${bookingKey}`}
      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      Check-In
    </Link>

    <Link
      href={`/users/manage-trips?bookingReference=${bookingKey}`}
      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      Manage Trip
    </Link>

    <Link
      href={`/users/booking-details/${bookingKey}`}
      className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
    >
      View Details
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </div>
</motion.article>


);
}
