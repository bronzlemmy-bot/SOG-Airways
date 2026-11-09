"use client";

import { AnimatePresence, motion } from "framer-motion";
import {

CreditCard,
Mail,
MapPin,
Plane,
Phone,
User,
X,
} from "lucide-react";

import type { AdminBooking } from "./admin-bookings-data/AdminBookingsData";

interface BookingDetailsProps {
booking: AdminBooking | null;
onClose: () => void;
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
month: "long",
year: "numeric",
}).format(new Date(`${date}T00:00:00`));
}

function formatStatus(status: string) {
return status.charAt(0).toUpperCase() + status.slice(1);
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

interface DetailItemProps {
label: string;
value: string | number;
}

function DetailItem({ label, value }: DetailItemProps) {
return ( <div> <p className="text-xs font-medium text-slate-400">{label}</p> <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
{value} </p> </div>
);
}

export default function BookingDetails({
booking,
onClose,
}: BookingDetailsProps) {
return ( <AnimatePresence>
{booking && (
<motion.div
className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onMouseDown={(event) => {
if (event.target === event.currentTarget) {
onClose();
}
}}
>
<motion.div
initial={{ opacity: 0, scale: 0.96, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.96, y: 20 }}
transition={{ duration: 0.2 }}
className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Plane className="h-5 w-5" /> </div>


            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Booking Details
              </p>

              <h2 className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white">
                {booking.bookingReference}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                booking.status,
              )}`}
            >
              {formatStatus(booking.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClasses(
                booking.paymentStatus,
              )}`}
            >
              Payment: {formatStatus(booking.paymentStatus)}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {booking.cabinClass}
            </span>
          </div>

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Passenger Information
              </h3>
            </div>

            <div className="grid gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 sm:grid-cols-2">
              <DetailItem
                label="Full Name"
                value={booking.passenger.fullName}
              />

              <DetailItem
                label="Nationality"
                value={booking.passenger.nationality}
              />

              <div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-xs font-medium text-slate-400">
                    Email
                  </p>
                </div>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {booking.passenger.email}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-xs font-medium text-slate-400">
                    Phone
                  </p>
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {booking.passenger.phone}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Plane className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Flight Information
              </h3>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">Flight Number</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {booking.flightNumber}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Airline</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {booking.airlineCode}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Departure
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {booking.departureAirportCode}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {booking.departureAirport}
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {booking.departureCity} ·{" "}
                    {formatDate(booking.departureDate)}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {booking.departureTime}
                  </p>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
                  <Plane className="h-4 w-4 rotate-90 text-blue-500" />
                  <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
                </div>

                <div className="border-t border-slate-200 pt-4 sm:border-0 sm:pt-0 sm:text-right">
                  <p className="text-xs font-medium text-slate-400">
                    Arrival
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {booking.arrivalAirportCode}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {booking.arrivalAirport}
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {booking.arrivalCity} · {formatDate(booking.arrivalDate)}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {booking.arrivalTime}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Booking Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 sm:grid-cols-4">
              <DetailItem
                label="Passengers"
                value={booking.passengerCount}
              />

              <DetailItem
                label="Baggage"
                value={booking.baggageCount}
              />

              <DetailItem
                label="Cabin Class"
                value={booking.cabinClass}
              />

              <DetailItem
                label="Booking Date"
                value={formatDate(booking.bookingDate)}
              />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Payment
              </h3>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Payment Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatStatus(booking.paymentStatus)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Amount</p>

                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(booking.amount, booking.currency)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:justify-between">
              <span>
                Last updated: {formatDate(booking.lastUpdated)}
              </span>

              <span>Booking ID: {booking.id}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


);
}
