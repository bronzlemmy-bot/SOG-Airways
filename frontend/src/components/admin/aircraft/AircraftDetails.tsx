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

import AircraftStatusBadge from "./AircraftStatusBadge";
import type { Aircraft } from "./aircraft-data/AircraftData";

interface AircraftDetailsProps {
aircraft: Aircraft;
onEdit: (aircraft: Aircraft) => void;
onClose: () => void;
}

function formatDate(date: string) {
return new Intl.DateTimeFormat("en-GB", {
day: "2-digit",
month: "long",
year: "numeric",
}).format(new Date(date));
}

function formatNumber(value: number) {
return new Intl.NumberFormat("en-NG").format(value);
}

function DetailItem({
label,
value,
icon,
}: {
label: string;
value: string;
icon: React.ReactNode;
}) {
return ( <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"> <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
{icon}
{label} </div>
  <p className="text-sm font-bold text-slate-900 dark:text-white">
    {value}
  </p>
</div>


);
}

export default function AircraftDetails({
aircraft,
onEdit,
onClose,
}: AircraftDetailsProps) {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
onClick={onClose}
>
<motion.div
initial={{ opacity: 0, scale: 0.96, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.96, y: 20 }}
transition={{ duration: 0.25 }}
role="dialog"
aria-modal="true"
aria-labelledby="aircraft-details-title"
className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
onClick={(event) => event.stopPropagation()}
>
{/* Header */} <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-7 dark:border-slate-800 dark:bg-slate-900/95"> <div className="flex items-start justify-between gap-4"> <div className="flex min-w-0 items-center gap-4"> <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <Plane className="h-6 w-6" /> </div>


          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="aircraft-details-title"
                className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-2xl"
              >
                {aircraft.registration}
              </h2>

              <AircraftStatusBadge status={aircraft.status} />
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {aircraft.aircraftType} · {aircraft.model}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close aircraft details"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <span className="text-xl leading-none">×</span>
        </button>
      </div>
    </div>

    <div className="space-y-7 p-5 sm:p-7">
      {/* Aircraft overview */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Aircraft Overview
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Basic identification and operational information.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Registration"
            value={aircraft.registration}
            icon={<Plane className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Aircraft Type"
            value={aircraft.aircraftType}
            icon={<Plane className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Model"
            value={aircraft.model}
            icon={<Gauge className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Manufacturer"
            value={aircraft.manufacturer}
            icon={<Wrench className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Airline Code"
            value={aircraft.airlineCode}
            icon={<Plane className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Current Airport"
            value={`${aircraft.currentAirportCode} — ${aircraft.currentAirport}`}
            icon={<MapPin className="h-3.5 w-3.5" />}
          />
        </div>
      </section>

      {/* Operations */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Flight Operations
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current assignment and historical flight activity.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Next Flight"
            value={aircraft.nextFlightNumber ?? "Not assigned"}
            icon={<ArrowRight className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Route / Assignment"
            value={aircraft.nextFlight ?? "No scheduled assignment"}
            icon={<Plane className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Total Flights"
            value={formatNumber(aircraft.totalFlights)}
            icon={<Plane className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Flight Hours"
            value={`${formatNumber(aircraft.totalFlightHours)} hours`}
            icon={<Clock3 className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Total Seats"
            value={formatNumber(aircraft.totalSeats)}
            icon={<Users className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Fleet Status"
            value={aircraft.status}
            icon={<Gauge className="h-3.5 w-3.5" />}
          />
        </div>
      </section>

      {/* Seating */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Seat Configuration
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current configured seating capacity by cabin class.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Economy
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
              {formatNumber(aircraft.economySeats)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              seats
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Premium Economy
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
              {formatNumber(aircraft.premiumEconomySeats)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              seats
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Business
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
              {formatNumber(aircraft.businessSeats)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              seats
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              First Class
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
              {formatNumber(aircraft.firstClassSeats)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              seats
            </p>
          </div>
        </div>
      </section>

      {/* Maintenance */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Maintenance
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Maintenance schedule and fleet service information.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem
            label="Last Maintenance"
            value={formatDate(aircraft.lastMaintenanceDate)}
            icon={<CalendarDays className="h-3.5 w-3.5" />}
          />

          <DetailItem
            label="Next Maintenance"
            value={formatDate(aircraft.nextMaintenanceDate)}
            icon={<Wrench className="h-3.5 w-3.5" />}
          />
        </div>
      </section>

      {/* Record information */}
      <section className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Added
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatDate(aircraft.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Last Updated
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatDate(aircraft.updatedAt)}
            </p>
          </div>
        </div>
      </section>
    </div>

    {/* Footer actions */}
    <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 p-5 backdrop-blur sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-900/95">
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => onEdit(aircraft)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 sm:w-auto"
      >
        <Wrench className="h-4 w-4" />
        Edit Aircraft
      </button>
    </div>
  </motion.div>
</motion.div>


);
}
