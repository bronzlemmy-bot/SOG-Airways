"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Clock3,
  Globe2,
  MapPin,
  Plane,
  Route,
} from "lucide-react";

import AirportAction from "./AirportActions";
import AirportStatusBadge from "./AirportStatusBadge";
import type { Airport } from "./airports-data/AirportsData";

interface AirportTableProps {
  airports: Airport[];
  onView: (airport: Airport) => void;
  onEdit: (airport: Airport) => void;
  onDelete: (airport: Airport) => void;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatAirportType(type: Airport["airportType"]) {
  if (type === "international") return "International";
  if (type === "domestic") return "Domestic";
  return "Regional";
}

export default function AirportTable({
  airports,
  onView,
  onEdit,
  onDelete,
}: AirportTableProps) {
  if (airports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Building2 className="h-7 w-7 text-slate-500 dark:text-slate-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No airports found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          No airports match your current search or filter settings.
          Try changing your filters to see more airports.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Airport
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Location
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Type
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Operations
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {airports.map((airport, index) => (
              <motion.tr
                key={airport.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                      <Plane className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {airport.name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">
                        {airport.code}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-5">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {airport.city}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {airport.country}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-5">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {formatAirportType(airport.airportType)}
                  </span>
                </td>

                <td className="px-4 py-5">
                  <AirportStatusBadge status={airport.status} />
                </td>

                <td className="px-4 py-5">
                  <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{airport.gateCount} gates</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Route className="h-3.5 w-3.5" />
                      <span>{airport.runwayCount} runways</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Plane className="h-3.5 w-3.5" />
                      <span>{formatNumber(airport.flightCount)} flights</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>{airport.operatingHours}</span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-5">
                  <div className="flex justify-end">
                    <AirportAction
                      onView={() => onView(airport)}
                      onEdit={() => onEdit(airport)}
                      onDelete={() => onDelete(airport)}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet / Mobile Cards */}
      <div className="grid gap-4 p-4 lg:hidden">
        {airports.map((airport, index) => (
          <motion.div
            key={airport.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                  <Plane className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {airport.name}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {airport.code}
                  </p>
                </div>
              </div>

              <AirportAction
                onView={() => onView(airport)}
                onEdit={() => onEdit(airport)}
                onDelete={() => onDelete(airport)}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <AirportStatusBadge status={airport.status} />

              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {formatAirportType(airport.airportType)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Location</span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {airport.city}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {airport.country}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Globe2 className="h-4 w-4" />
                  <span className="text-xs">Timezone</span>
                </div>

                <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {airport.timezone}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs">Gates</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {airport.gateCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Plane className="h-4 w-4" />
                  <span className="text-xs">Flights</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {formatNumber(airport.flightCount)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Annual passengers
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {formatNumber(airport.annualPassengers)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Capacity
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {formatNumber(airport.passengerCapacity)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}