"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  Plane,
  Ticket,
  UserRound,
} from "lucide-react";

import type { Booking } from "@/types/booking";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingSummaryProps {
  booking: Booking;
  className?: string;
}

type BookingSummaryData = Omit<
  Booking,
  "bookingReference" | "status"
> & {
  bookingReference?: string;
  reference?: string;
  status?: string;
  bookingStatus?: string;
  passengerName?: string;
  passenger?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  passengers?: Array<{
    firstName?: string;
    lastName?: string;
    name?: string;
  }>;
  flightNumber?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  origin?: string;
  destination?: string;
  departureAirport?: string | { code?: string; name?: string };
  arrivalAirport?: string | { code?: string; name?: string };
  totalAmount?: number | string;
  amount?: number | string;
  currency?: string;
  paymentStatus?: string;
  cabinClass?: string;
  travelClass?: string;
  createdAt?: string;
  bookingDate?: string;
};

function getAirportLabel(
  airport?: string | { code?: string; name?: string },
  fallback?: string,
): string {
  if (typeof airport === "string") return airport;
  if (airport?.code && airport?.name) {
    return `${airport.code} — ${airport.name}`;
  }
  return airport?.code || airport?.name || fallback || "Not available";
}

function getPassengerName(booking: BookingSummaryData): string {
  const passenger = booking.passengers?.[0] ?? booking.passenger;

  const fullName = [
    passenger?.firstName,
    passenger?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    booking.passengerName?.trim() ||
    passenger?.name?.trim() ||
    fullName ||
    "Passenger details unavailable"
  );
}

function formatDate(value?: string): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(
  amount?: number | string,
  currency?: string,
): string {
  if (amount === undefined || amount === null || amount === "") {
    return "Not available";
  }

  const numericAmount =
    typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency ? `${currency} ` : ""}${amount}`;
  }

  if (currency) {
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(numericAmount);
    } catch {
      return `${currency} ${numericAmount.toLocaleString("en")}`;
    }
  }

  return numericAmount.toLocaleString("en");
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function BookingSummary({
  booking,
  className = "",
}: BookingSummaryProps) {
  const data = booking as BookingSummaryData;

  const reference =
    data.bookingReference || data.reference || "Not available";

  const status = data.status || data.bookingStatus || "pending";

  const departure = getAirportLabel(
    data.departureAirport,
    data.origin,
  );

  const arrival = getAirportLabel(
    data.arrivalAirport,
    data.destination,
  );

  const totalAmount = formatAmount(
    data.totalAmount ?? data.amount,
    data.currency,
  );

  const travelDate = formatDate(
    data.departureDate || data.bookingDate || data.createdAt,
  );

  const passengerName = getPassengerName(data);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-label="Booking summary"
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="bg-linear-to-r from-sky-950 via-blue-900 to-indigo-900 px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Ticket className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="text-sm text-blue-100">
                Booking reference
              </p>
              <h2 className="mt-1 break-all text-xl font-bold tracking-wide sm:text-2xl">
                {reference}
              </h2>
              <p className="mt-2 text-sm text-blue-100">
                Keep this reference handy when contacting SOG Airways.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <BookingStatusBadge status={status} />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SummaryItem
            icon={<UserRound className="h-4 w-4" />}
            label="Passenger"
            value={passengerName}
          />

          <SummaryItem
            icon={<Plane className="h-4 w-4" />}
            label="Flight number"
            value={data.flightNumber || "Not available"}
          />

          <SummaryItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Travel date"
            value={travelDate}
          />

          <SummaryItem
            icon={<Clock3 className="h-4 w-4" />}
            label="Departure time"
            value={data.departureTime || "Not available"}
          />

          <SummaryItem
            icon={<MapPin className="h-4 w-4" />}
            label="From"
            value={departure}
          />

          <SummaryItem
            icon={<MapPin className="h-4 w-4" />}
            label="To"
            value={arrival}
          />
        </div>

        <div className="border-t border-dashed border-slate-200 pt-5 dark:border-slate-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total booking amount
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {totalAmount}
              </p>
              {data.cabinClass || data.travelClass ? (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Cabin: {data.cabinClass || data.travelClass}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:self-center">
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>
                Payment: {data.paymentStatus || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
