
"use client";

import { motion } from "framer-motion";
import {
  Ban,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Trip } from "@/types";

interface TripActionsProps {
  trip: Trip;
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  disabled?: boolean;
  className?: string;
}

export default function TripActions({
  trip,
  onView,
  onEdit,
  onCancel,
  onDelete,
  disabled = false,
  className = "",
}: TripActionsProps) {
  const cannotCancel =
    disabled ||
    trip.status === "cancelled" ||
    trip.status === "completed";

  const buttonBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className={`flex items-center justify-end gap-2 ${className}`}
      aria-label={`Actions for trip ${trip.bookingReference}`}
    >
      <motion.button
        type="button"
        whileHover={disabled ? undefined : { scale: 1.05 }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        onClick={() => onView(trip)}
        disabled={disabled}
        title="View trip details"
        aria-label={`View trip ${trip.bookingReference}`}
        className={`${buttonBase} border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60`}
      >
        <Eye size={16} aria-hidden="true" />
      </motion.button>

      <motion.button
        type="button"
        whileHover={disabled ? undefined : { scale: 1.05 }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        onClick={() => onEdit(trip)}
        disabled={disabled}
        title="Edit trip"
        aria-label={`Edit trip ${trip.bookingReference}`}
        className={`${buttonBase} border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800`}
      >
        <Pencil size={16} aria-hidden="true" />
      </motion.button>

      <motion.button
        type="button"
        whileHover={cannotCancel ? undefined : { scale: 1.05 }}
        whileTap={cannotCancel ? undefined : { scale: 0.95 }}
        onClick={() => onCancel(trip)}
        disabled={cannotCancel}
        title={
          cannotCancel
            ? "This trip cannot be cancelled"
            : "Cancel trip"
        }
        aria-label={`Cancel trip ${trip.bookingReference}`}
        className={`${buttonBase} border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50`}
      >
        <Ban size={16} aria-hidden="true" />
      </motion.button>

      <motion.button
        type="button"
        whileHover={disabled ? undefined : { scale: 1.05 }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        onClick={() => onDelete(trip)}
        disabled={disabled}
        title="Delete trip"
        aria-label={`Delete trip ${trip.bookingReference}`}
        className={`${buttonBase} border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50`}
      >
        <Trash2 size={16} aria-hidden="true" />
      </motion.button>
    </div>
  );
}
