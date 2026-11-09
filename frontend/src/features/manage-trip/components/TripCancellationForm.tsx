"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Plane,
  ShieldCheck,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Badge from "@/components/ui/Badge";

export type CancellationReason =
  | "schedule-change"
  | "personal"
  | "medical"
  | "duplicate-booking"
  | "other";

export interface TripCancellationRequest {
  bookingReference: string;
  tripId: string;
  reason: CancellationReason;
  additionalDetails: string;
  estimatedRefund: number;
  currency: string;
}

export interface TripCancellationFormProps {
  bookingReference: string;
  tripId: string;
  destination?: string;
  departureDate?: string;
  currency?: string;
  totalPaid: number;
  cancellationFee?: number;
  refundable?: boolean;
  onSubmit: (request: TripCancellationRequest) => void | Promise<void>;
  onCancel: () => void;
}

const CANCELLATION_REASONS: {
  value: CancellationReason;
  label: string;
}[] = [
  { value: "schedule-change", label: "My schedule has changed" },
  { value: "personal", label: "Personal reasons" },
  { value: "medical", label: "Medical reasons" },
  { value: "duplicate-booking", label: "Duplicate booking" },
  { value: "other", label: "Other reason" },
];

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

function formatDate(date?: string) {
  if (!date) return "Not provided";

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export default function TripCancellationForm({
  bookingReference,
  tripId,
  destination = "Your destination",
  departureDate,
  currency = "NGN",
  totalPaid,
  cancellationFee = 0,
  refundable = true,
  onSubmit,
  onCancel,
}: TripCancellationFormProps) {
  const [reason, setReason] = useState<CancellationReason | "">("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const safeTotal = Math.max(0, Number.isFinite(totalPaid) ? totalPaid : 0);
  const safeFee = Math.max(
    0,
    Number.isFinite(cancellationFee) ? cancellationFee : 0,
  );

  const estimatedRefund = refundable
    ? Math.max(0, safeTotal - safeFee)
    : 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!reason) {
      setError("Please select a reason for cancelling your trip.");
      return;
    }

    if (!confirmed) {
      setError("Please confirm that you want to submit this cancellation request.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        bookingReference,
        tripId,
        reason,
        additionalDetails: additionalDetails.trim(),
        estimatedRefund,
        currency,
      });

      setSuccess(true);
    } catch {
      setError(
        "We couldn't submit your cancellation request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="bg-linear-to-r from-rose-700 via-red-600 to-orange-500 p-5 text-white sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Cancel your trip
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/85">
              Review the details and estimated refund before submitting your
              cancellation request.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        {success ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
                  Cancellation request submitted
                </h3>
                <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-300">
                  Your request for booking {bookingReference} was submitted
                  to the connected handler. This does not confirm that the
                  booking is cancelled or that a refund has been processed.
                </p>
                <div className="mt-4">
                  <PrimaryButton type="button" onClick={onCancel}>
                    Return to trip
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Trip details
                </h3>
                <Badge variant="warning">Cancellation review</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Plane className="mt-1 h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Destination
                    </p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Departure date
                    </p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatDate(departureDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Booking reference
                  </p>
                  <p className="mt-1 font-semibold tracking-wide text-slate-900 dark:text-white">
                    {bookingReference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Trip ID
                  </p>
                  <p className="mt-1 break-all font-medium text-slate-900 dark:text-white">
                    {tripId}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-sky-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Estimated refund
                </h3>
              </div>

              <p className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {formatMoney(estimatedRefund, currency)}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-300">
                  <span>Original amount paid</span>
                  <span className="font-medium">
                    {formatMoney(safeTotal, currency)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-300">
                  <span>Estimated cancellation fee</span>
                  <span className="font-medium">
                    {formatMoney(refundable ? Math.min(safeFee, safeTotal) : safeTotal, currency)}
                  </span>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                This is an estimate based on the values supplied. Actual
                eligibility, fees, and refund amounts depend on your fare
                rules and airline review.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="cancellation-reason"
                  className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  Why are you cancelling? <span className="text-rose-600">*</span>
                </label>

                <select
                  id="cancellation-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value as CancellationReason | "")
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="" disabled>
                    Select a reason
                  </option>
                  {CANCELLATION_REASONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="cancellation-details"
                  className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  Additional details{" "}
                  <span className="font-normal text-slate-500">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="cancellation-details"
                  value={additionalDetails}
                  onChange={(event) =>
                    setAdditionalDetails(event.target.value)
                  }
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us anything else we should know..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <p className="mt-1 text-right text-xs text-slate-500">
                  {additionalDetails.length}/500
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-rose-600"
                />
                <span className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                  I understand that submitting this request does not guarantee
                  a refund and that cancellation may be irreversible once
                  confirmed by the airline.
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <OutlineButton
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Keep my trip
                </OutlineButton>

                <PrimaryButton
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || !reason || !confirmed}
                >
                  Submit cancellation request
                </PrimaryButton>
              </div>
            </form>
          </>
        )}
      </div>
    </motion.section>
  );
}
