"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
ArrowLeft,
CalendarDays,
Hash,
} from "lucide-react";
import BookingStatus from "../bookings/BookingStatus";

;

interface BookingDetailsHeaderProps {
bookingReference?: string;
status: string;
departureDate?: string;
}

const formatDate = (value?: string) => {
if (!value) {
return "";
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

export default function BookingDetailsHeader({
bookingReference,
status,
departureDate,
}: BookingDetailsHeaderProps) {
return ( <section className="relative overflow-hidden">
<div
className="absolute inset-0 bg-cover bg-center"
style={{
backgroundImage:
"url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85')",
}}
/>


  <div className="absolute inset-0 bg-slate-950/70" />
  <div className="absolute inset-0 bg-Linear-to-r from-slate-950/90 via-slate-900/60 to-slate-950/40" />

  <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <Link
        href="/users/bookings"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Bookings
      </Link>

      <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-300">
            SOG Airways
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Booking Details
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Review your flight, passenger, baggage, payment, and booking information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BookingStatus
            status={status}
            showIcon
          />

          {bookingReference && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Hash className="h-4 w-4 text-white/70" />
              {bookingReference}
            </div>
          )}

          {departureDate && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <CalendarDays className="h-4 w-4 text-white/70" />
              {formatDate(departureDate)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </div>
</section>


);
}
