"use client";

import { motion } from "framer-motion";
import {
Download,
Plus,
Users,
} from "lucide-react";

interface PassengerHeaderProps {
totalPassengers: number;
onAddPassenger: () => void;
onExport?: () => void;
}

export default function PassengerHeader({
totalPassengers,
onAddPassenger,
onExport,
}: PassengerHeaderProps) {
return (
<motion.header
initial={{ opacity: 0, y: -16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
>
{/* Decorative background */} <div className="pointer-events-none absolute inset-0 overflow-hidden"> <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" /> <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-blue-500/5 blur-3xl" /> </div>


  <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
    {/* Title */}
    <div className="flex min-w-0 items-start gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400"
      >
        <Users className="h-6 w-6" />
      </motion.div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Passengers
          </h1>

          <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
            {totalPassengers}{" "}
            {totalPassengers === 1 ? "Passenger" : "Passengers"}
          </span>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Manage passenger profiles, travel documents, account
          status, and booking activity from one place.
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
      {onExport && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onExport}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Download className="h-4 w-4" />
          Export
        </motion.button>
      )}

      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAddPassenger}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
      >
        <Plus className="h-4 w-4" />
        Add Passenger
      </motion.button>
    </div>
  </div>
</motion.header>


);
}
