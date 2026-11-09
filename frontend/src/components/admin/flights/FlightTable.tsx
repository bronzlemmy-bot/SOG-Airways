"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

import FlightAction from "./FlightActions";
import FlightCard from "./FlightCard";
import FlightStatusBadge from "./FlightStatusBadge";

import type {
AdminFlight,
} from "./admin-flights-data/AdminFlightsData";

interface FlightTableProps {
flights: AdminFlight[];
onView: (flight: AdminFlight) => void;
onEdit: (flight: AdminFlight) => void;
onDelete: (flight: AdminFlight) => void;
}

function formatCurrency(
amount: number,
currency: string,
) {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 0,
}).format(amount);
}

export default function FlightTable({
flights,
onView,
onEdit,
onDelete,
}: FlightTableProps) {
if (flights.length === 0) {
return (
<motion.div
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900"
> <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"> <Plane className="h-5 w-5" /> </div>

```
    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
      No flights found
    </h3>

    <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
      Try changing your search or filters to
      find the flights you are looking for.
    </p>
  </motion.div>
);


}

return (
<> <div className="space-y-4 lg:hidden">
{flights.map((flight, index) => (
<motion.div
key={flight.id}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.2,
delay: index * 0.03,
}}
> <FlightCard
           flight={flight}
           onView={onView}
           onEdit={onEdit}
           onDelete={onDelete}
         />
</motion.div>
))} </div>

```
  <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
    <div className="overflow-x-auto">
      <table className="w-full min-w-275">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Flight
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Route
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Departure
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Aircraft
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Seats
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Fare
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Status
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {flights.map((flight, index) => (
            <motion.tr
              key={flight.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                delay: index * 0.025,
              }}
              className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {flight.flightNumber}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {flight.airlineCode}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {flight.departureAirportCode}
                    <span className="mx-2 text-slate-400">
                      →
                    </span>
                    {flight.arrivalAirportCode}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {flight.departureCity} →{" "}
                    {flight.arrivalCity}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {flight.departureDate}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {flight.departureTime}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {flight.aircraftType}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {flight.aircraftRegistration}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="min-w-28">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {flight.bookedSeats}/
                      {flight.totalSeats}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      {flight.availableSeats} left
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (flight.bookedSeats /
                            flight.totalSeats) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(
                    flight.baseFare,
                    flight.currency,
                  )}
                </p>
              </td>

              <td className="px-5 py-4">
                <FlightStatusBadge
                  status={flight.status}
                />
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end">
                  <FlightAction
                    onView={() => onView(flight)}
                    onEdit={() => onEdit(flight)}
                    onDelete={() =>
                      onDelete(flight)
                    }
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</>


);
}
