"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  CircleAlert,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Radio,
  XCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

import type { FlightStatus } from "@/types/flight";

interface FlightStatusBadgeProps {
  status: FlightStatus;
  className?: string;
  animated?: boolean;
}

type FlightStatusIcon = ComponentType<LucideProps>;

interface StatusConfig {
  label: string;
  icon: FlightStatusIcon;
  className: string;
}

const STATUS_CONFIG: Record<FlightStatus, StatusConfig> = {
  scheduled: {
    label: "Scheduled",
    icon: CalendarClock,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  },
  boarding: {
    label: "Boarding",
    icon: PlaneTakeoff,
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  departed: {
    label: "Departed",
    icon: Plane,
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  },
  "in-air": {
    label: "In Air",
    icon: Radio,
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300",
  },
  landed: {
    label: "Landed",
    icon: PlaneLanding,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  delayed: {
    label: "Delayed",
    icon: CircleAlert,
    className:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
  },
  diverted: {
    label: "Diverted",
    icon: CircleAlert,
    className:
      "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
  },
};

export default function FlightStatusBadge({
  status,
  className = "",
  animated = false,
}: FlightStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const badge = (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {config.label}
    </span>
  );

  if (!animated) {
    return badge;
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-flex"
    >
      {badge}
    </motion.span>
  );
}