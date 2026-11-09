
"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Plane,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface TripHeaderProps {
  totalTrips: number;
  onCreate: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function TripHeader({
  totalTrips,
  onCreate,
  onRefresh,
  isLoading = false,
  className = "",
}: TripHeaderProps) {
  const formattedTotal = new Intl.NumberFormat("en").format(
    Math.max(0, totalTrips),
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white shadow-xl shadow-blue-950/10 ${className}`}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-1/3 top-0 h-full w-px rotate-12 bg-white/5" />
      </div>

      <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-9">
        {/* Heading */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-sm">
            <Sparkles size={14} aria-hidden="true" />
            SOG AIRWAYS · ADMINISTRATION
          </div>

          <h1 className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Trip Management
            <PlaneTakeoff
              size={30}
              className="text-cyan-300"
              aria-hidden="true"
            />
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
            Manage trips, monitor flight segments, review bookings,
            and keep every journey organized from departure to arrival.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200">
                <CalendarDays size={17} aria-hidden="true" />
              </span>

              <span>
                <span className="block text-lg font-bold leading-5">
                  {formattedTotal}
                </span>
                <span className="mt-1 block text-xs text-blue-100/75">
                  {totalTrips === 1 ? "Total trip" : "Total trips"}
                </span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-blue-100/90 backdrop-blur-sm">
              <Plane size={16} aria-hidden="true" />
              <span>One-way · Round trip · Multi-city</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={isLoading ? "animate-spin" : ""}
                aria-hidden="true"
              />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          )}

          <motion.button
            type="button"
            onClick={onCreate}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 shadow-lg shadow-black/10 transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800 transition group-hover:bg-cyan-100">
              <Plus size={17} aria-hidden="true" />
            </span>

            Create Trip

            <ArrowUpRight
              size={16}
              className="ml-1 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              aria-hidden="true"
            />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
