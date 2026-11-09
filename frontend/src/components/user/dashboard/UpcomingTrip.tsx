
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Plane,
  Users,
} from "lucide-react";

import { upcomingTrips } from "./dashboard-data/DashboardDta";

const UpcomingTrip = () => {
  return (
    <section aria-labelledby="upcoming-trips-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
            Your journey
          </p>

          <h2
            id="upcoming-trips-heading"
            className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
          >
            Upcoming trips
          </h2>
        </div>

        <Link
          href="/users/manage-trips"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingTrips.map((trip, index) => (
          <motion.article
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            whileHover={{ y: -3 }}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                    <Plane className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {trip.airline}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {trip.flightNumber} · {trip.cabin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {trip.status}
                  </span>

                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {trip.bookingReference}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {trip.departure.airport}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {trip.departure.city}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {trip.departure.date}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {trip.departure.time}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">
                    {trip.duration}
                  </span>

                  <div className="flex w-full `min-w-[120px] items-center gap-2 md:w-36">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />

                    <div className="relative h-px flex-1 bg-slate-200 dark:bg-slate-700">
                      <Plane className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-white text-sky-500 dark:bg-slate-900" />
                    </div>

                    <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                  </div>

                  <span className="text-xs text-slate-400">
                    Direct flight
                  </span>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {trip.arrival.airport}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {trip.arrival.city}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 md:justify-end">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {trip.arrival.date}
                    </div>

                    <div className="flex items-center gap-1.5 md:justify-end">
                      <Clock3 className="h-3.5 w-3.5" />
                      {trip.arrival.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-slate-50 px-5 py-4 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" />

                <span>
                  {trip.passengers}{" "}
                  {trip.passengers === 1 ? "passenger" : "passengers"}
                </span>
              </div>

              <Link
                href="/users/manage-trips"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-sky-200 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-500/30 dark:hover:text-sky-400"
              >
                View trip
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default UpcomingTrip;

