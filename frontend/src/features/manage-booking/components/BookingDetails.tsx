"use client";

import { motion } from "framer-motion";
import {
  Plane,
  MapPin,
  CalendarDays,
  Clock3,
  UserRound,
  Ticket,
  Luggage,
  CreditCard,
  Hash,
} from "lucide-react";

import type { Booking } from "@/types/booking";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingDetailsProps {
  booking: Booking;
  className?: string;
}

type BookingWithOptionalDetails = Booking & {
  bookingReference?: string;
  reference?: string;
  status?: string;
  paymentStatus?: string;
  passengerName?: string;
  passenger?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  passengers?: Array<{
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  }>;
  flight?: {
    flightNumber?: string;
    departureAirportCode?: string;
    departureAirportName?: string;
    arrivalAirportCode?: string;
    arrivalAirportName?: string;
    departureDate?: string;
    departureTime?: string;
    arrivalDate?: string;
    arrivalTime?: string;
    durationMinutes?: number;
    terminal?: string;
    gate?: string;
  };
  departureAirportCode?: string;
  departureAirportName?: string;
  arrivalAirportCode?: string;
  arrivalAirportName?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  flightNumber?: string;
  totalAmount?: number;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  baggageAllowance?: string;
  cabinClass?: string;
  createdAt?: string;
};

function display(value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "Not provided";
  return String(value);
}

function formatDate(value?: string): string {
  if (!value) return "Not provided";

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value,
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value?: string): string {
  if (!value) return "Not provided";

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return value;

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2020, 0, 1, hours, minutes)));
}

function formatDuration(minutes?: number): string {
  if (minutes === undefined || !Number.isFinite(minutes) || minutes < 0) {
    return "Not provided";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} minutes`;
  if (remainingMinutes === 0) return `${hours} hours`;

  return `${hours}h ${remainingMinutes}m`;
}

function formatMoney(amount?: number, currency = "NGN"): string {
  if (amount === undefined || !Number.isFinite(amount)) {
    return "Not provided";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function BookingDetails({
  booking,
  className = "",
}: BookingDetailsProps) {
  const data = booking as BookingWithOptionalDetails;
  const flight = data.flight;

  const reference =
    data.bookingReference ?? data.reference ?? booking.id;

  const passenger =
    data.passenger?.fullName ??
    [data.passenger?.firstName, data.passenger?.lastName]
      .filter(Boolean)
      .join(" ") ??
    data.passengerName ??
    data.passengers?.[0]?.fullName ??
    [
      data.passengers?.[0]?.firstName,
      data.passengers?.[0]?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ??
    "Passenger";

  const departureCode =
    flight?.departureAirportCode ?? data.departureAirportCode;

  const arrivalCode =
    flight?.arrivalAirportCode ?? data.arrivalAirportCode;

  const departureName =
    flight?.departureAirportName ?? data.departureAirportName;

  const arrivalName =
    flight?.arrivalAirportName ?? data.arrivalAirportName;

  const departureDate = flight?.departureDate ?? data.departureDate;
  const departureTime = flight?.departureTime ?? data.departureTime;
  const arrivalDate = flight?.arrivalDate ?? data.arrivalDate;
  const arrivalTime = flight?.arrivalTime ?? data.arrivalTime;

  const amount = data.totalAmount ?? data.amount;
  const currency = data.currency ?? "NGN";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Booking details"
      className={`space-y-6 ${className}`}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-linear-to-r from-slate-950 via-blue-950 to-blue-800 px-5 py-6 text-white sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-blue-100">Booking reference</p>
              <div className="mt-2 flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-200" />
                <h2 className="text-2xl font-bold tracking-wide">
                  {display(reference)}
                </h2>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                Keep this reference handy when contacting SOG Airways.
              </p>
            </div>

            <div className="self-start">
              <BookingStatusBadge
                status={data.status ?? "confirmed"}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
          <DetailItem
            icon={<UserRound className="h-5 w-5" />}
            label="Passenger"
            value={passenger}
          />
          <DetailItem
            icon={<Ticket className="h-5 w-5" />}
            label="Flight number"
            value={flight?.flightNumber ?? data.flightNumber ?? "Not provided"}
          />
          <DetailItem
            icon={<CalendarDays className="h-5 w-5" />}
            label="Departure date"
            value={formatDate(departureDate)}
          />
          <DetailItem
            icon={<Clock3 className="h-5 w-5" />}
            label="Departure time"
            value={formatTime(departureTime)}
          />
          <DetailItem
            icon={<Luggage className="h-5 w-5" />}
            label="Baggage allowance"
            value={data.baggageAllowance}
          />
          <DetailItem
            icon={<Plane className="h-5 w-5" />}
            label="Cabin class"
            value={data.cabinClass}
          />
          <DetailItem
            icon={<CreditCard className="h-5 w-5" />}
            label="Payment method"
            value={data.paymentMethod}
          />
          <DetailItem
            icon={<CreditCard className="h-5 w-5" />}
            label="Total amount"
            value={formatMoney(amount, currency)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your itinerary
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review your departure and arrival information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              From
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
              {display(departureCode)}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {display(departureName)}
            </p>
            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
              {formatTime(departureTime)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(departureDate)}
            </p>
          </div>

          <div className="hidden items-center gap-2 text-blue-600 md:flex dark:text-blue-400">
            <div className="h-px w-8 bg-current" />
            <Plane className="h-5 w-5" />
            <div className="h-px w-8 bg-current" />
          </div>

          <div className="border-t border-slate-200 pt-5 md:border-0 md:pt-0 md:text-right dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              To
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
              {display(arrivalCode)}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {display(arrivalName)}
            </p>
            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
              {formatTime(arrivalTime)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(arrivalDate)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>
            Flight duration:{" "}
            <strong className="text-slate-900 dark:text-white">
              {formatDuration(flight?.durationMinutes)}
            </strong>
          </span>
        </div>
      </div>
    </motion.section>
  );
}
