"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Ticket } from "lucide-react";

import Input from "@/components/forms/Input";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

export interface TripLookupData {
  bookingReference: string;
  lastName: string;
}

export interface TripLookupFormProps {
  onSubmit: (data: TripLookupData) => void | Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  error?: string;
  initialBookingReference?: string;
  initialLastName?: string;
  title?: string;
  description?: string;
  className?: string;
}

export default function TripLookupForm({
  onSubmit,
  onBack,
  loading = false,
  error,
  initialBookingReference = "",
  initialLastName = "",
  title = "Find your trip",
  description = "Enter your booking details to view and manage your itinerary.",
  className = "",
}: TripLookupFormProps) {
  const [bookingReference, setBookingReference] = useState(
    initialBookingReference.toUpperCase(),
  );
  const [lastName, setLastName] = useState(initialLastName);
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    const reference = bookingReference.trim().toUpperCase();
    const surname = lastName.trim();

    if (!reference || !surname) {
      setValidationError(
        "Enter both your booking reference and passenger surname.",
      );
      return;
    }

    if (!/^[A-Z0-9-]{4,12}$/.test(reference)) {
      setValidationError(
        "Enter a valid booking reference using 4–12 letters, numbers, or hyphens.",
      );
      return;
    }

    if (surname.length < 2) {
      setValidationError("Enter the passenger's full surname.");
      return;
    }

    try {
      await onSubmit({
        bookingReference: reference,
        lastName: surname,
      });
    } catch {
      setValidationError(
        "We couldn't complete the lookup. Please try again.",
      );
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-sky-900 px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Ticket className="h-6 w-6 text-sky-200" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-blue-100 sm:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 p-5 sm:p-8"
      >
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 dark:border-sky-900/60 dark:bg-sky-950/30">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Have your booking details ready
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">
                Use the booking reference and surname associated with your
                reservation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="trip-booking-reference"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Booking reference
            </label>

            <Input
              id="trip-booking-reference"
              name="bookingReference"
              placeholder="e.g. SOG12345"
              value={bookingReference}
              onChange={(event) =>
                setBookingReference(event.target.value.toUpperCase())
              }
              autoComplete="off"
              required
              disabled={loading}
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Find this code in your booking confirmation.
            </p>
          </div>

          <div>
            <label
              htmlFor="trip-passenger-surname"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Passenger surname
            </label>

            <Input
              id="trip-passenger-surname"
              name="lastName"
              placeholder="Enter surname as booked"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              autoComplete="family-name"
              required
              disabled={loading}
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Enter the surname of a passenger on this booking.
            </p>
          </div>
        </div>

        {(validationError || error) && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
          >
            {validationError || error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          {onBack && (
            <OutlineButton
              type="button"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </OutlineButton>
          )}

          <PrimaryButton
            type="submit"
            loading={loading}
            disabled={loading}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Find my trip
              <ArrowRight className="h-4 w-4" />
            </span>
          </PrimaryButton>
        </div>
      </form>
    </motion.section>
  );
}