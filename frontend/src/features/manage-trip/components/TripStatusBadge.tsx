"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  CircleX,
  Plane,
  
  type LucideIcon,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { TripStatus } from "@/types";

interface TripStatusBadgeProps {
  status: TripStatus;
  showIcon?: boolean;
  showLabel?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface StatusConfig {
  label: string;
  variant: "default" | "success" | "warning" | "danger" | "info";
  icon: LucideIcon;
}

const STATUS_CONFIG: Record<TripStatus, StatusConfig> = {
  upcoming: {
    label: "Upcoming",
    variant: "info",
    icon: CalendarClock,
  },
  "in-progress": {
    label: "In Progress",
    variant: "success",
    icon: Plane,
  },
  completed: {
    label: "Completed",
    variant: "default",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    variant: "danger",
    icon: CircleX,
  },
};

const SIZE_CLASSES: Record<NonNullable<TripStatusBadgeProps["size"]>, string> = {
  sm: "text-[10px] [&_svg]:h-3 [&_svg]:w-3",
  md: "text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
  lg: "text-sm [&_svg]:h-4 [&_svg]:w-4",
};

export default function TripStatusBadge({
  status,
  showIcon = true,
  showLabel = true,
  animated = false,
  size = "md",
  className = "",
}: TripStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  const badge = (
    <Badge variant={config.variant}>
      <span
        className={`inline-flex items-center gap-1.5 ${SIZE_CLASSES[size]} ${className}`}
      >
        {showIcon && <StatusIcon aria-hidden="true" />}
        {showLabel && <span>{config.label}</span>}
        {!showIcon && !showLabel && (
          <span className="sr-only">{config.label}</span>
        )}
      </span>
    </Badge>
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
