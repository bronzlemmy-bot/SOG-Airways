"use client";

import { motion } from "framer-motion";
import { CalendarDays, Plane, Ticket, Users } from "lucide-react";

export interface TripLoadingStateProps {
  message?: string;
  showSkeleton?: boolean;
  className?: string;
}

export default function TripLoadingState({
  message = "Retrieving your trip details...",
  showSkeleton = true,
  className = "",
}: TripLoadingStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`w-full space-y-6 ${className}`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-sky-900 px-5 py-10 text-center text-white shadow-xl sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, -2, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-20 sm:w-20"
          >
            <Plane className="h-8 w-8 text-sky-200 sm:h-10 sm:w-10" />
          </motion.div>

          <h1 className="mt-6 text-xl font-bold sm:text-2xl">
            Manage your trip
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-blue-100 sm:text-base">
            {message}
          </p>

          <div className="mt-6 flex items-center gap-2">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{
                  opacity: [0.35, 1, 0.35],
                  scale: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: dot * 0.18,
                  ease: "easeInOut",
                }}
                className="h-2 w-2 rounded-full bg-sky-300"
              />
            ))}
          </div>
        </div>
      </div>

      {showSkeleton && (
        <div className="space-y-5" aria-hidden="true">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
              </div>

              <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="my-6 h-px bg-slate-100 dark:bg-slate-800" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-center">
              <div className="space-y-3">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-9 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-36 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="hidden justify-center sm:flex">
                <div className="h-px w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="space-y-3 sm:text-right">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-9 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800 sm:ml-auto" />
                <div className="h-3 w-36 animate-pulse rounded bg-slate-100 dark:bg-slate-800 sm:ml-auto" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Booking", icon: Ticket },
              { label: "Schedule", icon: CalendarDays },
              { label: "Passengers", icon: Users },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <span className="sr-only">{message}</span>
    </section>
  );
}