"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
CalendarCheck,
ChevronRight,
FileText,
Plane,
} from "lucide-react";

import type { Booking } from "./BookingCard";

interface BookingActionsProps {
booking: Booking;
compact?: boolean;
onAction?: (action: string, booking: Booking) => void;
}

export default function BookingActions({
booking,
compact = false,
onAction,
}: BookingActionsProps) {
const bookingKey = encodeURIComponent(booking.id);

const handleAction = (action: string) => {
onAction?.(action, booking);
};

if (compact) {
return ( <div className="flex flex-wrap items-center gap-2">
<Link
href={`/users/booking-details/${bookingKey}`}
onClick={() => handleAction("view-details")}
className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
> <FileText className="h-3.5 w-3.5" />
Details <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /> </Link>

```
    <Link
      href={`/users/manage-trips?bookingReference=${bookingKey}`}
      onClick={() => handleAction("manage-trip")}
      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      <CalendarCheck className="h-3.5 w-3.5" />
      Manage
    </Link>
  </div>
);


}

return (
<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35, ease: "easeOut" }}
className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
> <div className="mb-4"> <div className="flex items-center gap-2"> <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100"> <Plane className="h-4 w-4 text-slate-700" /> </div>

```
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Booking Actions
        </h3>

        <p className="text-xs text-slate-500">
          Manage your journey and booking details.
        </p>
      </div>
    </div>
  </div>

  <div className="grid gap-2 sm:grid-cols-3">
    <Link
      href={`/users/booking-details/${bookingKey}`}
      onClick={() => handleAction("view-details")}
      className="group flex min-h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      <span className="flex items-center gap-2.5">
        <FileText className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">
          View Details
        </span>
      </span>

      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
    </Link>

    <Link
      href={`/users/manage-trips?bookingReference=${bookingKey}`}
      onClick={() => handleAction("manage-trip")}
      className="group flex min-h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      <span className="flex items-center gap-2.5">
        <CalendarCheck className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">
          Manage Trip
        </span>
      </span>

      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
    </Link>

    <Link
      href={`/users/check-in/${bookingKey}`}
      onClick={() => handleAction("check-in")}
      className="group flex min-h-11 items-center justify-between rounded-xl bg-slate-900 px-4 py-3 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
    >
      <span className="flex items-center gap-2.5">
        <Plane className="h-4 w-4 text-white" />
        <span className="text-sm font-semibold text-white">
          Check-In
        </span>
      </span>

      <ChevronRight className="h-4 w-4 text-white/70 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </div>
</motion.div>


);
}
