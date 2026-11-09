import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Plane,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

interface BookingPassenger {
  id: string;
  firstName: string;
  lastName: string;
  type?: string;
}

interface BookingFlight {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
}

interface BookingConfirmationProps {
  bookingReference: string;
  passengers: BookingPassenger[];
  flight: BookingFlight;
  totalAmount: number;
  currency?: string;
  paymentStatus?: string;
  onContinuePayment: () => void;
  onBack: () => void;
  loading?: boolean;
}

export default function BookingConfirmation({
  bookingReference,
  passengers,
  flight,
  totalAmount,
  currency = "NGN",
  paymentStatus = "Pending",
  onContinuePayment,
  onBack,
  loading = false,
}: BookingConfirmationProps) {
  return (
    <section className="w-full">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="mx-auto w-full max-w-4xl"
      >
        {/* Confirmation Header */}
        <div className="rounded-3xl bg-sky-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{
                scale: 0.7,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.15,
                duration: 0.35,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15"
            >
              <CheckCircle2 className="h-9 w-9" />
            </motion.div>

            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
              Booking Ready
            </h2>

            <p className="mt-2 max-w-xl text-sm text-sky-100 sm:text-base">
              Your flight details have been reviewed.
              Continue to payment to complete your
              booking.
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 px-6 py-4">
              <p className="text-xs font-medium uppercase tracking-widest text-sky-100">
                Booking Reference
              </p>

              <p className="mt-1 text-2xl font-bold tracking-wider">
                {bookingReference}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 space-y-6">
          {/* Flight Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <Plane className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Flight Details
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your selected flight
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Flight
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {flight.airline}
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {flight.flightNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Route
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {flight.departureAirport}
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  to {flight.arrivalAirport}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Date
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {formatDate(
                    flight.departureDate,
                  )}
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {flight.departureTime} -{" "}
                  {flight.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          {/* Passengers */}
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
                  {passengers.length} passenger
                  {passengers.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
              {passengers.map(
                (passenger, index) => (
                  <div
                    key={passenger.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {index + 1}.{" "}
                        {passenger.firstName}{" "}
                        {passenger.lastName}
                      </p>

                      {passenger.type && (
                        <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
                          {passenger.type}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Payment Summary
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Amount required to complete your
                  booking
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Payment status
                </p>

                <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  {paymentStatus}
                </span>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total amount
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(
                    totalAmount,
                    currency,
                  )}
                </p>
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
              onClick={onContinuePayment}
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              <CreditCard className="h-4 w-4" />

              {loading
                ? "Processing..."
                : "Continue to Payment"}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}