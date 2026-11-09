"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Plane,
  Search,
  Ticket,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

export type TripEmptyStateType =
  | "no-trips"
  | "no-results"
  | "no-upcoming-trips"
  | "no-booking";

export interface TripEmptyStateProps {
  type?: TripEmptyStateType;
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
}

interface EmptyStateConfig {
  title: string;
  description: string;
  icon: typeof Plane;
}

const EMPTY_STATE_CONFIG: Record<
  TripEmptyStateType,
  EmptyStateConfig
> = {
  "no-trips": {
    title: "Your journey starts here",
    description:
      "You don't have any trips to manage yet. Book your next flight with SOG Airways and your journey details will appear here.",
    icon: Plane,
  },
  "no-results": {
    title: "No matching trips",
    description:
      "We couldn't find any trips matching your current search or filters. Try adjusting your search criteria.",
    icon: Search,
  },
  "no-upcoming-trips": {
    title: "No upcoming trips",
    description:
      "You don't have any upcoming journeys at the moment. Your next adventure could be just a booking away.",
    icon: CalendarDays,
  },
  "no-booking": {
    title: "Booking not found",
    description:
      "We couldn't find a booking matching the details provided. Check your booking reference and passenger surname, then try again.",
    icon: Ticket,
  },
};

export default function TripEmptyState({
  type = "no-trips",
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  className = "",
}: TripEmptyStateProps) {
  const config = EMPTY_STATE_CONFIG[type];
  const Icon = config.icon;

  const defaultPrimaryLabel =
    type === "no-results"
      ? "Clear filters"
      : type === "no-booking"
        ? "Try again"
        : "Book a flight";

  const resolvedPrimaryLabel =
    primaryActionLabel ?? defaultPrimaryLabel;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-950 sm:px-10 sm:py-14 ${className}`}
    >
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        <div className="absolute inset-0 rounded-3xl bg-sky-200/30 blur-xl dark:bg-sky-800/20" />
        <Icon className="relative h-9 w-9" aria-hidden="true" />
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
        SOG Airways
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        {title ?? config.title}
      </h2>

      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
        {description ?? config.description}
      </p>

      {(onPrimaryAction || onSecondaryAction) && (
        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          {onSecondaryAction && secondaryActionLabel && (
            <OutlineButton
              type="button"
              onClick={onSecondaryAction}
              fullWidth
            >
              {secondaryActionLabel}
            </OutlineButton>
          )}

          {onPrimaryAction && (
            <PrimaryButton
              type="button"
              onClick={onPrimaryAction}
              fullWidth
            >
              {resolvedPrimaryLabel}
            </PrimaryButton>
          )}
        </div>
      )}
    </motion.section>
  );
}
