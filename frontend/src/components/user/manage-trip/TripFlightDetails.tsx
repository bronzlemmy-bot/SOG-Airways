"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
Clock3,
Plane,
ShieldCheck,
} from "lucide-react";

import type { ManageTripFlight } from "./manage-trip-data/ManageTripData";

interface TripFlightDetailsProps {
flight: ManageTripFlight;
}

export default function TripFlightDetails({
flight,
}: TripFlightDetailsProps) {
return (
<motion.section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, delay: 0.1 }}
className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
Flight Details </p>


        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {flight.airline} · {flight.flightNumber}
        </h2>
      </div>

      <div className="flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <ShieldCheck className="h-4 w-4" />
        Confirmed itinerary
      </div>
    </div>
  </div>

  <div className="p-5 sm:p-6">
    <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Plane className="h-4 w-4" />
          Departure
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {flight.origin.code}
            </p>

            <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">
              {flight.origin.city}
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {flight.departureTime}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {flight.origin.airport}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <CalendarDays className="h-4 w-4 shrink-0" />
          {flight.departureDate}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-2 py-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
          <Plane className="h-5 w-5 rotate-90" />
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Flight Time
        </p>

        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Clock3 className="h-4 w-4" />
          {flight.duration}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Plane className="h-4 w-4" />
          Arrival
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {flight.destination.code}
            </p>

            <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">
              {flight.destination.city}
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {flight.arrivalTime}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {flight.destination.airport}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <CalendarDays className="h-4 w-4 shrink-0" />
          {flight.arrivalDate}
        </div>
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Flight Number
        </p>

        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {flight.flightNumber}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cabin Class
        </p>

        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {flight.cabinClass}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Duration
        </p>

        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {flight.duration}
        </p>
      </div>
    </div>
  </div>
</motion.section>


);
}
