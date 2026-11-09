"use client";

import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { motion } from "framer-motion";
import {
  Plane,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";



type EmptyStateType = "empty" | "filtered" | "error";

interface FlightEmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  onAddFlight?: () => void;
  onResetFilters?: () => void;
  onRetry?: () => void;
  className?: string;
}

const stateConfig: Record<
  EmptyStateType,
  {
    icon: LucideIcon;
    title: string;
    description: string;
  }
> = {
  empty: {
    icon: Plane,
    title: "No flights yet",
    description:
      "Your flight schedule is waiting to take off. Add your first flight to start managing routes, schedules, fares, and availability.",
  },
  filtered: {
    icon: Search,
    title: "No flights found",
    description:
      "We couldn't find any flights matching your current search or filters. Try changing your search criteria.",
  },
  error: {
    icon: AlertTriangle,
    title: "Unable to load flights",
    description:
      "Something went wrong while loading flight information. Please try again.",
  },
};

export default function FlightEmptyState({
  type = "empty",
  title,
  description,
  onAddFlight,
  onResetFilters,
  onRetry,
  className = "",
}: FlightEmptyStateProps) {
  const config = stateConfig[type];
  const Icon = config.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:px-8 sm:py-16 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-50/80 via-transparent to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20"
      />

      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.25 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-100 bg-sky-50 text-sky-700 shadow-sm dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300"
        >
          <Icon className="h-9 w-9" aria-hidden="true" />
        </motion.div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-400">
          SOG Airways · Flight Management
        </p>

        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {title ?? config.title}
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
          {description ?? config.description}
        </p>

        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          {type === "empty" && onAddFlight && (
            <PrimaryButton onClick={onAddFlight}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Flight
            </PrimaryButton>
          )}

          {type === "filtered" && onResetFilters && (
            <PrimaryButton onClick={onResetFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Filters
            </PrimaryButton>
          )}

          {type === "error" && onRetry && (
            <PrimaryButton onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </PrimaryButton>
          )}

          {type === "error" && onResetFilters && (
            <OutlineButton onClick={onResetFilters}>
              Reset Search
            </OutlineButton>
          )}
        </div>

        {type === "empty" && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Manage flight schedules
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Set fares and availability
            </span>
          </div>
        )}
      </div>
    </motion.section>
  );
}