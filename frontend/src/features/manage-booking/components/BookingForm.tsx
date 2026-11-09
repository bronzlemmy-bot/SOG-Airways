"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Search,
  TicketCheck,
  UserRound,
  ShieldCheck,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";


export interface BookingLookupValues {
  bookingReference: string;
  surname: string;
}

interface BookingFormProps {
  onSubmit: (values: BookingLookupValues) => void | Promise<void>;
  onReset?: () => void;
  loading?: boolean;
  error?: string | null;
  initialValues?: Partial<BookingLookupValues>;
  className?: string;
}

export default function BookingForm({
  onSubmit,
  onReset,
  loading = false,
  error = null,
  initialValues,
  className = "",
}: BookingFormProps) {
  const [bookingReference, setBookingReference] = useState(
    initialValues?.bookingReference ?? "",
  );
  const [surname, setSurname] = useState(initialValues?.surname ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedReference = bookingReference.trim().toUpperCase();
    const normalizedSurname = surname.trim();

    if (!normalizedReference || !normalizedSurname) {
      setValidationError(
        "Enter both your booking reference and passenger surname.",
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
      setValidationError("Enter a surname between 2 and 80 characters.");
      return;
    }

    setValidationError(null);

    try {
      await onSubmit({
        bookingReference: normalizedReference,
        surname: normalizedSurname,
      });
    } catch {
      // The parent should normally handle service errors and display them
      // through the `error` prop.
    }
  }

  function handleReset() {
    setBookingReference("");
    setSurname("");
    setValidationError(null);
    onReset?.();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${className}`}
    >
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 px-6 py-7 text-white sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-28 border-white/5" />
        <div className="pointer-events-none absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <TicketCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
              SOG Airways
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Retrieve your booking
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Enter the booking reference from your confirmation and the
              surname of a passenger on the reservation.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6 sm:p-8">
        <div>
          <label
            htmlFor="booking-reference"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            <TicketCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Booking reference
          </label>

          <input
            id="booking-reference"
            name="bookingReference"
            type="text"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="characters"
            maxLength={20}
            placeholder="e.g. SOG8K2"
            value={bookingReference}
            onChange={(event) => {
              setBookingReference(event.target.value.toUpperCase());
              setValidationError(null);
            }}
            disabled={loading}
            aria-invalid={Boolean(validationError)}
            aria-describedby={
              validationError ? "booking-lookup-error" : "booking-reference-help"
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-semibold uppercase tracking-wider text-slate-900 outline-none transition placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <p
            id="booking-reference-help"
            className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400"
          >
            Find this code in your booking confirmation email or itinerary.
          </p>
        </div>

        <div>
          <label
            htmlFor="booking-surname"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            <UserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Passenger surname
          </label>

          <input
            id="booking-surname"
            name="surname"
            type="text"
            autoComplete="family-name"
            maxLength={80}
            placeholder="Enter surname as shown on the booking"
            value={surname}
            onChange={(event) => {
              setSurname(event.target.value);
              setValidationError(null);
            }}
            disabled={loading}
            aria-invalid={Boolean(validationError)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {(validationError || error) && (
          <div
            id="booking-lookup-error"
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
          >
            {validationError || error}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <PrimaryButton
            type="submit"
            disabled={loading}
            loading={loading}
            fullWidth
            className="inline-flex min-h-12 items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Finding booking…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Find My Booking
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </PrimaryButton>

          <OutlineButton
            type="button"
            onClick={handleReset}
            disabled={loading || (!bookingReference && !surname)}
            className="min-h-12 justify-center"
          >
            Clear
          </OutlineButton>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
            For your privacy, booking details should only be displayed after
            the booking reference and passenger information have been
            verified.
          </p>
        </div>
      </form>
    </motion.section>
  );
}
