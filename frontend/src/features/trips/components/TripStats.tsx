
"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  CircleX,
  Plane,
  PlaneTakeoff,
  type LucideIcon,
} from "lucide-react";

import type { Trip, TripStatus } from "@/types";

interface TripStatsProps {
  trips: Trip[];
  isLoading?: boolean;
  className?: string;
}

interface StatItem {
  key: string;
  label: string;
  description: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  iconBackground: string;
  accentClassName: string;
}

const STATUS_META: Record<
  TripStatus,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    iconClassName: string;
    iconBackground: string;
    accentClassName: string;
  }
> = {
  upcoming: {
    label: "Upcoming",
    description: "Trips scheduled ahead",
    icon: CalendarClock,
    iconClassName: "text-blue-700 dark:text-blue-300",
    iconBackground: "bg-blue-50 dark:bg-blue-950/60",
    accentClassName: "bg-blue-500",
  },
  "in-progress": {
    label: "In progress",
    description: "Trips currently underway",
    icon: PlaneTakeoff,
    iconClassName: "text-emerald-700 dark:text-emerald-300",
    iconBackground: "bg-emerald-50 dark:bg-emerald-950/50",
    accentClassName: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    description: "Trips that have finished",
    icon: CheckCircle2,
    iconClassName: "text-violet-700 dark:text-violet-300",
    iconBackground: "bg-violet-50 dark:bg-violet-950/50",
    accentClassName: "bg-violet-500",
  },
  cancelled: {
    label: "Cancelled",
    description: "Trips that were cancelled",
    icon: CircleX,
    iconClassName: "text-red-700 dark:text-red-300",
    iconBackground: "bg-red-50 dark:bg-red-950/50",
    accentClassName: "bg-red-500",
  },
};

function CountSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mt-5 h-9 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"
    />
  );
}

export default function TripStats({
  trips,
  isLoading = false,
  className = "",
}: TripStatsProps) {
  const totalTrips = trips.length;

  const statusCounts: Record<TripStatus, number> = {
    upcoming: 0,
    "in-progress": 0,
    completed: 0,
    cancelled: 0,
  };

  for (const trip of trips) {
    statusCounts[trip.status] += 1;
  }

  const stats: StatItem[] = [
    {
      key: "total",
      label: "Total trips",
      description: "All recorded trips",
      value: totalTrips,
      icon: Plane,
      iconClassName: "text-slate-800 dark:text-slate-200",
      iconBackground: "bg-slate-100 dark:bg-slate-800",
      accentClassName: "bg-slate-500",
    },
    ...(
      Object.keys(STATUS_META) as TripStatus[]
    ).map((status): StatItem => ({
      key: status,
      label: STATUS_META[status].label,
      description: STATUS_META[status].description,
      value: statusCounts[status],
      icon: STATUS_META[status].icon,
      iconClassName: STATUS_META[status].iconClassName,
      iconBackground: STATUS_META[status].iconBackground,
      accentClassName: STATUS_META[status].accentClassName,
    })),
  ];

  return (
    <section
      aria-label="Trip statistics"
      aria-busy={isLoading}
      className={className}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
            Trip overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A quick summary of trip activity and status.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          {isLoading ? "Updating figures" : "Live from current data"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.article
              key={stat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.045,
              }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${stat.accentClassName}`}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </p>

                  {isLoading ? (
                    <CountSkeleton />
                  ) : (
                    <p
                      className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white"
                      aria-label={`${stat.value} ${stat.label.toLowerCase()}`}
                    >
                      {new Intl.NumberFormat("en").format(stat.value)}
                    </p>
                  )}
                </div>

                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${stat.iconBackground} ${stat.iconClassName}`}
                >
                  <Icon size={21} aria-hidden="true" />
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {stat.description}
              </p>

              <div
                className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                aria-hidden="true"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      totalTrips > 0
                        ? `${Math.min(100, (stat.value / totalTrips) * 100)}%`
                        : "0%",
                  }}
                  transition={{ duration: 0.5, delay: index * 0.045 }}
                  className={`h-full rounded-full ${stat.accentClassName}`}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
