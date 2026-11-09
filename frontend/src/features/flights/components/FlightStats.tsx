"use client";

import { motion } from "framer-motion";
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Clock3,
  CircleAlert,
  Ban,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

import type { Flight, FlightStatus } from "@/types/flight";

interface FlightStatsProps {
  flights: Flight[];
  loading?: boolean;
  className?: string;
}

interface StatItem {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
  cardClassName: string;
}

function getFlightStats(flights: Flight[]) {
  const today = new Date().toISOString().slice(0, 10);

  const todayFlights = flights.filter(
    (flight) => flight.schedule.departureDate.slice(0, 10) === today,
  );

  const countStatus = (status: FlightStatus) =>
    flights.filter((flight) => flight.status === status).length;

  const delayedFlights = countStatus("delayed");
  const cancelledFlights = countStatus("cancelled");
  const boardingFlights = countStatus("boarding");
  const activeFlights =
    boardingFlights + countStatus("departed") + countStatus("in-air");

  return {
    total: flights.length,
    today: todayFlights.length,
    active: activeFlights,
    delayed: delayedFlights,
    cancelled: cancelledFlights,
    landed: countStatus("landed"),
    scheduled: countStatus("scheduled"),
  };
}

function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mb-3 h-8 w-16 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default function FlightStats({
  flights,
  loading = false,
  className = "",
}: FlightStatsProps) {
  const stats = getFlightStats(flights);

  const items: StatItem[] = [
    {
      label: "Total Flights",
      value: stats.total,
      description: "All flights in your schedule",
      icon: <Plane className="h-5 w-5" />,
      iconClassName: "text-blue-600 dark:text-blue-400",
      cardClassName: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Today's Flights",
      value: stats.today,
      description: "Departures scheduled today",
      icon: <CalendarCheck className="h-5 w-5" />,
      iconClassName: "text-violet-600 dark:text-violet-400",
      cardClassName: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Active Flights",
      value: stats.active,
      description: "Boarding, departed or airborne",
      icon: <PlaneTakeoff className="h-5 w-5" />,
      iconClassName: "text-emerald-600 dark:text-emerald-400",
      cardClassName: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Delayed Flights",
      value: stats.delayed,
      description: "Flights requiring attention",
      icon: <Clock3 className="h-5 w-5" />,
      iconClassName: "text-amber-600 dark:text-amber-400",
      cardClassName: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      description: "Flights currently cancelled",
      icon: <Ban className="h-5 w-5" />,
      iconClassName: "text-rose-600 dark:text-rose-400",
      cardClassName: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      label: "Landed Flights",
      value: stats.landed,
      description: "Flights that have arrived",
      icon: <PlaneLanding className="h-5 w-5" />,
      iconClassName: "text-cyan-600 dark:text-cyan-400",
      cardClassName: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      description: "Awaiting departure",
      icon: <TrendingUp className="h-5 w-5" />,
      iconClassName: "text-indigo-600 dark:text-indigo-400",
      cardClassName: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      label: "Flight Alerts",
      value: stats.delayed + stats.cancelled,
      description: "Delayed and cancelled flights",
      icon: <CircleAlert className="h-5 w-5" />,
      iconClassName: "text-orange-600 dark:text-orange-400",
      cardClassName: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  return (
    <section
      aria-label="Flight statistics"
      className={className}
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Flight Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A real-time style summary of your flight operations.
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Statistics update when flight data changes
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }, (_, index) => (
              <StatSkeleton key={index} />
            ))
          : items.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {item.value.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.cardClassName} ${item.iconClassName}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.article>
            ))}
      </div>
    </section>
  );
}
