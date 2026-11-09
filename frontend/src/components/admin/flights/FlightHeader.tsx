"use client";

import { motion } from "framer-motion";
import { Plus, Plane } from "lucide-react";

interface FlightHeaderProps {
onAddFlight: () => void;
}

export default function FlightHeader({
onAddFlight,
}: FlightHeaderProps) {
return (
<motion.div
initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
> <div className="flex items-start gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>

```
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Flights
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        Manage flight schedules, routes, aircraft,
        seating, fares, and operational status.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={onAddFlight}
    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 sm:w-auto"
  >
    <Plus className="h-4 w-4" />
    Add Flight
  </button>
</motion.div>


);
}
