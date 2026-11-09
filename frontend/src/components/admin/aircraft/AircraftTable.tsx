"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
MapPin,
Plane,
Users,
} from "lucide-react";

import AircraftAction from "./AircraftActions";
import AircraftStatusBadge from "./AircraftStatusBadge";
import type { Aircraft } from "./aircraft-data/AircraftData";

interface AircraftTableProps {
aircraft: Aircraft[];
onView: (aircraft: Aircraft) => void;
onEdit: (aircraft: Aircraft) => void;
onDelete: (aircraft: Aircraft) => void;
}

function formatDate(date: string) {
const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
}

export default function AircraftTable({
aircraft,
onView,
onEdit,
onDelete,
}: AircraftTableProps) {
if (aircraft.length === 0) {
return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900"
> <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"> <Plane className="h-7 w-7" /> </div>

```
    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
      No aircraft found
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
      No aircraft match the current search or filter criteria. Try
      adjusting your filters to see more aircraft.
    </p>
  </motion.div>
);


}

return (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-275">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
Aircraft </th>


          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Location
          </th>

          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Capacity
          </th>

          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Next Flight
          </th>

          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Maintenance
          </th>

          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Status
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {aircraft.map((item, index) => (
          <motion.tr
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.04,
            }}
            className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
          >
            <td className="px-5 py-4">
              <button
                type="button"
                onClick={() => onView(item)}
                className="flex items-center gap-3 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-950/60">
                  <Plane className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {item.registration}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.aircraftType} · {item.model}
                  </span>
                </span>
              </button>
            </td>

            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />

                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {item.currentAirportCode}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.currentAirport}
                  </p>
                </div>
              </div>
            </td>

            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />

                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.totalSeats}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    seats
                  </p>
                </div>
              </div>
            </td>

            <td className="px-5 py-4">
              {item.nextFlightNumber ? (
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.nextFlightNumber}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {item.nextFlight ?? "Scheduled flight"}
                  </p>
                </div>
              ) : (
                <span className="text-sm text-slate-400">
                  No scheduled flight
                </span>
              )}
            </td>

            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(item.nextMaintenanceDate)}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Next maintenance
                  </p>
                </div>
              </div>
            </td>

            <td className="px-5 py-4">
              <AircraftStatusBadge status={item.status} />
            </td>

            <td className="px-5 py-4">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <AircraftAction
                  onView={() => onView(item)}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="divide-y divide-slate-100 lg:hidden dark:divide-slate-800">
    {aircraft.map((item, index) => (
      <motion.article
        key={item.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.04,
        }}
        className="p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onView(item)}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Plane className="h-5 w-5" />
            </span>

            <span className="min-w-0">
              <span className="block truncate font-semibold text-slate-900 dark:text-white">
                {item.registration}
              </span>

              <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                {item.aircraftType}
              </span>
            </span>
          </button>

          <AircraftAction
            onView={() => onView(item)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        </div>

        <div className="mt-4">
          <AircraftStatusBadge status={item.status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </div>

            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
              {item.currentAirportCode}
            </p>

            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {item.currentAirport}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" />
              Capacity
            </div>

            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
              {item.totalSeats} seats
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Plane className="h-3.5 w-3.5" />
              Next flight
            </div>

            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
              {item.nextFlightNumber ?? "—"}
            </p>

            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {item.nextFlight ?? "No scheduled flight"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" />
              Maintenance
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(item.nextMaintenanceDate)}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Next maintenance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onView(item)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          View aircraft details
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.article>
    ))}
  </div>
</div>


);
}
