"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
Clock3,
Plane,
Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type {
UpcomingFlight,
} from "./admin-dashboard-data/AdminDashboardData";

interface UpcomingFlightsProps {
flights: UpcomingFlight[];
}

export default function UpcomingFlights({
flights,
}: UpcomingFlightsProps) {
const router = useRouter();

const viewAllFlights = () => {
router.push("/admin/flights");
};

const viewFlight = (flightId: string) => {
router.push(`/admin/flights/${flightId}`);
};

return ( <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
{/* Header */} <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 dark:border-slate-800"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"> <Plane className="h-5 w-5" /> </div>

```
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
            Upcoming Flights
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor scheduled departures and seat availability.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={viewAllFlights}
        className="group inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-sky-600 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-950/40 dark:hover:text-sky-300"
      >
        View all
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  </div>

  {flights.length === 0 ? (
    <EmptyUpcomingFlights />
  ) : (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {flights.map((flight, index) => (
        <UpcomingFlightCard
          key={flight.id}
          flight={flight}
          index={index}
          onView={() => viewFlight(flight.id)}
        />
      ))}
    </div>
  )}
</section>


);
}

interface UpcomingFlightCardProps {
flight: UpcomingFlight;
index: number;
onView: () => void;
}

function UpcomingFlightCard({
flight,
index,
onView,
}: UpcomingFlightCardProps) {
const occupancy =
flight.totalSeats > 0
? Math.round(
(flight.bookedSeats / flight.totalSeats) * 100,
)
: 0;

return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.4,
delay: index * 0.06,
}}
className="p-5 sm:p-6"
> <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
{/* Flight Information */} <div className="min-w-0 flex-1"> <div className="flex flex-wrap items-center gap-2"> <span className="text-base font-extrabold text-slate-950 dark:text-white">
{flight.flightNumber} </span>


        <FlightStatus status={flight.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {flight.departureAirport}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Departure
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-300 dark:text-slate-600">
          <span className="h-px w-8 bg-current sm:w-12" />
          <Plane className="h-4 w-4" />
          <span className="h-px w-8 bg-current sm:w-12" />
        </div>

        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {flight.arrivalAirport}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Arrival
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
        {flight.route}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(flight.departureDate)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          {flight.departureTime} – {flight.arrivalTime}
        </span>

        <span>{flight.aircraft}</span>
      </div>
    </div>

    {/* Seat Information */}
    <div className="w-full xl:max-w-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Users className="h-3.5 w-3.5" />
          Seat occupancy
        </span>

        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {flight.bookedSeats}/{flight.totalSeats}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${occupancy}%` }}
          transition={{
            duration: 0.7,
            delay: index * 0.06,
            ease: "easeOut",
          }}
          className={`h-full rounded-full ${
            occupancy >= 90
              ? "bg-red-500"
              : occupancy >= 70
                ? "bg-amber-500"
                : "bg-sky-500"
          }`}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>{occupancy}% booked</span>

        <span>
          {flight.availableSeats} seats available
        </span>
      </div>
    </div>

    {/* Action */}
    <button
      type="button"
      onClick={onView}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 sm:w-fit dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-800 dark:hover:bg-sky-950/40 dark:hover:text-sky-300"
    >
      View flight
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
</motion.div>


);
}

function FlightStatus({
status,
}: {
status: "boarding" | "scheduled" | "delayed";
}) {
if (status === "boarding") {
return ( <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
Boarding </span>
);
}

if (status === "delayed") {
return ( <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:bg-red-950/40 dark:text-red-300">
Delayed </span>
);
}

return ( <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
Scheduled </span>
);
}

function EmptyUpcomingFlights() {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="flex flex-col items-center justify-center px-6 py-14 text-center"
> <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"> <Plane className="h-5 w-5" /> </div>

```
  <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
    No upcoming flights
  </h3>

  <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
    Upcoming scheduled flights will appear here.
  </p>
</motion.div>


);
}

function formatDate(value: string): string {
const date = new Date(`${value}T00:00:00`);

if (Number.isNaN(date.getTime())) {
return value;
}

return new Intl.DateTimeFormat("en-NG", {
day: "numeric",
month: "short",
year: "numeric",
}).format(date);
}
