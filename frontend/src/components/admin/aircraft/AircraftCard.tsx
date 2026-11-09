"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
Clock3,
Gauge,
MapPin,
Plane,
Users,
Wrench,
} from "lucide-react";

import AircraftAction from "./AircraftActions";
import AircraftStatusBadge from "./AircraftStatusBadge";
import type { Aircraft } from "./aircraft-data/AircraftData";

interface AircraftCardProps {
aircraft: Aircraft;
onView: (aircraft: Aircraft) => void;
onEdit: (aircraft: Aircraft) => void;
onDelete: (aircraft: Aircraft) => void;
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-GB", {
day: "2-digit",
month: "short",
year: "numeric",
}).format(new Date(date));
}

function formatNumber(value: number) {
return new Intl.NumberFormat("en-NG").format(value);
}

function getOccupancyPercentage(aircraft: Aircraft) {
if (aircraft.totalSeats === 0) return 0;

return Math.min(
100,
Math.round((aircraft.totalSeats / aircraft.totalSeats) * 100),
);
}

export default function AircraftCard({
aircraft,
onView,
onEdit,
onDelete,
}: AircraftCardProps) {
const seatOccupancy = getOccupancyPercentage(aircraft);

return (
<motion.article
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{ y: -3 }}
transition={{ duration: 0.3 }}
className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
>
{/* Top section */} <div className="border-b border-slate-100 p-5 dark:border-slate-800"> <div className="flex items-start justify-between gap-4"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>

```
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-slate-950 dark:text-white">
              {aircraft.registration}
            </h3>

            <AircraftStatusBadge status={aircraft.status} />
          </div>

          <p className="mt-1 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
            {aircraft.aircraftType}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
            {aircraft.model} · {aircraft.manufacturer}
          </p>
        </div>
      </div>

      <AircraftAction
        onView={() => onView(aircraft)}
        onEdit={() => onEdit(aircraft)}
        onDelete={() => onDelete(aircraft)}
      />
    </div>
  </div>

  {/* Airport / next flight */}
  <div className="grid gap-px border-b border-slate-100 bg-slate-100 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800">
    <div className="bg-white p-4 dark:bg-slate-900">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <MapPin className="h-3.5 w-3.5" />
        Current Airport
      </div>

      <p className="text-sm font-bold text-slate-900 dark:text-white">
        {aircraft.currentAirportCode}
      </p>

      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
        {aircraft.currentAirport}
      </p>
    </div>

    <div className="bg-white p-4 dark:bg-slate-900">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <ArrowRight className="h-3.5 w-3.5" />
        Next Flight
      </div>

      {aircraft.nextFlightNumber ? (
        <>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {aircraft.nextFlightNumber}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {aircraft.nextFlight ?? "Scheduled flight"}
          </p>
        </>
      ) : (
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          No flight assigned
        </p>
      )}
    </div>
  </div>

  {/* Fleet information */}
  <div className="p-5">
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Users className="h-3.5 w-3.5" />
          Total Seats
        </div>

        <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
          {formatNumber(aircraft.totalSeats)}
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Gauge className="h-3.5 w-3.5" />
          Flight Hours
        </div>

        <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
          {formatNumber(aircraft.totalFlightHours)}
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Plane className="h-3.5 w-3.5" />
          Total Flights
        </div>

        <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
          {formatNumber(aircraft.totalFlights)}
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Wrench className="h-3.5 w-3.5" />
          Next Maintenance
        </div>

        <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">
          {formatDate(aircraft.nextMaintenanceDate)}
        </p>
      </div>
    </div>

    {/* Seat configuration */}
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Seat Configuration
        </span>

        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {seatOccupancy}% capacity
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${seatOccupancy}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-sky-500"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        <div>
          <span className="block text-slate-400 dark:text-slate-500">
            Economy
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatNumber(aircraft.economySeats)}
          </span>
        </div>

        <div>
          <span className="block text-slate-400 dark:text-slate-500">
            Premium
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatNumber(aircraft.premiumEconomySeats)}
          </span>
        </div>

        <div>
          <span className="block text-slate-400 dark:text-slate-500">
            Business
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatNumber(aircraft.businessSeats)}
          </span>
        </div>

        <div>
          <span className="block text-slate-400 dark:text-slate-500">
            First
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatNumber(aircraft.firstClassSeats)}
          </span>
        </div>
      </div>
    </div>

    {/* Maintenance footer */}
    <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>
          Last maintenance:{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatDate(aircraft.lastMaintenanceDate)}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Clock3 className="h-3.5 w-3.5" />
        <span>
          Updated {formatDate(aircraft.updatedAt)}
        </span>
      </div>
    </div>
  </div>
</motion.article>


);
}
