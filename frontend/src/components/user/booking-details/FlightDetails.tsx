"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
Clock3,
MapPin,
Plane,
} from "lucide-react";

export interface FlightDetailsData {
airline?: string;
flightNumber?: string;
origin: {
code: string;
city: string;
airport?: string;
};
destination: {
code: string;
city: string;
airport?: string;
};
departureDate?: string;
departureTime?: string;
arrivalDate?: string;
arrivalTime?: string;
cabinClass?: string;
}

interface FlightDetailsProps {
flight: FlightDetailsData;
}

const formatDate = (date?: string) => {
if (!date) return "—";

const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
};

export default function FlightDetails({
flight,
}: FlightDetailsProps) {
return (
<motion.section
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, ease: "easeOut" }}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-4 sm:px-6"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"> <Plane className="h-5 w-5" /> </div>

```
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Flight Details
        </h2>

        <p className="text-sm text-slate-500">
          Your flight itinerary
        </p>
      </div>
    </div>
  </div>

  <div className="px-5 py-6 sm:px-6">
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-slate-900">
        {flight.airline || "Airline"}
      </span>

      {flight.flightNumber && (
        <span className="text-sm text-slate-500">
          {flight.flightNumber}
        </span>
      )}

      {flight.cabinClass && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {flight.cabinClass}
        </span>
      )}
    </div>

    <div className="mt-7 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {flight.origin.code}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {flight.origin.city}
        </p>

        {flight.origin.airport && (
          <p className="mt-1 text-xs text-slate-400">
            {flight.origin.airport}
          </p>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {formatDate(flight.departureDate)}
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <Clock3 className="h-4 w-4 text-slate-400" />
            {flight.departureTime || "—"}
          </div>
        </div>
      </div>

      <div className="hidden min-w-40 lg:block">
        <div className="flex items-center">
          <div className="h-px flex-1 bg-slate-200" />

          <div className="mx-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
            <Plane className="h-4 w-4 rotate-90" />
          </div>

          <div className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <div className="lg:text-right">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {flight.destination.code}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {flight.destination.city}
        </p>

        {flight.destination.airport && (
          <p className="mt-1 text-xs text-slate-400">
            {flight.destination.airport}
          </p>
        )}

        <div className="mt-4 space-y-2 lg:flex lg:flex-col lg:items-end">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {formatDate(
              flight.arrivalDate ||
                flight.departureDate
            )}
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <Clock3 className="h-4 w-4 text-slate-400" />
            {flight.arrivalTime || "—"}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
      <MapPin className="h-3.5 w-3.5 text-slate-400" />
      <span>
        {flight.origin.code} to{" "}
        {flight.destination.code}
      </span>
    </div>
  </div>
</motion.section>


);
}
