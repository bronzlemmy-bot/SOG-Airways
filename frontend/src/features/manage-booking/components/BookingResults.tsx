"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Plane,
  Search,
  UserRound,
} from "lucide-react";
import type { Booking } from "@/types/booking";
import BookingActions from "./BookingActions";
import BookingDetails from "./BookingDetails";

type BookingDisplayData = Omit<
  Booking,
  "bookingReference" | "status" | "departureDate" | "flightNumber"
> & {
  bookingReference: string;
  reference?: string;
  status?: string;
  departureDate?: string;
  flightDate?: string;
  flightNumber?: string;
  passengerName?: string;
  passengers?: Array<{
    firstName?: string;
    lastName?: string;
    name?: string;
  }>;
};

interface BookingResultsProps {
  bookings: Booking[];
  loading?: boolean;
  searched?: boolean;
  onViewDetails: (booking: Booking) => void;
  onRequestChange: (booking: Booking) => void;
  onRequestCancellation: (booking: Booking) => void;
  onViewReceipt: (booking: Booking) => void;
  className?: string;
}

function getReference(booking: BookingDisplayData): string {
  return (
    booking.bookingReference ||
    booking.reference ||
    booking.id ||
    "Not available"
  );
}

function getPassengerName(booking: BookingDisplayData): string {
  if (booking.passengerName?.trim()) {
    return booking.passengerName.trim();
  }

  const firstPassenger = booking.passengers?.[0];

  if (firstPassenger?.name?.trim()) {
    return firstPassenger.name.trim();
  }

  const fullName = [
    firstPassenger?.firstName,
    firstPassenger?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Passenger details unavailable";
}

function getDepartureDate(booking: BookingDisplayData): string {
  const date = booking.departureDate || booking.flightDate;

  if (!date) {
    return "Date not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getStatus(booking: BookingDisplayData): string {
  return booking.status || "pending";
}

export default function BookingResults({
  bookings,
  loading = false,
  searched = false,
  onViewDetails,
  onRequestChange,
  onRequestCancellation,
  onViewReceipt,
  className = "",
}: BookingResultsProps) {
  if (loading) {
    return (
      <section
        className={`space-y-4 ${className}`}
        aria-label="Loading booking results"
        aria-live="polite"
      >
        {[1, 2].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 max-w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-28 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="mt-6 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </section>
    );
  }

  if (bookings.length === 0) {
    if (!searched) {
      return null;
    }

    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-8 ${className}`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Search className="h-8 w-8" aria-hidden="true" />
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
          No booking found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
          We could not find a booking matching the details you entered.
          Check your booking reference and passenger surname, then try again.
        </p>
      </motion.section>
    );
  }

  return (
    <section
      className={`space-y-5 ${className}`}
      aria-label="Booking search results"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Your booking
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Review your itinerary and available booking actions.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {bookings.map((booking, index) => {
          const displayBooking = booking as BookingDisplayData;

          return (
            <motion.article
              key={String(booking.id || getReference(displayBooking))}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: 0.25,
                delay: Math.min(index * 0.05, 0.2),
              }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <Plane className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="wrap-break-words text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                        Booking {getReference(displayBooking)}
                      </h3>

                      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <CalendarDays
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        Departure: {getDepartureDate(displayBooking)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <AlertCircle
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    {getStatus(displayBooking).replace(/[-_]/g, " ")}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <ClipboardList
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Booking reference
                      </p>
                      <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
                        {getReference(displayBooking)}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <UserRound className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Passenger
                      </p>
                      <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
                        {getPassengerName(displayBooking)}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Plane className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Flight number
                      </p>
                      <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
                        {displayBooking.flightNumber || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <BookingDetails
                  booking={booking}
                  className="mb-5"
                />

                <BookingActions
                  booking={booking}
                  onViewDetails={onViewDetails}
                  onRequestChange={onRequestChange}
                  onRequestCancellation={onRequestCancellation}
                  onViewReceipt={onViewReceipt}
                />
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </section>
  );
}
