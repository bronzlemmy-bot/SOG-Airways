"use client";

import {
  CheckCircle2,
  Clock3,
  UserRoundX,
  ShieldAlert,
} from "lucide-react";

import type { PassengerStatus } from "./admin-passengers-data/AdminPassengersData";

interface PassengerStatusBadgeProps {
  status: PassengerStatus;
  className?: string;
}

const statusConfig: Record<
  PassengerStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  inactive: {
    label: "Inactive",
    icon: UserRoundX,
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },

  suspended: {
    label: "Suspended",
    icon: ShieldAlert,
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export default function PassengerStatusBadge({
  status,
  className = "",
}: PassengerStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}