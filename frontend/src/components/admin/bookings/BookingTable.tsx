"use client";

import { motion } from "framer-motion";
import { CalendarDays, Plane } from "lucide-react";

import type { AdminBooking } from "./admin-bookings-data/AdminBookingsData";
import BookingAction from "./BookingActions";
import BookingCard from "./BookingCard";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingTableProps {
bookings: AdminBooking[];
onView: (booking: AdminBooking) => void;
onEdit: (booking: AdminBooking) => void;
onDelete: (booking: AdminBooking) => void;
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(new Date(date));
}

function formatCurrency(amount: number, currency: string) {
return new Intl.NumberFormat("en-US", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
}

export default function BookingTable({
bookings,
onView,
onEdit,
onDelete,
}: BookingTableProps) {
if (bookings.length === 0) {
return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800"> <Plane className="h-7 w-7 text-slate-400" /> </div>

```
    <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
      No bookings found
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
      No bookings match your current search and filter settings. Try
      adjusting the filters to see more bookings.
    </p>
  </motion.div>
);


}

return ( <div className="space-y-4">
{/* Mobile and tablet */} <div className="grid gap-4 lg:hidden">
{bookings.map((booking, ) => ( <BookingCard
         key={booking.id}
         booking={booking}
         onView={onView}
         onEdit={onEdit}
         onDelete={onDelete}
       />
))} </div>


  {/* Desktop */}
  <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block dark:border-slate-800 dark:bg-slate-900">
    <div className="overflow-x-auto">
      <table className="w-full min-w-275 border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/50">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Booking
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Passenger
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Flight
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Route
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Departure
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Class
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Amount
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Status
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {bookings.map((booking, index) => (
            <motion.tr
              key={booking.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              <td className="px-5 py-4 align-top">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {booking.bookingReference}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Booked {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4 align-top">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {booking.passenger.fullName}
                  </p>

                  <p className="mt-1 max-w-45 truncate text-xs text-slate-500 dark:text-slate-400">
                    {booking.passenger.email}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {booking.passengerCount} passenger
                    {booking.passengerCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4 align-top">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {booking.airlineCode} {booking.flightNumber}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {booking.baggageCount} bag
                    {booking.baggageCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4 align-top">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {booking.departureAirportCode}
                  </span>

                  <span className="text-slate-400">→</span>

                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {booking.arrivalAirportCode}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {booking.departureCity} → {booking.arrivalCity}
                </p>
              </td>

              <td className="px-5 py-4 align-top">
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatDate(booking.departureDate)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {booking.departureTime}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 align-top">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {booking.cabinClass}
                </span>
              </td>

              <td className="px-5 py-4 align-top">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(booking.amount, booking.currency)}
                </p>

                <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                  {booking.paymentStatus}
                </p>
              </td>

              <td className="px-5 py-4 align-top">
                <BookingStatusBadge status={booking.status} />
              </td>

              <td className="px-5 py-4 text-right align-top">
                <BookingAction
                  onView={() => onView(booking)}
                  onEdit={() => onEdit(booking)}
                  onDelete={() => onDelete(booking)}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>


);
}
