"use client";

import { motion } from "framer-motion";
import {
  CircleCheck,
  CircleOff,
  ShieldAlert,
} from "lucide-react";

import {
  StaffStatus,
  getStaffStatusLabel,
} from "./admin-staff-data/StaffData";

interface StaffStatusBadgeProps {
  status: StaffStatus;
  showIcon?: boolean;
  size?: "sm" | "md";
}

const statusConfig: Record<
  StaffStatus,
  {
    icon: typeof CircleCheck;
    className: string;
    dotClassName: string;
  }
> = {
  active: {
    icon: CircleCheck,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400",
    dotClassName: "bg-emerald-500",
  },
  inactive: {
    icon: CircleOff,
    className:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
    dotClassName: "bg-slate-400",
  },
  suspended: {
    icon: ShieldAlert,
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400",
    dotClassName: "bg-rose-500",
  },
};

export default function StaffStatusBadge({
  status,
  showIcon = true,
  size = "sm",
}: StaffStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses =
    size === "md"
      ? "px-3 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold ${sizeClasses} ${config.className}`}
    >
      {showIcon ? (
        <Icon className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dotClassName}`}
        />
      )}

      <span>{getStaffStatusLabel(status)}</span>
    </motion.span>
  );
}