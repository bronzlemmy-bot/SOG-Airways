"use client";

import { motion } from "framer-motion";
import {
CalendarCheck,
CircleDollarSign,
Clock3,
Ticket,
XCircle,
} from "lucide-react";

import type { AdminBookingSummary } from "./admin-bookings-data/AdminBookingsData";

interface BookingStatsProps {
summaries: AdminBookingSummary[];
}

const icons = {
total: Ticket,
confirmed: CalendarCheck,
pending: Clock3,
cancelled: XCircle,
revenue: CircleDollarSign,
} as const;

const iconStyles = {
total: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
confirmed:
"bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
pending:
"bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
cancelled:
"bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
revenue:
"bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
} as const;

export default function BookingStats({
summaries,
}: BookingStatsProps) {
return ( <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
{summaries.map((summary, index) => {
const Icon = icons[summary.type];
const style = iconStyles[summary.type];


    return (
      <motion.div
        key={summary.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.25,
          delay: index * 0.05,
        }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${style}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {summary.label}
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {summary.value}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
            {summary.description}
          </p>
        </div>
      </motion.div>
    );
  })}
</div>


);
}
