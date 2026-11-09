
"use client";

import {
  CalendarClock,
  CheckCircle2,
  CircleX,
  PlaneTakeoff,
  type LucideIcon,
} from "lucide-react";

import { TRIP_STATUSES } from "@/constants/trip";
import type { TripStatus } from "@/types";

interface TripStatusBadgeProps {
  status: TripStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

interface StatusPresentation {
  label: string;
  icon: LucideIcon;
  className: string;
  dotClassName: string;
}

const STATUS_PRESENTATION: Record<
  TripStatus,
  StatusPresentation
> = {
  upcoming: {
    label: "Upcoming",
    icon: CalendarClock,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    dotClassName: "bg-blue-500",
  },
  "in-progress": {
    label: "In Progress",
    icon: PlaneTakeoff,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    dotClassName: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
    dotClassName: "bg-violet-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: CircleX,
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
    dotClassName: "bg-red-500",
  },
};

const VALID_STATUSES: readonly string[] = TRIP_STATUSES;

export default function TripStatusBadge({
  status,
  size = "md",
  showIcon = false,
  className = "",
}: TripStatusBadgeProps) {
  const isValidStatus = VALID_STATUSES.includes(status);

  if (!isValidStatus) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${className}`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-slate-400"
          aria-hidden="true"
        />
        Unknown status
      </span>
    );
  }

  const presentation = STATUS_PRESENTATION[status];
  const Icon = presentation.icon;

  const sizeStyles =
    size === "sm"
      ? "gap-1.5 px-2 py-1 text-[11px]"
      : "gap-2 px-3 py-1.5 text-xs";

  return (
    <span
      role="status"
      aria-label={`Trip status: ${presentation.label}`}
      className={`inline-flex w-fit shrink-0 items-center rounded-full border font-semibold ${sizeStyles} ${presentation.className} ${className}`}
    >
      {showIcon ? (
        <Icon
          size={size === "sm" ? 12 : 14}
          aria-hidden="true"
        />
      ) : (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${presentation.dotClassName}`}
          aria-hidden="true"
        />
      )}

      {presentation.label}
    </span>
  );
}
