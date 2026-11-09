"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Armchair,
  Luggage,
  Pencil,
  Plane,
  TicketX,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

export type TripActionType =
  | "change-flight"
  | "change-passenger"
  | "change-seat"
  | "manage-baggage"
  | "cancel-trip"
  | "view-ticket";

export interface TripActionProps {
  action: TripActionType;
  title?: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
  onClick: () => void;
}

interface ActionConfig {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ACTION_CONFIG: Record<TripActionType, ActionConfig> = {
  "change-flight": {
    title: "Change flight",
    description: "Explore alternative flights for your journey.",
    icon: ArrowLeftRight,
  },
  "change-passenger": {
    title: "Passenger details",
    description: "Review or request a passenger information correction.",
    icon: Pencil,
  },
  "change-seat": {
    title: "Change seat",
    description: "Choose an available seat for your flight.",
    icon: Armchair,
  },
  "manage-baggage": {
    title: "Manage baggage",
    description: "Review your allowance and request extra baggage.",
    icon: Luggage,
  },
  "cancel-trip": {
    title: "Cancel trip",
    description: "Review cancellation options for your booking.",
    icon: TicketX,
  },
  "view-ticket": {
    title: "View ticket",
    description: "Open your ticket or booking confirmation.",
    icon: Plane,
  },
};

export default function TripAction({
  action,
  title,
  description,
  disabled = false,
  loading = false,
  variant = "outline",
  onClick,
}: TripActionProps) {
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;
  const actionTitle = title ?? config.title;
  const actionDescription = description ?? config.description;

  return (
    <motion.div
      whileHover={disabled || loading ? undefined : { y: -3 }}
      whileTap={disabled || loading ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className={`group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950 sm:p-5 ${
        disabled ? "opacity-60" : "hover:border-sky-300 dark:hover:border-sky-800"
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition-colors group-hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:group-hover:bg-sky-900">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
            {actionTitle}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {actionDescription}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2">
        {variant === "primary" ? (
          <PrimaryButton
            type="button"
            fullWidth
            disabled={disabled || loading}
            loading={loading}
            onClick={onClick}
          >
            {actionTitle}
          </PrimaryButton>
        ) : (
          <OutlineButton
            type="button"
            fullWidth
            disabled={disabled || loading}
            loading={loading}
            onClick={onClick}
          >
            {actionTitle}
          </OutlineButton>
        )}
      </div>
    </motion.div>
  );
}
