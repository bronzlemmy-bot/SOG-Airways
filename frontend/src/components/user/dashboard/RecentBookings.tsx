
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Plane,
  ReceiptText,
} from "lucide-react";
import { recentBookings } from "./dashboard-data/DashboardDta";

const statusStyles: Record<string, string> = {
  Confirmed:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Completed:
    "bg-slate-100 text-slate-700 ring-slate-200",
  Pending:
    "bg-amber-50 text-amber-700 ring-amber-200",
  Cancelled:
    "bg-red-50 text-red-700 ring-red-200",
};

export default function RecentBookings() {
  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            Your activity
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Recent bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of your latest flight reservations.
          </p>
        </div>

        <Link
          href="/users/bookings"
          className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
        >
          View all bookings
          <ArrowRight
            size={17}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Bookings */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {recentBookings.map((booking, index) => (
            <motion.article
              key={booking.bookingReference}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="group p-5 transition-colors duration-200 hover:bg-slate-50/80 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Booking information */}
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Plane size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {booking.route}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
                          statusStyles[booking.status] ??
                          "bg-slate-100 text-slate-700 ring-slate-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.flightNumber} · {booking.cabin}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {booking.date}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <ReceiptText size={14} />
                        {booking.bookingReference}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount + action */}
                <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-4 `lg:min-w-[190px] lg:border-t-0 lg:pt-0 lg:text-right">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Total amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {booking.currency}{" "}
                      {booking.amount.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/users/booking-details/${booking.bookingReference}`}
                    className="group/action flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                    aria-label={`View booking ${booking.bookingReference}`}
                  >
                    <ChevronRight
                      size={19}
                      className="transition-transform duration-200 group-hover/action:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} />
            <span>Your latest booking activity</span>
          </div>

          <Link
            href="/users/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-sky-600"
          >
            Manage bookings
            <CircleCheck size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

