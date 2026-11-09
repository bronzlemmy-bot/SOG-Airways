"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
ArrowRight,
CalendarCheck2,
CheckCircle2,
Plane,
TicketCheck,
} from "lucide-react";

import Card from "@/components/ui/Card";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";

interface CheckInConfirmationProps {
bookingId: string;
bookingReference?: string;
flightNumber?: string;
originCode?: string;
destinationCode?: string;
seatNumber?: string;
passengerName?: string;
departureDate?: string;
onDone?: () => void;
}

function formatDate(value?: string) {
if (!value) return "—";

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return new Intl.DateTimeFormat("en-US", {
weekday: "short",
month: "short",
day: "numeric",
year: "numeric",
}).format(date);
}

export default function CheckInConfirmation({
bookingId,
bookingReference,
flightNumber,
originCode,
destinationCode,
seatNumber,
passengerName,
departureDate,
onDone,
}: CheckInConfirmationProps) {
const bookingKey = encodeURIComponent(bookingId);

return (
<motion.section
initial={{ opacity: 0, scale: 0.97, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="mx-auto w-full max-w-3xl"
> <Card className="overflow-hidden"> <div className="relative overflow-hidden bg-slate-900 px-6 py-10 text-center sm:px-10 sm:py-14"> <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-950" />

      <div
        role="note"
        className="relative mb-8 rounded-xl border border-amber-300 bg-amber-100 px-4 py-3 text-left text-sm font-semibold text-amber-950"
      >
        Demo only: this check-in and boarding information are simulated,
        are not valid for travel, and were not sent to an airline system.
      </div>

```
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl"
      >
        <CheckCircle2 className="h-11 w-11 text-emerald-500" />
      </motion.div>

      <div className="relative mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
          Check-In Complete
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          You&apos;re checked in!
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
          Your online check-in has been completed successfully. Your
          boarding information is ready for your trip.
        </p>
      </div>
    </div>

    <div className="p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <TicketCheck className="h-5 w-5 text-slate-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Booking Reference
              </p>
              <p className="mt-1 truncate font-semibold text-slate-900">
                {bookingReference || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <Plane className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Flight
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {flightNumber || "—"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {originCode || "—"} → {destinationCode || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <CalendarCheck2 className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Departure
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(departureDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <TicketCheck className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Passenger
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {passengerName || "—"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Seat {seatNumber || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="font-semibold text-emerald-900">
              Check-in confirmed
            </p>
            <p className="mt-1 text-sm leading-6 text-emerald-800">
              Keep your booking reference available when you travel. Your
              boarding pass and other travel documents can be accessed from
              your booking when those features are connected.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <PrimaryButton
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Back to My Bookings
          </span>
        </PrimaryButton>

        <Link
          href={`/users/booking-details/${bookingKey}`}
          className="w-full sm:w-auto"
        >
          <SecondaryButton type="button" className="w-full">
            View Booking Details
          </SecondaryButton>
        </Link>
      </div>
    </div>
  </Card>
</motion.section>


);
}
