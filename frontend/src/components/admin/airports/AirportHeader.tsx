"use client";

import { motion } from "framer-motion";
import { MapPinned, Plus } from "lucide-react";

interface AirportHeaderProps {
onAddAirport: () => void;
}

export default function AirportHeader({
onAddAirport,
}: AirportHeaderProps) {
return (
<motion.header
initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
> <div className="flex items-start gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <MapPinned className="h-6 w-6" /> </div>


    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        Airports
      </h1>

      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        Manage SOG Airways airport locations, facilities,
        operations, and flight activity.
      </p>
    </div>
  </div>

  <motion.button
    type="button"
    onClick={onAddAirport}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:w-auto"
  >
    <Plus className="h-4 w-4" />
    Add Airport
  </motion.button>
</motion.header>


);
}
