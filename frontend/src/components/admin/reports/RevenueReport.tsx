"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
  type RevenueReportItem,
} from "./admin-reports-data/ReportsData";

interface RevenueReportProps {
  data: RevenueReportItem[];
}

export default function RevenueReport({ data }: RevenueReportProps) {
  const totals = data.reduce(
    (accumulator, item) => ({
      revenue: accumulator.revenue + item.revenue,
      bookings: accumulator.bookings + item.bookings,
      payments: accumulator.payments + item.payments,
    }),
    {
      revenue: 0,
      bookings: 0,
      payments: 0,
    },
  );

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Revenue Report
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Revenue generated from bookings and recorded payments.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-950/30">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Total Revenue
          </p>

          <p className="mt-0.5 text-lg font-bold text-emerald-800 dark:text-emerald-200">
            {formatReportCurrency(totals.revenue, "NGN")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RevenueMetric
          icon={<Wallet className="h-4 w-4" />}
          label="Revenue"
          value={formatReportCurrency(totals.revenue, "NGN")}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        />

        <RevenueMetric
          icon={<TrendingUp className="h-4 w-4" />}
          label="Bookings"
          value={formatReportNumber(totals.bookings)}
          iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400"
        />

        <RevenueMetric
          icon={<CreditCard className="h-4 w-4" />}
          label="Payments"
          value={formatReportNumber(totals.payments)}
          iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-150">
          <div className="grid grid-cols-[1.4fr_repeat(3,minmax(110px,1fr))] gap-3 border-b border-slate-200 px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800">
            <span>Date</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Bookings</span>
            <span className="text-right">Payments</span>
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
                className="grid grid-cols-[1.4fr_repeat(3,minmax(110px,1fr))] items-center gap-3 px-3 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />

                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatReportDate(item.date)}
                  </span>
                </div>

                <span className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatReportCurrency(item.revenue, item.currency)}
                </span>

                <span className="text-right font-medium text-slate-700 dark:text-slate-200">
                  {formatReportNumber(item.bookings)}
                </span>

                <span className="text-right font-medium text-slate-700 dark:text-slate-200">
                  {formatReportNumber(item.payments)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface RevenueMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClass: string;
}

function RevenueMetric({
  icon,
  label,
  value,
  iconClass,
}: RevenueMetricProps) {
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

        <p className="mt-0.5 truncate text-base font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <Wallet className="mx-auto h-8 w-8 text-slate-400" />

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        No revenue report data is available.
      </p>
    </div>
  );
}