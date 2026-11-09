"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Eye,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type { AdminPassenger } from "./admin-passengers-data/AdminPassengersData";
import PassengerActions from "./PassengerActions";
import PassengerStatusBadge from "./PassengerStatusBadge";

interface PassengerTableProps {
  passengers: AdminPassenger[];
  onView: (passenger: AdminPassenger) => void;
  onEdit: (passenger: AdminPassenger) => void;
  onStatusChange: (
    passenger: AdminPassenger,
    status: AdminPassenger["status"],
  ) => void;
  onDelete: (passenger: AdminPassenger) => void;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(passenger: AdminPassenger) {
  return `${passenger.firstName.charAt(0)}${passenger.lastName.charAt(0)}`.toUpperCase();
}

export default function PassengerTable({
  passengers,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: PassengerTableProps) {
  if (passengers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Eye className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No passengers found
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Try adjusting your search or filters to find the passenger you are
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Passenger
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Contact
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Nationality
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Bookings
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Last Trip
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {passengers.map((passenger, index) => (
              <motion.tr
                key={passenger.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.035,
                }}
                className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(passenger)}
                    className="flex items-center gap-3 text-left"
                    aria-label={`View ${passenger.firstName} ${passenger.lastName}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sm font-bold text-sky-600 dark:text-sky-400">
                      {getInitials(passenger)}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
                        {passenger.firstName} {passenger.lastName}
                      </span>

                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                        {passenger.passengerId}
                      </span>
                    </span>
                  </button>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="max-w-[220px] truncate">
                        {passenger.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{passenger.phone}</span>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    {passenger.nationality}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {passenger.totalBookings}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {passenger.totalTrips}{" "}
                      {passenger.totalTrips === 1 ? "trip" : "trips"}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {passenger.lastTrip ? (
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                      {formatDate(passenger.lastTrip)}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 dark:text-slate-500">
                      No trip yet
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <PassengerStatusBadge status={passenger.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end">
                    <PassengerActions
                      passenger={passenger}
                      onView={onView}
                      onEdit={onEdit}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/30">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {passengers.length}
          </span>{" "}
          {passengers.length === 1 ? "passenger" : "passengers"}
        </p>

        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <Eye className="h-3.5 w-3.5" />
          Click a passenger to view details
        </div>
      </div>
    </div>
  );
}