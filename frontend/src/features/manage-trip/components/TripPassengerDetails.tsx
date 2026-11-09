"use client";

import { motion } from "framer-motion";
import {
  Armchair,
  ChevronDown,
  ChevronUp,
  IdCard,
  Users,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import Badge from "@/components/ui/Badge";
import type { BookingPassenger } from "@/types/booking";

interface TripPassengerDetailsProps {
  passengers: BookingPassenger[];
  title?: string;
  description?: string;
  initiallyExpanded?: boolean;
  className?: string;
}

const passengerTypeConfig: Record<
  BookingPassenger["passengerType"],
  {
    label: string;
    variant: "default" | "success" | "warning" | "danger" | "info";
  }
> = {
  adult: {
    label: "Adult",
    variant: "info",
  },
  child: {
    label: "Child",
    variant: "success",
  },
  infant: {
    label: "Infant",
    variant: "warning",
  },
};

function getPassengerName(passenger: BookingPassenger): string {
  const name = `${passenger.firstName ?? ""} ${
    passenger.lastName ?? ""
  }`.trim();

  return name || "Passenger name unavailable";
}

export default function TripPassengerDetails({
  passengers,
  title = "Passenger details",
  description = "Review the passengers associated with this booking.",
  initiallyExpanded = true,
  className = "",
}: TripPassengerDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Users className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              {passengers.length}{" "}
              {passengers.length === 1 ? "passenger" : "passengers"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? "Collapse passenger details" : "Expand passenger details"
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-6"
        >
          {passengers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
              <Users className="h-9 w-9 text-slate-400" />
              <h3 className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                No passenger information
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Passenger details are not available for this booking yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {passengers.map((passenger, index) => {
                const typeConfig =
                  passengerTypeConfig[passenger.passengerType];

                return (
                  <motion.article
                    key={passenger.passengerId || `${getPassengerName(passenger)}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index * 0.05, 0.3),
                    }}
                    className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-sky-200 dark:border-slate-800 dark:hover:border-sky-900 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="wrap-break-wordbreak-words font-semibold text-slate-900 dark:text-white">
                            {getPassengerName(passenger)}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant={typeConfig.variant}>
                              {typeConfig.label}
                            </Badge>

                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Passenger {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:min-w-52">
                        <div className="flex items-start gap-2">
                          <Armchair className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Seat number
                            </p>
                            <p className="mt-0.5 wrap-break-words text-sm font-medium text-slate-800 dark:text-slate-200">
                              {passenger.seatNumber || "Not assigned"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Ticket number
                            </p>
                            <p className="mt-0.5 break-all text-sm font-medium text-slate-800 dark:text-slate-200">
                              {passenger.ticketNumber || "Not issued"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}
