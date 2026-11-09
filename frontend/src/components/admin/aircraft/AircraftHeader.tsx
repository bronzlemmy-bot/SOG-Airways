"use client";

import { motion } from "framer-motion";
import { Plane, Plus } from "lucide-react";

interface AircraftHeaderProps {
onAddAircraft: () => void;
}

export default function AircraftHeader({
onAddAircraft,
}: AircraftHeaderProps) {
return (
<motion.header
initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
> <div className="flex items-start gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>


    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        Aircraft Fleet
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        Manage your SOG Airways aircraft, fleet status,
        seating capacity, and maintenance information.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={onAddAircraft}
    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 hover:shadow-md active:scale-[0.98] sm:w-auto"
  >
    <Plus className="h-4 w-4" />
    Add Aircraft
  </button>
</motion.header>


);
}
