"use client";

import { CheckCircle2, Clock3, XCircle, AlertCircle } from "lucide-react";

interface BookingStatusBadgeProps {
  status?: string | null;
  className?: string;
}

const STATUS_STYLES: Record<
  string,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  confirmed: {
    label: "Confirmed",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  paid: {
    label: "Paid",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    icon: CheckCircle2,
  },
  "checked-in": {
    label: "Checked in",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    icon: CheckCircle2,
  },
  checked_in: {
    label: "Checked in",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
    icon: Clock3,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
    icon: XCircle,
  },
  canceled: {
    label: "Canceled",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
    icon: XCircle,
  },
  failed: {
    label: "Failed",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
    icon: AlertCircle,
  },
  refunded: {
    label: "Refunded",
    className:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    icon: CheckCircle2,
  },
};

export default function BookingStatusBadge({
  status,
  className = "",
}: BookingStatusBadgeProps) {
  const normalizedStatus = (status || "pending")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const config = STATUS_STYLES[normalizedStatus] ?? {
    label: normalizedStatus.replace(/[-_]/g, " "),
    className:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    icon: AlertCircle,
  };

  const StatusIcon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${config.className} ${className}`}
      role="status"
    >
      <StatusIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {config.label}
    </span>
  );
}
