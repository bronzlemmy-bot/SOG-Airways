"use client";

import { motion } from "framer-motion";
import { Mail, Phone, UserRound, Users } from "lucide-react";
import type { Booking } from "@/types/booking";

interface BookingPassengerDetailsProps {
  booking: Booking;
  className?: string;
}

interface PassengerDisplay {
  name: string;
  email: string;
  phone: string;
  type: string;
}

function getPassengerDetails(booking: Booking): PassengerDisplay[] {
  type PassengerSource = {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phone?: string;
    type?: string;
    passengerType?: string;
  };

  type BookingSource = Omit<Booking, "passengers"> & {
    passengerName?: string;
    passengerEmail?: string;
    passengerPhone?: string;
    passenger?: PassengerSource;
    passengers?: PassengerSource[];
  };

  const data = booking as BookingSource;

  if (data.passengers?.length) {
    return data.passengers.map((passenger, index) => {
      const fullName = [
        passenger.firstName,
        passenger.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      return {
        name:
          passenger.name?.trim() ||
          fullName ||
          `Passenger ${index + 1}`,
        email: passenger.email || "Not provided",
        phone: passenger.phone || "Not provided",
        type: passenger.type || passenger.passengerType || "Passenger",
      };
    });
  }

  const passenger = data.passenger;

  const fullName = [
    passenger?.firstName,
    passenger?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return [
    {
      name:
        data.passengerName?.trim() ||
        passenger?.name?.trim() ||
        fullName ||
        "Passenger details unavailable",
      email: data.passengerEmail || passenger?.email || "Not provided",
      phone: data.passengerPhone || passenger?.phone || "Not provided",
      type: "Primary passenger",
    },
  ];
}
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function BookingPassengerDetails({
  booking,
  className = "",
}: BookingPassengerDetailsProps) {
  const passengers = getPassengerDetails(booking);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-labelledby="booking-passenger-details-title"
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Users className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h2
            id="booking-passenger-details-title"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Passenger details
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Passenger information associated with this booking.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {passengers.map((passenger, index) => (
          <div
            key={`${passenger.name}-${index}`}
            className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <UserRound
                  className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h3 className="wrap-break-word text-sm font-bold text-slate-900 dark:text-white">
                  {passenger.name}
                </h3>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {passenger.type}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                label="Email address"
                value={passenger.email}
              />

              <DetailItem
                icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                label="Phone number"
                value={passenger.phone}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}