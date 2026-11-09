"use client";

import { motion } from "framer-motion";
import {
Building2,
Clock3,
DoorOpen,
MapPin,
Plane,
Route,
} from "lucide-react";

import type { Airport } from "./airports-data/AirportsData";
import AirportAction from "./AirportActions";

interface AirportCardProps {
airport: Airport;
onView: (airport: Airport) => void;
onEdit: (airport: Airport) => void;
onDelete: (airport: Airport) => void;
}

export default function AirportCard({
airport,
onView,
onEdit,
onDelete,
}: AirportCardProps) {
return (
<motion.article
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}
whileHover={{ y: -2 }}
className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4"> <div className="flex min-w-0 items-start gap-3"> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Building2 className="h-5 w-5" /> </div>

```
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
          {airport.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {airport.code}
          </span>

          <span>•</span>

          <span className="truncate">
            {airport.city}, {airport.country}
          </span>
        </div>
      </div>
    </div>

    <AirportAction
      onView={() => onView(airport)}
      onEdit={() => onEdit(airport)}
      onDelete={() => onDelete(airport)}
    />
  </div>

  <div className="mt-5 flex flex-wrap gap-2">
    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
      {airport.airportType}
    </span>

    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        airport.status === "operational"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          : airport.status === "limited"
            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
      }`}
    >
      {airport.status}
    </span>
  </div>

  <div className="mt-5 grid grid-cols-2 gap-3">
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <DoorOpen className="h-3.5 w-3.5" />
        Gates
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
        {airport.gateCount}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Route className="h-3.5 w-3.5" />
        Runways
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
        {airport.runwayCount}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Plane className="h-3.5 w-3.5" />
        Flights
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
        {airport.flightCount}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Clock3 className="h-3.5 w-3.5" />
        Hours
      </div>

      <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
        {airport.operatingHours}
      </p>
    </div>
  </div>

  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
    <MapPin className="h-3.5 w-3.5 shrink-0" />
    <span>
      {airport.latitude.toFixed(4)}, {airport.longitude.toFixed(4)}
    </span>
  </div>
</motion.article>


);
}
