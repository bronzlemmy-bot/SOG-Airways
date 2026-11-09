"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Plane,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { Booking } from "@/types/booking";

interface BookingStatusProps {
  booking: Booking;
  className?: string;
}

type StatusConfig = {
  label: string;
  description: string;
  icon: typeof CheckCircle2;
  badgeClass: string;
  iconClass: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  confirmed: {
    label: "Confirmed",
    description: "Your booking is confirmed.",
    icon: CheckCircle2,
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900",
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  paid: {
    label: "Paid",
    description: "Payment has been recorded for this booking.",
    icon: CreditCard,
    badgeClass:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900",
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  pending: {
    label: "Pending",
    description: "Your booking is awaiting confirmation.",
    icon: Clock3,
    badgeClass:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900",
    iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  processing: {
    label: "Processing",
    description: "Your booking is being processed.",
    icon: Clock3,
    badgeClass:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900",
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  "checked-in": {
    label: "Checked in",
    description: "You have checked in for your flight.",
    icon: ShieldCheck,
    badgeClass:
      "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-900",
    iconClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  checked_in: {
    label: "Checked in",
    description: "You have checked in for your flight.",
    icon: ShieldCheck,
    badgeClass:
      "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-900",
    iconClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  completed: {
    label: "Completed",
    description: "This journey has been completed.",
    icon: CheckCircle2,
    badgeClass:
      "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    iconClass: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  },
  cancelled: {
    label: "Cancelled",
    description: "This booking has been cancelled.",
    icon: XCircle,
    badgeClass:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900",
    iconClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  canceled: {
    label: "Cancelled",
    description: "This booking has been cancelled.",
    icon: XCircle,
    badgeClass:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900",
    iconClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  failed: {
    label: "Failed",
    description: "This booking could not be completed successfully.",
    icon: AlertCircle,
    badgeClass:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900",
    iconClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  refunded: {
    label: "Refunded",
    description: "A refund has been recorded for this booking.",
    icon: CreditCard,
    badgeClass:
      "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-900",
    iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  in_flight: {
    label: "In flight",
    description: "The flight is currently in progress.",
    icon: Plane,
    badgeClass:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900",
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
};

const DEFAULT_STATUS: StatusConfig = {
  label: "Status unavailable",
  description: "Please contact SOG Airways if you need help with this booking.",
  icon: AlertCircle,
  badgeClass:
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  iconClass: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

export default function BookingStatus({
  booking,
  className = "",
}: BookingStatusProps) {
  const bookingData = booking as Booking & {
    status?: string;
    bookingStatus?: string;
  };

  const rawStatus = (
    bookingData.status ||
    bookingData.bookingStatus ||
    ""
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const status = STATUS_CONFIG[rawStatus] || {
    ...DEFAULT_STATUS,
    label: rawStatus
      ? rawStatus
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : DEFAULT_STATUS.label,
  };

  const StatusIcon = status.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Booking status"
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${status.iconClass}`}
          >
            <StatusIcon className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Booking status
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">
              {status.description}
            </p>
          </div>
        </div>

        <span
          role="status"
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 ring-inset ${status.badgeClass}`}
        >
          <StatusIcon className="h-4 w-4" aria-hidden="true" />
          {status.label}
        </span>
      </div>
    </motion.section>
  );
}