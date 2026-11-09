"use client";

import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  CalendarDays,
  Plane,
  Plus,
  RefreshCw,
} from "lucide-react";


interface FlightHeaderProps {
  totalFlights?: number;
  onAddFlight: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
  className?: string;
}

export default function FlightHeader({
  totalFlights = 0,
  onAddFlight,
  onRefresh,
  onExport,
  loading = false,
  className = "",
}: FlightHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
            <Plane className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-400">
                SOG Airways
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {totalFlights} {totalFlights === 1 ? "flight" : "flights"}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Flight Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Manage flight schedules, routes, aircraft, fares, seat capacity,
              and operational status from one place.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          {onRefresh && (
            <OutlineButton
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="justify-center"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </OutlineButton>
          )}

          {onExport && (
            <OutlineButton
              type="button"
              onClick={onExport}
              disabled={loading || totalFlights === 0}
              className="justify-center"
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" aria-hidden="true" />
              Export
            </OutlineButton>
          )}

          <PrimaryButton
            type="button"
            onClick={onAddFlight}
            disabled={loading}
            className="justify-center"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add New Flight
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        <span>Keep flight schedules and operational details up to date.</span>
      </div>
    </motion.section>
  );
}