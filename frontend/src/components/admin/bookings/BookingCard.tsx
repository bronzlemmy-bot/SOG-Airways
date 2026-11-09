"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
CreditCard,
Luggage,
MapPin,
Plane,
Users,
} from "lucide-react";

import BookingAction from "./BookingActions";
import type { AdminBooking } from "./admin-bookings-data/AdminBookingsData";

interface BookingCardProps {
booking: AdminBooking;
onView: (booking: AdminBooking) => void;
onEdit: (booking: AdminBooking) => void;
onDelete: (booking: AdminBooking) => void;
}

function formatCurrency(amount: number, currency: string) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-US", {
day: "numeric",
month: "short",
year: "numeric",
}).format(new Date(`${date}T00:00:00`));
}

function getStatusClasses(status: AdminBooking["status"]) {
switch (status) {
case "confirmed":
return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";


case "pending":
  return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";

case "cancelled":
  return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";

case "completed":
  return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";

default:
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";


}
}

function getPaymentClasses(status: AdminBooking["paymentStatus"]) {
switch (status) {
case "paid":
return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";


case "pending":
  return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";

case "refunded":
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

case "failed":
  return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";

default:
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";


}
}

function formatStatus(status: AdminBooking["status"]) {
return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPaymentStatus(status: AdminBooking["paymentStatus"]) {
return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BookingCard({
booking,
onView,
onEdit,
onDelete,
}: BookingCardProps) {
return (
<motion.article
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{ y: -2 }}
transition={{ duration: 0.2 }}
className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
> <div className="flex items-start justify-between gap-4"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Plane className="h-5 w-5" /> </div>


      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Booking Reference
        </p>

        <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
          {booking.bookingReference}
        </h3>

        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {booking.passenger.fullName}
        </p>
      </div>
    </div>

    <BookingAction
      onView={() => onView(booking)}
      onEdit={() => onEdit(booking)}
      onDelete={() => onDelete(booking)}
    />
  </div>

  <div className="mt-4 flex flex-wrap gap-2">
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
        booking.status,
      )}`}
    >
      {formatStatus(booking.status)}
    </span>

    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentClasses(
        booking.paymentStatus,
      )}`}
    >
      Payment: {formatPaymentStatus(booking.paymentStatus)}
    </span>
  </div>

  <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-slate-400">
          {booking.departureAirportCode}
        </p>

        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {booking.departureCity}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {booking.departureTime}
        </p>
      </div>

      <div className="flex min-w-15 flex-1 items-center gap-2">
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
        <Plane className="h-4 w-4 shrink-0 rotate-90 text-blue-500" />
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
      </div>

      <div className="min-w-0 text-right">
        <p className="text-xs text-slate-400">
          {booking.arrivalAirportCode}
        </p>

        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {booking.arrivalCity}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {booking.arrivalTime}
        </p>
      </div>
    </div>
  </div>

  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
    <div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <CalendarDays className="h-3.5 w-3.5" />
        <span className="text-xs">Departure</span>
      </div>

      <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
        {formatDate(booking.departureDate)}
      </p>
    </div>

    <div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <Users className="h-3.5 w-3.5" />
        <span className="text-xs">Passengers</span>
      </div>

      <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
        {booking.passengerCount}
      </p>
    </div>

    <div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <Luggage className="h-3.5 w-3.5" />
        <span className="text-xs">Bags</span>
      </div>

      <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
        {booking.baggageCount}
      </p>
    </div>

    <div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <MapPin className="h-3.5 w-3.5" />
        <span className="text-xs">Class</span>
      </div>

      <p className="mt-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
        {booking.cabinClass}
      </p>
    </div>
  </div>

  <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
    <div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <CreditCard className="h-3.5 w-3.5" />
        <span className="text-xs">Total Amount</span>
      </div>

      <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
        {formatCurrency(booking.amount, booking.currency)}
      </p>
    </div>

    <div className="text-right">
      <p className="text-xs text-slate-400">Flight</p>
      <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
        {booking.flightNumber}
      </p>
    </div>
  </div>
</motion.article>


);
}
