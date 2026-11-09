"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Ticket,
  XCircle,
} from "lucide-react";

import {
  formatReportDate,
  formatReportNumber,
  type BookingReportItem,
} from "./admin-reports-data/ReportsData";

interface BookingReportProps {
  data: BookingReportItem[];
}

export default function BookingReport({ data }: BookingReportProps) {
  const totals = data.reduce(
    (accumulator, item) => ({
      total: accumulator.total + item.total,
      confirmed: accumulator.confirmed + item.confirmed,
      pending: accumulator.pending + item.pending,
      cancelled: accumulator.cancelled + item.cancelled,
    }),
    {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    },
  );

  if (data.length === 0) {
    return (
      <EmptyState message="No booking report data is available." />
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
            <Ticket className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Booking Report
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Booking activity across the selected reporting data.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-sky-50 px-4 py-2.5 dark:bg-sky-950/30">
          <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
            Total Bookings
          </p>
          <p className="mt-0.5 text-lg font-bold text-sky-800 dark:text-sky-200">
            {formatReportNumber(totals.total)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BookingMetric
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Confirmed"
          value={totals.confirmed}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        />

        <BookingMetric
          icon={<Clock3 className="h-4 w-4" />}
          label="Pending"
          value={totals.pending}
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
        />

        <BookingMetric
          icon={<XCircle className="h-4 w-4" />}
          label="Cancelled"
          value={totals.cancelled}
          iconClass="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
        />

        <BookingMetric
          icon={<Ticket className="h-4 w-4" />}
          label="Records"
          value={data.length}
          iconClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-162.5">
          <div className="grid grid-cols-[1.3fr_repeat(4,minmax(90px,1fr))] gap-3 border-b border-slate-200 px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800">
            <span>Date</span>
            <span className="text-right">Total</span>
            <span className="text-right">Confirmed</span>
            <span className="text-right">Pending</span>
            <span className="text-right">Cancelled</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                }}
                className="grid grid-cols-[1.3fr_repeat(4,minmax(90px,1fr))] items-center gap-3 px-3 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatReportDate(item.date)}
                  </span>
                </div>

                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  {formatReportNumber(item.total)}
                </span>

                <span className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {formatReportNumber(item.confirmed)}
                </span>

                <span className="text-right font-medium text-amber-600 dark:text-amber-400">
                  {formatReportNumber(item.pending)}
                </span>

                <span className="text-right font-medium text-rose-600 dark:text-rose-400">
                  {formatReportNumber(item.cancelled)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface BookingMetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconClass: string;
}

function BookingMetric({
  icon,
  label,
  value,
  iconClass,
}: BookingMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
          {formatReportNumber(value)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <Ticket className="mx-auto h-8 w-8 text-slate-400" />

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}