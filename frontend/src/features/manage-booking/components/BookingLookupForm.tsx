"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  Search,
  TicketCheck,
  UserRound,
} from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

export interface BookingLookupValues {
  bookingReference: string;
  surname: string;
}

interface BookingLookupFormProps {
  onSubmit: (values: BookingLookupValues) => void | Promise<void>;
  onReset?: () => void;
  loading?: boolean;
  error?: string | null;
  initialValues?: Partial<BookingLookupValues>;
  className?: string;
}

export default function BookingLookupForm({
  onSubmit,
  onReset,
  loading = false,
  error = null,
  initialValues,
  className = "",
}: BookingLookupFormProps) {
  const [bookingReference, setBookingReference] = useState(
    initialValues?.bookingReference ?? "",
  );
  const [surname, setSurname] = useState(initialValues?.surname ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const normalizedReference = bookingReference.trim().toUpperCase();
    const normalizedSurname = surname.trim();

    if (!normalizedReference || !normalizedSurname) {
      setValidationError(
        "Enter your booking reference and passenger surname to continue.",
      );
      return;
    }

    if (!/^[A-Z0-9-]{4,20}$/.test(normalizedReference)) {
      setValidationError(
        "Enter a valid booking reference using 4–20 letters, numbers, or hyphens.",
      );
      return;
    }

    if (normalizedSurname.length < 2 || normalizedSurname.length > 80) {
      setValidationError(
        "Your surname must contain between 2 and 80 characters.",
      );
      return;
    }

    try {
      await onSubmit({
        bookingReference: normalizedReference,
        surname: normalizedSurname,
      });
    } catch {
      setValidationError(
        "We couldn't complete your booking search. Please try again.",
      );
    }
  };

  const handleReset = () => {
    setBookingReference("");
    setSurname("");
    setValidationError(null);
    onReset?.();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10 ${className}`}
      aria-labelledby="booking-lookup-heading"
    >
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/60 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <TicketCheck className="h-5 w-5" />
          </div>

          <div>
            <h2
              id="booking-lookup-heading"
              className="text-xl font-bold text-slate-950 dark:text-white"
            >
              Find your booking
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Enter the details exactly as they appear on your reservation.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5 sm:p-7">
        <div>
          <label
            htmlFor="booking-reference"
            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Booking reference
          </label>

          <div className="relative">
            <TicketCheck
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="booking-reference"
              name="bookingReference"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="e.g. SOG12345"
              value={bookingReference}
              onChange={(event) => {
                setBookingReference(event.target.value.toUpperCase());
                setValidationError(null);
              }}
              disabled={loading}
              maxLength={20}
              aria-describedby="booking-reference-help"
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium uppercase tracking-wider text-slate-900 outline-none transition placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
            />
          </div>

          <p
            id="booking-reference-help"
            className="mt-2 text-xs leading-5 text-slate-500"
          >
            Usually found on your booking confirmation or e-ticket.
          </p>
        </div>

        <div>
          <label
            htmlFor="booking-surname"
            className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Passenger surname
          </label>

          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="booking-surname"
              name="surname"
              type="text"
              autoComplete="family-name"
              placeholder="Enter the surname on the booking"
              value={surname}
              onChange={(event) => {
                setSurname(event.target.value);
                setValidationError(null);
              }}
              disabled={loading}
              maxLength={80}
              aria-describedby="booking-surname-help"
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
            />
          </div>

          <p
            id="booking-surname-help"
            className="mt-2 text-xs leading-5 text-slate-500"
          >
            Use the surname of a passenger listed on the reservation.
          </p>
        </div>

        {(validationError || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            role="alert"
          >
            {validationError || error}
          </motion.div>
        )}

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <PrimaryButton
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Searching bookings...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find my booking
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </PrimaryButton>

          <OutlineButton
            type="button"
            fullWidth
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear
          </OutlineButton>
        </div>

        <div className="flex items-start gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs leading-5 text-slate-500">
            Your booking details should only be used to retrieve your own
            reservation. The lookup must be verified by the booking service
            before any private booking information is returned.
          </p>
        </div>
      </form>
    </motion.section>
  );
}
