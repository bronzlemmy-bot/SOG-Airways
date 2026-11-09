"use client";

import { motion } from "framer-motion";
import {
ArrowRight,
CalendarDays,
Plane,
ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
adminName?: string;
}

export default function DashboardHeader({
adminName = "Admin",
}: DashboardHeaderProps) {
const router = useRouter();

const today = new Intl.DateTimeFormat("en-NG", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
}).format(new Date());

const handleViewFlights = () => {
router.push("/admin/flights");
};

const handleViewReports = () => {
router.push("/admin/Reports");
};

return (
<motion.header
initial={{ opacity: 0, y: -18 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
> <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-slate-100 blur-3xl dark:bg-slate-800/70" />


  <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-slate-100/80 blur-3xl dark:bg-slate-800/50" />

  <div className="relative px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          SOG Airways Administration
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl"
        >
          Welcome back, {adminName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
        >
          Monitor your airline operations, bookings, flights, revenue,
          and passenger activity from one central dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <CalendarDays className="h-4 w-4" />
          <span>{today}</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
      >
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewFlights}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Plane className="h-4 w-4" />
          Manage Flights
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewReports}
          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          View Reports
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </motion.button>
      </motion.div>
    </div>
  </div>
</motion.header>


);
}
