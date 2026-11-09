"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
CheckCircle2,
MapPin,
Users,
} from "lucide-react";

import type { ManageTrip } from "./manage-trip-data/ManageTripData";

interface TripOverviewProps {
trip: ManageTrip;
}

export default function TripOverview({
trip,
}: TripOverviewProps) {
const { flight } = trip;

return (
<motion.section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, delay: 0.05 }}
className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
Trip Overview </p>


        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {flight.origin.city} to {flight.destination.city}
        </h2>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        {trip.status}
      </div>
    </div>
  </div>

  <div className="p-5 sm:p-6">
    <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Departure
            </p>

            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {flight.origin.code}
            </p>

            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
              {flight.origin.city}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
            <MapPin className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" />
          <span>{flight.departureDate}</span>
        </div>

        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
          {flight.departureTime}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {flight.origin.airport}
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">
            {flight.duration}
          </span>

          <div className="flex w-24 items-center">
            <span className="h-2 w-2 rounded-full bg-slate-400" />

            <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
              <ArrowRight className="h-4 w-4" />
            </div>

            <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />

            <span className="h-2 w-2 rounded-full bg-slate-400" />
          </div>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {flight.flightNumber}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Arrival
            </p>

            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {flight.destination.code}
            </p>

            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
              {flight.destination.city}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
            <MapPin className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" />
          <span>{flight.arrivalDate}</span>
        </div>

        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
          {flight.arrivalTime}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {flight.destination.airport}
        </p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Airline
        </p>
        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {flight.airline}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cabin
        </p>
        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {flight.cabinClass}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Passengers
          </p>
        </div>

        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {trip.passengers.length}{" "}
          {trip.passengers.length === 1 ? "Passenger" : "Passengers"}
        </p>
      </div>
    </div>
  </div>
</motion.section>


);
}
