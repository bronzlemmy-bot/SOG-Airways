
"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Plane,
  Ticket,
  TrendingUp,
} from "lucide-react";

import { dashboardStats } from "./dashboard-data/DashboardDta";

const iconMap = {
  ticket: Ticket,
  plane: Plane,
  check: CheckCircle2,
  award: Award,
};

const DashboardStats = () => {
  return (
    <section aria-labelledby="dashboard-stats-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
            Your activity
          </p>

          <h2
            id="dashboard-stats-heading"
            className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
          >
            Travel overview
          </h2>
        </div>

        <div className="hidden items-center gap-1.5 text-xs font-medium text-emerald-600 sm:flex">
          <TrendingUp className="h-4 w-4" />
          <span>Growing journey</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon =
            iconMap[stat.icon as keyof typeof iconMap] ?? Ticket;

          return (
            <motion.article
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Decorative background */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/5 transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors duration-300 group-hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:group-hover:bg-sky-500/15">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Overview
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>

                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardStats;
