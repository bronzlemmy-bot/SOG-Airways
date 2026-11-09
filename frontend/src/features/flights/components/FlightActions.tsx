"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  PlaneTakeoff,
  Clock3,
  CircleCheck,
  CircleX,
} from "lucide-react";
import type { Flight, FlightStatus } from "@/types/flight";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

interface FlightActionsProps {
  flight: Flight;
  onView: (flight: Flight) => void;
  onEdit: (flight: Flight) => void;
  onDelete: (flight: Flight) => void;
  onStatusChange?: (flight: Flight, status: FlightStatus) => void;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

const STATUS_ACTIONS: {
  label: string;
  status: FlightStatus;
  icon: typeof PlaneTakeoff;
}[] = [
  { label: "Start boarding", status: "boarding", icon: PlaneTakeoff },
  { label: "Mark delayed", status: "delayed", icon: Clock3 },
  { label: "Mark landed", status: "landed", icon: CircleCheck },
  { label: "Cancel flight", status: "cancelled", icon: CircleX },
];

export default function FlightActions({
  flight,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
  compact = false,
  className = "",
}: FlightActionsProps) {
  const availableStatusActions = STATUS_ACTIONS.filter(
    (action) => action.status !== flight.status,
  );

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <OutlineButton
        type="button"
        onClick={() => onView(flight)}
        disabled={loading}
        className="justify-center"
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
        {!compact && <span className="ml-2">View</span>}
      </OutlineButton>

      <OutlineButton
        type="button"
        onClick={() => onEdit(flight)}
        disabled={loading || flight.status === "departed" || flight.status === "in-air" || flight.status === "landed"}
        className="justify-center"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
        {!compact && <span className="ml-2">Edit</span>}
      </OutlineButton>

      {onStatusChange && (
        <div className="relative">
          <details className="group">
            <summary
              aria-label={`More actions for flight ${flight.flightNumber}`}
              className={`flex cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </summary>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              {availableStatusActions.map((action) => {
                const Icon = action.icon;
                const isDestructive = action.status === "cancelled";

                return (
                  <button
                    key={action.status}
                    type="button"
                    disabled={loading}
                    onClick={(event) => {
                      const details = event.currentTarget.closest("details");
                      if (details) details.open = false;
                      onStatusChange(flight, action.status);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isDestructive
                        ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {action.label}
                  </button>
                );
              })}
            </motion.div>
          </details>
        </div>
      )}

      <PrimaryButton
        type="button"
        onClick={() => onDelete(flight)}
        disabled={loading || flight.status === "departed" || flight.status === "in-air"}
        className="justify-center !bg-red-600! hover:!bg-red-700! focus:!ring-red-500!"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {!compact && <span className="ml-2">Delete</span>}
      </PrimaryButton>
    </div>
  );
}