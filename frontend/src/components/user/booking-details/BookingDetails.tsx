"use client";

import { motion } from "framer-motion";
import {
CalendarDays,
Hash,
Plane,
Users,
} from "lucide-react";
import BookingStatus from "../bookings/BookingStatus";



export interface BookingDetailsData {
id: string;
bookingReference?: string;
status: string;
airline?: string;
flightNumber?: string;
origin?: {
code: string;
city: string;
airport?: string;
};
destination?: {
code: string;
city: string;
airport?: string;
};
departureDate?: string;
departureTime?: string;
arrivalDate?: string;
arrivalTime?: string;
cabinClass?: string;
passengerCount?: number;
}

interface BookingDetailsProps {
booking: BookingDetailsData;
}

const formatDate = (value?: string) => {
if (!value) {
return "—";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return new Intl.DateTimeFormat("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}).format(date);
};

export default function BookingDetails({
booking,
}: BookingDetailsProps) {
return (
<motion.section
id="details"
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.45,
ease: "easeOut",
}}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
> <div className="border-b border-slate-100 px-5 py-5 sm:px-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <h2 className="text-lg font-bold text-slate-900">
Booking Information </h2>


        <p className="mt-1 text-sm text-slate-500">
          Information associated with this booking
        </p>
      </div>

      <BookingStatus
        status={booking.status}
        showIcon
      />
    </div>
  </div>

  <div className="p-5 sm:p-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Hash className="h-4 w-4" />

          <span className="text-xs font-medium">
            Booking Reference
          </span>
        </div>

        <p className="mt-2 break-all text-sm font-semibold text-slate-900">
          {booking.bookingReference || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Plane className="h-4 w-4" />

          <span className="text-xs font-medium">
            Flight
          </span>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          {booking.flightNumber || "—"}
        </p>

        {booking.airline && (
          <p className="mt-1 text-xs text-slate-500">
            {booking.airline}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <CalendarDays className="h-4 w-4" />

          <span className="text-xs font-medium">
            Departure
          </span>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          {formatDate(booking.departureDate)}
        </p>

        {booking.departureTime && (
          <p className="mt-1 text-xs text-slate-500">
            {booking.departureTime}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="h-4 w-4" />

          <span className="text-xs font-medium">
            Passengers
          </span>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          {booking.passengerCount !== undefined
            ? booking.passengerCount
            : "—"}
        </p>

        {booking.cabinClass && (
          <p className="mt-1 text-xs text-slate-500">
            {booking.cabinClass}
          </p>
        )}
      </div>
    </div>

    {(booking.origin || booking.destination) && (
      <div className="mt-5 rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              From
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {booking.origin?.code || "—"}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {booking.origin?.city || "—"}
            </p>

            {booking.origin?.airport && (
              <p className="mt-1 text-xs text-slate-500">
                {booking.origin.airport}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
              <Plane className="h-5 w-5" />
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              To
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {booking.destination?.code || "—"}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {booking.destination?.city || "—"}
            </p>

            {booking.destination?.airport && (
              <p className="mt-1 text-xs text-slate-500">
                {booking.destination.airport}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</motion.section>


);
}
