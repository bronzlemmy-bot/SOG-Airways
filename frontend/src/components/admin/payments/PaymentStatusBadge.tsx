"use client";

import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RotateCcw,
  XCircle,
  Ban,
  CircleDollarSign,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { PaymentStatus } from "./admin-payments-data/PaymentsData";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<
  PaymentStatus,
  {
    label: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  successful: {
    label: "Successful",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },

  processing: {
    label: "Processing",
    icon: LoaderCircle,
    className:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },

  failed: {
    label: "Failed",
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  },

  refunded: {
    label: "Refunded",
    icon: RotateCcw,
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  "partially-refunded": {
    label: "Partially Refunded",
    icon: CircleDollarSign,
    className:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },

  cancelled: {
    label: "Cancelled",
    icon: Ban,
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
};

export default function PaymentStatusBadge({
  status,
  className = "",
}: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      <Icon
        className={`h-3.5 w-3.5 shrink-0 ${
          status === "processing" ? "animate-spin" : ""
        }`}
      />
      <span>{config.label}</span>
    </span>
  );
}