"use client";

import { Plus, Ticket } from "lucide-react";
import { motion } from "framer-motion";

interface BookingHeaderProps {
onAddBooking: () => void;
}

export default function BookingHeader({
onAddBooking,
}: BookingHeaderProps) {
return (
<motion.div
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
> <div className="flex items-start gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Ticket className="h-5 w-5" /> </div>


    <div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        Bookings
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        Manage passenger reservations, flight bookings, payments, and
        booking status.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={onAddBooking}
    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
  >
    <Plus className="h-4 w-4" />
    Add Booking
  </button>
</motion.div>


);
}
