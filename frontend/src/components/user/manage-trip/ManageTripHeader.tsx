"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CheckCircle2, Plane } from "lucide-react";
import Link from "next/link";

interface ManageTripHeaderProps {
bookingReference: string;
status: string;
tripType: string;
departureDate: string;
}

export default function ManageTripHeader({
bookingReference,
status,
tripType,
departureDate,
}: ManageTripHeaderProps) {
return (
<motion.section
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10"
> <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" /> <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />


  <div className="relative z-10">
    <Link
      href="/users/bookings"
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Bookings
    </Link>

    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <Plane className="h-4 w-4" />
          <span>Manage Trip</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Manage your trip
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          View your itinerary, update passenger details, change your
          flight, manage seats, and review baggage options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-107.5">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Booking
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">
            {bookingReference}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Status
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {status}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Departure
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white">
            <CalendarDays className="h-4 w-4 text-sky-400" />
            {departureDate}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
        {tripType}
      </span>

      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
        Trip confirmed
      </span>
    </div>
  </div>
</motion.section>


);
}
