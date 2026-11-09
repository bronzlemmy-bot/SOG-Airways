"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PrimaryButton from "../../buttons/PrimaryButton";
import FormError from "../FormError";

interface BookingFormData {
  flightId: string;
  passengerCount: number;
  bookingClass: string;
}

interface BookingFormProps {
  flightId?: string;
  onSubmit?: (data: BookingFormData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export default function BookingForm({
  flightId = "",
  onSubmit,
  loading = false,
  error,
  className = "",
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    flightId,
    passengerCount: 1,
    bookingClass: "economy",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <CheckCircle2 className="h-5 w-5 text-slate-700" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Book Your Flight
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Complete the booking details to continue with your
          reservation.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <FormError message={error} />
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="booking-flight-id"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Flight
          </label>

          <input
            id="booking-flight-id"
            type="text"
            value={formData.flightId}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                flightId: event.target.value,
              }))
            }
            placeholder="Enter flight ID"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="booking-passengers"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Number of Passengers
          </label>

          <select
            id="booking-passengers"
            value={formData.passengerCount}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                passengerCount: Number(event.target.value),
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="booking-class"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Cabin Class
          </label>

          <select
            id="booking-class"
            value={formData.bookingClass}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                bookingClass: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="economy">Economy</option>
            <option value="premium-economy">
              Premium Economy
            </option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <PrimaryButton
          type="submit"
          loading={loading}
          disabled={loading}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </PrimaryButton>
      </div>
    </form>
  );
}

export type { BookingFormData };