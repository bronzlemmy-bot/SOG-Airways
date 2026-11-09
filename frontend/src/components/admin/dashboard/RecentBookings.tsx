"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
ChevronRight,
Clock3,
Plane,
Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type {
DashboardBookingStatus,
RecentBooking,
} from "./admin-dashboard-data/AdminDashboardData";

interface RecentBookingsProps {
bookings: RecentBooking[];
}

export default function RecentBookings({
bookings,
}: RecentBookingsProps) {
const router = useRouter();

const viewBooking = (bookingId: string) => {
router.push(`/admin/bookings/${bookingId}`);
};

const viewAllBookings = () => {
router.push("/admin/bookings");
};

return ( <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800"> <div> <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
Recent Bookings </h2>


      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Latest reservations made by your customers.
      </p>
    </div>

    <button
      type="button"
      onClick={viewAllBookings}
      className="group inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-sky-600 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-950/40 dark:hover:text-sky-300"
    >
      View all
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  </div>

  {bookings.length === 0 ? (
    <EmptyBookingState />
  ) : (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-190">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/30">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Booking
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Passenger
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Flight
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Departure
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Amount
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bookings.map((booking, index) => (
              <DesktopBookingRow
                key={booking.id}
                booking={booking}
                index={index}
                onView={() => viewBooking(booking.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {bookings.map((booking, index) => (
          <MobileBookingCard
            key={booking.id}
            booking={booking}
            index={index}
            onView={() => viewBooking(booking.id)}
          />
        ))}
      </div>
    </>
  )}
</section>


);
}

/* -------------------------------------------------------------------------- */
/* Desktop row                                                                */
/* -------------------------------------------------------------------------- */

interface DesktopBookingRowProps {
booking: RecentBooking;
index: number;
onView: () => void;
}

function DesktopBookingRow({
booking,
index,
onView,
}: DesktopBookingRowProps) {
return (
<motion.tr
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.3,
delay: index * 0.05,
}}
className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
> <td className="px-6 py-4"> <div> <p className="text-sm font-bold text-slate-900 dark:text-white">
{booking.bookingReference} </p>


      <p className="mt-0.5 text-xs text-slate-400">
        {booking.id}
      </p>
    </div>
  </td>

  <td className="px-6 py-4">
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Users className="h-4 w-4" />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {booking.passengerName}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {booking.passengerCount}{" "}
          {booking.passengerCount === 1
            ? "passenger"
            : "passengers"}
        </p>
      </div>
    </div>
  </td>

  <td className="px-6 py-4">
    <div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {booking.departureAirport}
        </span>

        <Plane className="h-3.5 w-3.5 text-slate-400" />

        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {booking.arrivalAirport}
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        {booking.route}
      </p>
    </div>
  </td>

  <td className="px-6 py-4">
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <CalendarDays className="h-4 w-4 text-slate-400" />
        {booking.departureDate}
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
        <Clock3 className="h-3.5 w-3.5" />
        {booking.departureTime}
      </div>
    </div>
  </td>

  <td className="px-6 py-4">
    <div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {formatAmount(booking.amount, booking.currency)}
      </p>

      <p className="mt-0.5 text-xs text-slate-400">
        {booking.cabinClass}
      </p>
    </div>
  </td>

  <td className="px-6 py-4">
    <BookingStatus status={booking.status} />
  </td>

  <td className="px-6 py-4 text-right">
    <button
      type="button"
      onClick={onView}
      aria-label={`View booking ${booking.bookingReference}`}
      title="View booking"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </td>
</motion.tr>


);
}

/* -------------------------------------------------------------------------- */
/* Mobile card                                                                */
/* -------------------------------------------------------------------------- */

interface MobileBookingCardProps {
booking: RecentBooking;
index: number;
onView: () => void;
}

function MobileBookingCard({
booking,
index,
onView,
}: MobileBookingCardProps) {
return (
<motion.article
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.3,
delay: index * 0.05,
}}
className="p-5"
> <div className="flex items-start justify-between gap-3"> <div> <p className="text-sm font-bold text-slate-900 dark:text-white">
{booking.bookingReference} </p>


      <p className="mt-0.5 text-xs text-slate-400">
        {booking.id}
      </p>
    </div>

    <BookingStatus status={booking.status} />
  </div>

  <div className="mt-4 flex items-center gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <Users className="h-4 w-4" />
    </div>

    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
        {booking.passengerName}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {booking.passengerCount}{" "}
        {booking.passengerCount === 1
          ? "passenger"
          : "passengers"}
      </p>
    </div>
  </div>

  <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      Route
    </p>

    <div className="mt-2 flex items-center gap-2">
      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {booking.departureAirport}
      </span>

      <div className="flex flex-1 items-center gap-2">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

        <Plane className="h-4 w-4 shrink-0 text-slate-400" />

        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {booking.arrivalAirport}
      </span>
    </div>

    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
      {booking.route}
    </p>
  </div>

  <div className="mt-3 grid grid-cols-2 gap-3">
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center gap-2 text-slate-400">
        <CalendarDays className="h-3.5 w-3.5" />

        <span className="text-[10px] font-semibold uppercase tracking-wider">
          Departure
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {booking.departureDate}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {booking.departureTime}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center gap-2 text-slate-400">
        <Clock3 className="h-3.5 w-3.5" />

        <span className="text-[10px] font-semibold uppercase tracking-wider">
          Cabin
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {booking.cabinClass}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {formatAmount(booking.amount, booking.currency)}
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={onView}
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
  >
    View booking
    <ArrowRight className="h-4 w-4" />
  </button>
</motion.article>


);
}

/* -------------------------------------------------------------------------- */
/* Booking status                                                             */
/* -------------------------------------------------------------------------- */

function BookingStatus({
status,
}: {
status: DashboardBookingStatus;
}) {
if (status === "confirmed") {
return ( <span className="inline-flex whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
Confirmed </span>
);
}

if (status === "pending") {
return ( <span className="inline-flex whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
Pending </span>
);
}

return ( <span className="inline-flex whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:bg-red-950/40 dark:text-red-300">
Cancelled </span>
);
}

/* -------------------------------------------------------------------------- */
/* Currency formatting                                                        */
/* -------------------------------------------------------------------------- */

function formatAmount(
amount: number,
currency: string,
): string {
try {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
} catch {
return `${currency} ${amount.toLocaleString()}`;
}
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyBookingState() {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="flex flex-col items-center justify-center px-6 py-12 text-center"
> <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"> <Plane className="h-5 w-5" /> </div>


  <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
    No recent bookings
  </h3>

  <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
    New customer bookings will appear here once they are created.
  </p>
</motion.div>


);
}
