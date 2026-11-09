import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

interface BookingSummaryProps {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  passengers: number;
  cabinClass: string;
  fare: number;
  taxes?: number;
  fees?: number;
  currency?: string;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export default function BookingSummary({
  flightNumber,
  airline,
  departureAirport,
  arrivalAirport,
  departureDate,
  departureTime,
  arrivalTime,
  passengers,
  cabinClass,
  fare,
  taxes = 0,
  fees = 0,
  currency = "NGN",
  onConfirm,
  onBack,
  loading = false,
}: BookingSummaryProps) {
  const total =
    fare + taxes + fees;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="w-full"
    >
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
            Final Review
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Review Your Booking
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Check your flight and passenger details before
            confirming your booking.
          </p>
        </div>

        {/* Flight Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Plane className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Flight Details
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {airline} · {flightNumber}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Route */}
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Departure
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {departureTime}
                </p>

                <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">
                  {departureAirport}
                </p>
              </div>

              <div className="hidden md:flex md:flex-col md:items-center md:gap-2">
                <div className="h-px w-24 bg-slate-300 dark:bg-slate-700" />

                <Plane className="h-5 w-5 rotate-90 text-sky-600 dark:text-sky-400" />

                <div className="h-px w-24 bg-slate-300 dark:bg-slate-700" />
              </div>

              <div className="md:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Arrival
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {arrivalTime}
                </p>

                <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">
                  {arrivalAirport}
                </p>
              </div>
            </div>

            {/* Flight Meta */}
            <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2 dark:border-slate-800">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <CalendarDays className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs text-slate-400">
                    Travel Date
                  </p>

                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(
                      departureDate,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <Clock3 className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs text-slate-400">
                    Cabin Class
                  </p>

                  <p className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {cabinClass.replace(
                      "-",
                      " ",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Passengers
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {passengers} passenger
                {passengers !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Price Summary
            </h3>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Flight Fare
              </span>

              <span className="font-medium text-slate-900 dark:text-white">
                {formatCurrency(
                  fare,
                  currency,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Taxes
              </span>

              <span className="font-medium text-slate-900 dark:text-white">
                {formatCurrency(
                  taxes,
                  currency,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Fees
              </span>

              <span className="font-medium text-slate-900 dark:text-white">
                {formatCurrency(
                  fees,
                  currency,
                )}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-slate-900 dark:text-white">
                  Total
                </span>

                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {formatCurrency(
                    total,
                    currency,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600"
          >
            <CheckCircle2 className="h-4 w-4" />

            {loading
              ? "Confirming..."
              : "Confirm Booking"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}