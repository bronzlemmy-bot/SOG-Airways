import { CalendarDays, CheckCircle2, Plane, Users } from "lucide-react";
import PrimaryButton from "../../buttons/PrimaryButton";

interface BookingSummaryProps {
  flightNumber?: string;
  airline?: string;
  departure?: string;
  arrival?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  passengers?: number;
  cabinClass?: string;
  baseFare?: number;
  taxes?: number;
  total?: number;
  currency?: string;
  onConfirm?: () => void;
  loading?: boolean;
  className?: string;
}

export default function BookingSummary({
  flightNumber = "SOG 101",
  airline = "SOG Airways",
  departure = "Lagos",
  arrival = "London",
  departureDate = "Not selected",
  departureTime = "--:--",
  arrivalTime = "--:--",
  passengers = 1,
  cabinClass = "Economy",
  baseFare = 0,
  taxes = 0,
  total = 0,
  currency = "USD",
  onConfirm,
  loading = false,
  className = "",
}: BookingSummaryProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Booking Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review your flight details before confirming your
            booking.
          </p>
        </div>

        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 sm:flex">
          <CheckCircle2 className="h-5 w-5 text-slate-700" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {airline}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Flight {flightNumber}
            </p>
          </div>

          <Plane className="h-5 w-5 text-slate-500" />
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {departure}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {departureTime}
            </p>
          </div>

          <div className="h-px w-12 bg-slate-300" />

          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              {arrival}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {arrivalTime}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4" />
            <span>{departureDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4" />
            <span>
              {passengers}{" "}
              {passengers === 1 ? "Passenger" : "Passengers"}
            </span>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-slate-700">
            {cabinClass}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Base Fare</span>
          <span className="font-medium text-slate-900">
            {formatPrice(baseFare)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Taxes & Fees</span>
          <span className="font-medium text-slate-900">
            {formatPrice(taxes)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="font-semibold text-slate-900">
            Total
          </span>

          <span className="text-xl font-bold text-slate-900">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton
          type="button"
          className="w-full"
          loading={loading}
          disabled={loading}
          onClick={onConfirm}
        >
          Confirm Booking
        </PrimaryButton>
      </div>
    </div>
  );
}