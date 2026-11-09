"use client";

import { motion } from "framer-motion";
import {
Building2,
CalendarDays,
Clock3,
DoorOpen,
Globe2,
MapPin,
Plane,
Route,
Users,
X,
} from "lucide-react";

import type { Airport } from "./airports-data/AirportsData";

interface AirportDetailsProps {
airport: Airport | null;
onClose: () => void;
}

export default function AirportDetails({
airport,
onClose,
}: AirportDetailsProps) {
if (!airport) {
return null;
}

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
onMouseDown={(event) => {
if (event.target === event.currentTarget) {
onClose();
}
}}
>
<motion.div
initial={{ opacity: 0, y: 20, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.25 }}
className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
> <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-6"> <div className="flex min-w-0 items-start gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"> <Building2 className="h-6 w-6" /> </div>

```
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {airport.name}
            </h2>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {airport.code}
            </span>
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="h-4 w-4" />
            {airport.city}, {airport.country}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close airport details"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <div className="space-y-6 p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {airport.airportType}
        </span>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
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

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Airport Overview
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<Building2 className="h-4 w-4" />}
            label="Terminals"
            value={airport.terminalCount.toString()}
          />

          <InfoCard
            icon={<Route className="h-4 w-4" />}
            label="Runways"
            value={airport.runwayCount.toString()}
          />

          <InfoCard
            icon={<DoorOpen className="h-4 w-4" />}
            label="Gates"
            value={airport.gateCount.toString()}
          />

          <InfoCard
            icon={<Plane className="h-4 w-4" />}
            label="Daily Flights"
            value={airport.flightCount.toString()}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Capacity & Traffic
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow
            icon={<Users className="h-4 w-4" />}
            label="Passenger Capacity"
            value={airport.passengerCapacity.toLocaleString()}
          />

          <DetailRow
            icon={<Users className="h-4 w-4" />}
            label="Annual Passengers"
            value={airport.annualPassengers.toLocaleString()}
          />

          <DetailRow
            icon={<Globe2 className="h-4 w-4" />}
            label="Airlines"
            value={airport.airlineCount.toString()}
          />

          <DetailRow
            icon={<Clock3 className="h-4 w-4" />}
            label="Operating Hours"
            value={airport.operatingHours}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Location
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow
            icon={<MapPin className="h-4 w-4" />}
            label="City"
            value={airport.city}
          />

          <DetailRow
            icon={<Globe2 className="h-4 w-4" />}
            label="Country"
            value={`${airport.country} (${airport.countryCode})`}
          />

          <DetailRow
            icon={<Clock3 className="h-4 w-4" />}
            label="Time Zone"
            value={airport.timezone}
          />

          <DetailRow
            icon={<MapPin className="h-4 w-4" />}
            label="Coordinates"
            value={`${airport.latitude.toFixed(4)}, ${airport.longitude.toFixed(4)}`}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Record Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Created"
            value={airport.createdAt}
          />

          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Last Updated"
            value={airport.updatedAt}
          />
        </div>
      </section>
    </div>
  </motion.div>
</motion.div>


);
}

interface InfoCardProps {
icon: React.ReactNode;
label: string;
value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
return ( <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"> <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
{icon} <span className="text-xs font-medium">{label}</span> </div>


  <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
    {value}
  </p>
</div>


);
}

interface DetailRowProps {
icon: React.ReactNode;
label: string;
value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
return ( <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"> <div className="mt-0.5 text-slate-400 dark:text-slate-500">
{icon} </div>

```
  <div className="min-w-0">
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
      {label}
    </p>

    <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
</div>


);
}
