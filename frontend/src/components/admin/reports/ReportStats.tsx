"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Plane,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import {
  formatReportCurrency,
  formatReportNumber,
  type ReportSummary,
} from "./admin-reports-data/ReportsData";

interface ReportStatsProps {
  summary: ReportSummary;
}

export default function ReportStats({ summary }: ReportStatsProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: formatReportCurrency(summary.totalRevenue, "NGN"),
      description: "Recorded revenue",
      icon: Wallet,
    },
    {
      label: "Total Bookings",
      value: formatReportNumber(summary.totalBookings),
      description: `${formatReportNumber(summary.confirmedBookings)} confirmed`,
      icon: TrendingUp,
    },
    {
      label: "Total Passengers",
      value: formatReportNumber(summary.totalPassengers),
      description: `${formatReportNumber(summary.newPassengers)} new`,
      icon: Users,
    },
    {
      label: "Total Flights",
      value: formatReportNumber(summary.totalFlights),
      description: `${formatReportNumber(summary.upcomingFlights)} upcoming`,
      icon: Plane,
    },
    {
      label: "Total Payments",
      value: formatReportNumber(summary.totalPayments),
      description: `${formatReportNumber(summary.completedPayments)} completed`,
      icon: CreditCard,
    },
  ];

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 truncate text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                    {stat.value}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SecondaryStat
          label="Pending Payments"
          value={summary.pendingPayments}
        />

        <SecondaryStat
          label="Failed Payments"
          value={summary.failedPayments}
        />

        <SecondaryStat
          label="Refunded Payments"
          value={summary.refundedPayments}
        />

        <SecondaryStat
          label="Pending Bookings"
          value={summary.pendingBookings}
        />

        <SecondaryStat
          label="Cancelled Bookings"
          value={summary.cancelledBookings}
        />

        <SecondaryStat
          label="Cancelled Flights"
          value={summary.cancelledFlights}
        />
      </div>
    </section>
  );
}

interface SecondaryStatProps {
  label: string;
  value: number;
}

function SecondaryStat({ label, value }: SecondaryStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50"
    >
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <span className="text-base font-bold text-slate-900 dark:text-white">
        {formatReportNumber(value)}
      </span>
    </motion.div>
  );
}