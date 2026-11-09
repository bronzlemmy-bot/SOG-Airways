"use client";

import { motion } from "framer-motion";
import {
AlertTriangle,
CalendarDays,
CircleX,
DollarSign,
Plane,
Radio,
} from "lucide-react";

import type {
AdminFlightSummary,
} from "./admin-flights-data/AdminFlightsData";

interface FlightStatsProps {
summaries: AdminFlightSummary[];
}

const iconMap = {
total: Plane,
scheduled: CalendarDays,
boarding: Radio,
delayed: AlertTriangle,
cancelled: CircleX,
revenue: DollarSign,
} as const;

const styleMap = {
total: {
icon: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
value: "text-sky-700 dark:text-sky-400",
},
scheduled: {
icon: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
value: "text-blue-700 dark:text-blue-400",
},
boarding: {
icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
value: "text-emerald-700 dark:text-emerald-400",
},
delayed: {
icon: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
value: "text-amber-700 dark:text-amber-400",
},
cancelled: {
icon: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
value: "text-red-700 dark:text-red-400",
},
revenue: {
icon: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
value: "text-violet-700 dark:text-violet-400",
},
} as const;

export default function FlightStats({
summaries,
}: FlightStatsProps) {
return ( <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
{summaries.map((summary, index) => {
const Icon = iconMap[summary.type];
const styles = styleMap[summary.type];


    return (
      <motion.div
        key={summary.id}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
          delay: index * 0.04,
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {summary.label}
            </p>

            <p
              className={`mt-2 truncate text-2xl font-bold ${styles.value}`}
            >
              {summary.value}
            </p>
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {summary.description}
        </p>
      </motion.div>
    );
  })}
</div>


);
}
