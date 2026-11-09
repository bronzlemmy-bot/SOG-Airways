"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
ArrowLeft,
CalendarDays,
CheckCircle2,
Plane,
TicketCheck,
} from "lucide-react";

interface CheckInHeaderProps {
bookingReference?: string;
status?: string;
departureDate?: string;
flightNumber?: string;
originCode?: string;
destinationCode?: string;
}

function formatDate(date?: string) {
if (!date) return "—";

const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
return date;
}

return new Intl.DateTimeFormat("en-US", {
weekday: "short",
month: "short",
day: "numeric",
year: "numeric",
}).format(parsedDate);
}

export default function CheckInHeader({
bookingReference,
status,
departureDate,
flightNumber,
originCode,
destinationCode,
}: CheckInHeaderProps) {
const normalizedStatus = status?.trim().toLowerCase();

const isConfirmed =
normalizedStatus === "confirmed" ||
normalizedStatus === "completed" ||
normalizedStatus === "checked-in" ||
normalizedStatus === "checkedin";

return ( <section className="relative overflow-hidden bg-slate-950">
<div
className="absolute inset-0 bg-cover bg-center"
style={{
backgroundImage:
"url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85')",
}}
/>

```
  <div className="absolute inset-0 bg-slate-950/70" />
  <div className="absolute inset-0 bg-Linear-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />

  <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl"
    >
      <Link
        href="/users/bookings"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Bookings
      </Link>

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        <TicketCheck className="h-4 w-4" />
        SOG Airways
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Online Check-In
        </h1>

        {isConfirmed && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
            <CheckCircle2 className="h-4 w-4" />
            Booking Confirmed
          </span>
        )}
      </div>

      <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
        Complete your check-in, verify your passenger information, select
        your seat, and review your baggage before your flight.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {bookingReference && (
          <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Booking Reference
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {bookingReference}
            </p>
          </div>
        )}

        {(originCode || destinationCode) && (
          <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Route
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
              <span>{originCode || "—"}</span>
              <Plane className="h-4 w-4 text-white/60" />
              <span>{destinationCode || "—"}</span>
            </div>
          </div>
        )}

        {flightNumber && (
          <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Flight
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {flightNumber}
            </p>
          </div>
        )}

        {departureDate && (
          <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Departure
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
              <CalendarDays className="h-4 w-4 text-white/60" />
              <span>{formatDate(departureDate)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  </div>
</section>


);
}
