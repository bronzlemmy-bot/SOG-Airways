"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Armchair,
  CheckCircle2,
  Info,
  Plane,
  Wallet,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Badge from "@/components/ui/Badge";

export type SeatCategory = "standard" | "preferred" | "extra-legroom";

export interface SeatOption {
  id: string;
  label: string;
  row: number;
  column: string;
  category: SeatCategory;
  price: number;
  currency: string;
  available: boolean;
  description: string;
}

export interface SeatChangeRequest {
  bookingReference: string;
  passengerId: string;
  flightId: string;
  previousSeat: string;
  newSeat: string;
  additionalCost: number;
  currency: string;
}

interface SeatChangeFormProps {
  bookingReference: string;
  passengerId: string;
  flightId: string;
  passengerName?: string;
  flightNumber?: string;
  currentSeat?: string;
  currency?: string;
  seats?: SeatOption[];
  onSubmit?: (
    request: SeatChangeRequest,
  ) => void | Promise<void>;
  onCancel?: () => void;
}

const SEAT_COLUMNS = ["A", "B", "C", "D", "E", "F"];

function createMockSeats(currency: string): SeatOption[] {
  const seats: SeatOption[] = [];

  for (let row = 1; row <= 10; row += 1) {
    for (const column of SEAT_COLUMNS) {
      const id = `${row}${column}`;
      const isExtraLegroom = row === 1 || row === 2;
      const isPreferred = row >= 3 && row <= 5;
      const unavailable = ["3B", "4E", "6A", "7D", "9C"].includes(id);

      seats.push({
        id,
        label: id,
        row,
        column,
        category: isExtraLegroom
          ? "extra-legroom"
          : isPreferred
            ? "preferred"
            : "standard",
        price: isExtraLegroom
          ? 15000
          : isPreferred
            ? 8000
            : 0,
        currency,
        available: !unavailable,
        description: isExtraLegroom
          ? "Extra legroom"
          : isPreferred
            ? "Preferred seat"
            : "Standard seat",
      });
    }
  }

  return seats;
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

const CATEGORY_LABELS: Record<SeatCategory, string> = {
  standard: "Standard",
  preferred: "Preferred",
  "extra-legroom": "Extra legroom",
};

export default function SeatChangeForm({
  bookingReference,
  passengerId,
  flightId,
  passengerName = "Passenger",
  flightNumber = "Flight",
  currentSeat = "12A",
  currency = "NGN",
  seats,
  onSubmit,
  onCancel,
}: SeatChangeFormProps) {
  const seatOptions = useMemo(
    () => seats ?? createMockSeats(currency),
    [seats, currency],
  );

  const [selectedSeat, setSelectedSeat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const currentSeatOption = seatOptions.find(
    (seat) => seat.label === currentSeat,
  );

  const selectedSeatOption = seatOptions.find(
    (seat) => seat.label === selectedSeat,
  );

  const additionalCost = selectedSeatOption
    ? Math.max(
        0,
        selectedSeatOption.price -
          (currentSeatOption?.price ?? 0),
      )
    : 0;

  const rows = useMemo(
    () =>
      Array.from(
        new Set(seatOptions.map((seat) => seat.row)),
      ).sort((a, b) => a - b),
    [seatOptions],
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!bookingReference.trim() || !passengerId.trim() || !flightId.trim()) {
      setError(
        "Booking, passenger, and flight information are required.",
      );
      return;
    }

    if (!selectedSeatOption) {
      setError("Please select an available seat.");
      return;
    }

    if (!selectedSeatOption.available) {
      setError("That seat is no longer available.");
      return;
    }

    if (selectedSeatOption.label === currentSeat) {
      setError("Please select a different seat.");
      return;
    }

    if (selectedSeatOption.currency !== currency) {
      setError(
        "The selected seat uses a different currency. Please contact support.",
      );
      return;
    }

    if (!onSubmit) {
      setError(
        "Seat changes are not connected yet. Please try again when the booking service is available.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        bookingReference: bookingReference.trim().toUpperCase(),
        passengerId,
        flightId,
        previousSeat: currentSeat,
        newSeat: selectedSeatOption.label,
        additionalCost,
        currency,
      });

      setSuccess(true);
    } catch {
      setError(
        "We couldn't submit your seat-change request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeatStyle = (seat: SeatOption, isSelected: boolean) => {
    if (seat.label === currentSeat) {
      return "border-slate-500 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300";
    }

    if (!seat.available) {
      return "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-700";
    }

    if (isSelected) {
      return "border-sky-600 bg-sky-600 text-white ring-2 ring-sky-300 ring-offset-2 dark:ring-offset-slate-900";
    }

    if (seat.category === "extra-legroom") {
      return "border-violet-300 bg-violet-50 text-violet-800 hover:border-violet-500 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200";
    }

    if (seat.category === "preferred") {
      return "border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-500 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200";
    }

    return "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200";
  };

  return (
    <section className="w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="info">Seat selection</Badge>

            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Choose your preferred seat
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Explore available seats, compare upgrade charges,
              and request a seat change for your flight.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-200">
              <span>Booking: {bookingReference}</span>
              <span>Flight: {flightNumber}</span>
            </div>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Armchair className="h-9 w-9" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Passenger
          </p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {passengerName}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current seat
          </p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {currentSeat}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Seat map
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select a seat to see its category and price.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Plane className="h-4 w-4" />
              Front of aircraft
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-emerald-400 bg-emerald-100" />
              Standard
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-amber-400 bg-amber-100" />
              Preferred
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-violet-400 bg-violet-100" />
              Extra legroom
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-slate-400 bg-slate-200" />
              Current seat
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-slate-300" />
              Unavailable
            </span>
          </div>

          <div className="mx-auto mt-8 max-w-xl rounded-t-[45%] border-x-2 border-t-2 border-slate-300 px-2 pb-5 pt-8 dark:border-slate-700 sm:px-5">
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Plane className="h-4 w-4" />
              FRONT
            </div>

            <div className="space-y-3">
              {rows.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_12px_repeat(3,minmax(0,1fr))] items-center gap-1.5 sm:grid-cols-[28px_repeat(3,minmax(0,1fr))_20px_repeat(3,minmax(0,1fr))] sm:gap-2"
                >
                  <span className="text-center text-xs text-slate-400">
                    {row}
                  </span>

                  {SEAT_COLUMNS.map((column, columnIndex) => {
                    if (columnIndex === 3) {
                      return (
                        <span
                          key="aisle"
                          aria-hidden="true"
                          className="h-1"
                        />
                      );
                    }

                    const seat = seatOptions.find(
                      (option) =>
                        option.row === row &&
                        option.column === column,
                    );

                    if (!seat) {
                      return (
                        <span key={column} className="h-9" />
                      );
                    }

                    const isSelected = selectedSeat === seat.label;
                    const isCurrent = currentSeat === seat.label;

                    return (
                      <button
                        key={seat.label}
                        type="button"
                        disabled={!seat.available || isCurrent}
                        aria-pressed={isSelected}
                        aria-label={`Seat ${seat.label}, ${CATEGORY_LABELS[seat.category]}, ${
                          isCurrent
                            ? "current seat"
                            : !seat.available
                              ? "unavailable"
                              : formatMoney(seat.price, seat.currency)
                        }`}
                        title={`${seat.label} · ${seat.description}${
                          isCurrent
                            ? " · Current seat"
                            : !seat.available
                              ? " · Unavailable"
                              : ` · ${formatMoney(seat.price, seat.currency)}`
                        }`}
                        onClick={() => {
                          setSelectedSeat(seat.label);
                          setError("");
                          setSuccess(false);
                        }}
                        className={`flex h-9 min-w-0 items-center justify-center rounded-lg border text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:h-10 sm:text-xs ${getSeatStyle(
                          seat,
                          isSelected,
                        )}`}
                      >
                        {seat.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              REAR OF AIRCRAFT
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            This is a demonstration seat map. Actual seat layout,
            availability, and prices must come from the selected
            aircraft and booking.
          </p>
        </div>

        {selectedSeatOption && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <Armchair className="mt-1 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Seat {selectedSeatOption.label}
                  </h3>
                  <Badge variant="info">
                    {CATEGORY_LABELS[selectedSeatOption.category]}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {selectedSeatOption.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Seat price
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatMoney(
                      selectedSeatOption.price,
                      selectedSeatOption.currency,
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 border-t border-sky-200 pt-3 dark:border-sky-900">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                    <Wallet className="h-4 w-4" />
                    Additional charge
                  </span>
                  <span className="text-lg font-bold text-slate-950 dark:text-white">
                    {formatMoney(additionalCost, currency)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">
                Seat-change request submitted
              </p>
              <p className="mt-1">
                Your submission handler completed successfully.
                Your seat is not confirmed as changed until the
                airline processes the request.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {onCancel && (
            <OutlineButton
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </OutlineButton>
          )}

          <PrimaryButton
            type="submit"
            disabled={!selectedSeatOption || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting
              ? "Submitting request..."
              : "Request seat change"}
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}