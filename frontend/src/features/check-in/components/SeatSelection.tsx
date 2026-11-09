"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Plane,
  Users,
  X,
} from "lucide-react";

import type { CheckInPassenger } from "@/types";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

export type SeatStatus = "available" | "occupied" | "selected";

export interface Seat {
  id: string;
  row: number;
  column: string;
  status: SeatStatus;
  cabinClass: "economy" | "premium-economy" | "business" | "first";
  price: number;
  currency: string;
  features?: string[];
}

interface SeatSelectionProps {
  passenger: CheckInPassenger;
  passengers?: CheckInPassenger[];
  selectedSeat?: Seat | null;
  occupiedSeats?: string[];
  unavailableSeats?: string[];
  onSeatSelect: (seat: Seat, passenger: CheckInPassenger) => void;
  onContinue?: () => void;
  onBack?: () => void;
  loading?: boolean;
  error?: string | null;
  currency?: string;
  className?: string;
}

const COLUMNS = ["A", "B", "C", "D", "E", "F"];


const DEFAULT_OCCUPIED_SEATS = [
  "1A",
  "2C",
  "3B",
  "4E",
  "5A",
  "5F",
  "6C",
  "7D",
  "8B",
  "9E",
  "10A",
  "11F",
  "12C",
];

const ROWS = Array.from({ length: 12 }, (_, index) => index + 1);

function getCabinClass(
  row: number,
): Seat["cabinClass"] {
  if (row === 1) return "first";
  if (row <= 3) return "business";
  if (row <= 5) return "premium-economy";
  return "economy";
}

function getSeatPrice(
  row: number,
  column: string,
): number {
  const cabinClass = getCabinClass(row);
  const isWindow = column === "A" || column === "F";
  const isAisle = column === "C" || column === "D";

  const basePrices: Record<Seat["cabinClass"], number> = {
    first: 45000,
    business: 30000,
    "premium-economy": 15000,
    economy: 0,
  };

  return (
    basePrices[cabinClass] +
    (isWindow ? 5000 : isAisle ? 3000 : 0)
  );
}

function formatPrice(
  amount: number,
  currency: string,
): string {
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

function getSeatLabel(seat: Seat): string {
  return `${seat.row}${seat.column}`;
}

function getPassengerName(
  passenger: CheckInPassenger,
): string {
  return `${passenger.firstName} ${passenger.lastName}`.trim();
}

export default function SeatSelection({
  passenger,
  passengers = [],
  selectedSeat: selectedSeatProp,
  occupiedSeats = DEFAULT_OCCUPIED_SEATS,
  unavailableSeats = [],
  onSeatSelect,
  onContinue,
  onBack,
  loading = false,
  error,
  currency = "NGN",
  className = "",
}: SeatSelectionProps) {
  const passengerList = useMemo(() => {
    const combined = [passenger, ...passengers];
    const uniquePassengers = new Map<string, CheckInPassenger>();

    combined.forEach((item) => {
      uniquePassengers.set(item.passengerId, item);
    });

    return Array.from(uniquePassengers.values());
  }, [passenger, passengers]);

  const [activePassengerId, setActivePassengerId] =
    useState(passenger.passengerId);

  const activePassenger =
    passengerList.find(
      (item) => item.passengerId === activePassengerId,
    ) ?? passenger;

  const [selectedSeatIds, setSelectedSeatIds] = useState<
    Record<string, string>
  >(() =>
    selectedSeatProp
      ? {
          [passenger.passengerId]:
            getSeatLabel(selectedSeatProp),
        }
      : {},
  );

  const [showLegend, setShowLegend] = useState(false);

  const effectiveSelectedSeatId =
    activePassenger.passengerId === passenger.passengerId &&
    selectedSeatProp
      ? getSeatLabel(selectedSeatProp)
      : selectedSeatIds[activePassenger.passengerId] ?? "";

  const seats = useMemo<Seat[]>(() => {
    return ROWS.flatMap((row) =>
      COLUMNS.map((column) => {
        const id = `${row}${column}`;
        const cabinClass = getCabinClass(row);
        const isOccupied = occupiedSeats.includes(id);
        const isUnavailable = unavailableSeats.includes(id);

        return {
          id,
          row,
          column,
          status:
            isOccupied || isUnavailable
              ? "occupied"
              : "available",
          cabinClass,
          price: getSeatPrice(row, column),
          currency,
          features: [
            ...(column === "A" || column === "F"
              ? ["Window seat"]
              : []),
            ...(column === "C" || column === "D"
              ? ["Aisle seat"]
              : []),
            ...(row === 1 ? ["Front cabin"] : []),
          ],
        };
      }),
    );
  }, [occupiedSeats, unavailableSeats, currency]);

  const activeSeat = seats.find(
    (seat) => getSeatLabel(seat) === effectiveSelectedSeatId,
  );

  const selectedSeats = passengerList
    .map((item) => {
      const seatId =
        item.passengerId === passenger.passengerId &&
        selectedSeatProp
          ? getSeatLabel(selectedSeatProp)
          : selectedSeatIds[item.passengerId];

      return {
        passenger: item,
        seat: seats.find(
          (seat) => getSeatLabel(seat) === seatId,
        ),
      };
    })
    .filter(
      (
        item,
      ): item is {
        passenger: CheckInPassenger;
        seat: Seat;
      } => Boolean(item.seat),
    );

  const selectedSeatUnavailable =
    Boolean(activeSeat) && activeSeat?.status === "occupied";

  const canContinue =
    !loading &&
    selectedSeats.length === passengerList.length &&
    passengerList.length > 0;

  const handleSeatClick = (seat: Seat) => {
    if (loading || seat.status === "occupied") return;

    const seatLabel = getSeatLabel(seat);

    const alreadyAssignedToAnotherPassenger =
      selectedSeats.some(
        (item) =>
          item.passenger.passengerId !==
            activePassenger.passengerId &&
          getSeatLabel(item.seat) === seatLabel,
      );

    if (alreadyAssignedToAnotherPassenger) return;

    setSelectedSeatIds((previous) => ({
      ...previous,
      [activePassenger.passengerId]: seatLabel,
    }));

    onSeatSelect(
      {
        ...seat,
        status: "selected",
      },
      activePassenger,
    );
  };

  const getSeatClasses = (seat: Seat) => {
    const label = getSeatLabel(seat);
    const isSelected = label === effectiveSelectedSeatId;
    const isAssignedElsewhere = selectedSeats.some(
      (item) =>
        item.passenger.passengerId !==
          activePassenger.passengerId &&
        getSeatLabel(item.seat) === label,
    );

    const disabled =
      seat.status === "occupied" ||
      isAssignedElsewhere ||
      loading;

    if (isSelected) {
      return "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/25 ring-2 ring-sky-200 dark:ring-sky-900";
    }

    if (disabled) {
      return "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600";
    }

    switch (seat.cabinClass) {
      case "first":
        return "border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-500 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200";
      case "business":
        return "border-violet-300 bg-violet-50 text-violet-900 hover:border-violet-500 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200";
      case "premium-economy":
        return "border-blue-300 bg-blue-50 text-blue-900 hover:border-blue-500 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200";
      default:
        return "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200";
    }
  };

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-sky-900 px-5 py-7 text-white sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl"
        />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Badge variant="info">Check-in · Seat selection</Badge>

            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
              Choose your seat
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Pick a seat for every passenger. Your selected seats will be
              highlighted on the aircraft map.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 sm:self-center">
            <Armchair className="h-8 w-8" />
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs text-slate-300">Passengers</p>
            <p className="mt-1 text-lg font-extrabold">
              {passengerList.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs text-slate-300">Seats selected</p>
            <p className="mt-1 text-lg font-extrabold">
              {selectedSeats.length} / {passengerList.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs text-slate-300">Additional seat fees</p>
            <p className="mt-1 text-lg font-extrabold">
              {formatPrice(
                selectedSeats.reduce(
                  (total, item) => total + item.seat.price,
                  0,
                ),
                currency,
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-8">
        <div className="min-w-0">
          {passengerList.length > 1 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Select passenger
                </h3>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {passengerList.map((item, index) => {
                  const isActive =
                    item.passengerId === activePassenger.passengerId;

                  const seatId =
                    item.passengerId === passenger.passengerId &&
                    selectedSeatProp
                      ? getSeatLabel(selectedSeatProp)
                      : selectedSeatIds[item.passengerId];

                  return (
                    <button
                      key={item.passengerId}
                      type="button"
                      onClick={() => setActivePassengerId(item.passengerId)}
                      disabled={loading}
                      className={`flex min-w-44 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        isActive
                          ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100 dark:bg-sky-950/30 dark:ring-sky-900"
                          : "border-slate-200 bg-white hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                          isActive
                            ? "bg-sky-600 text-white"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                          {getPassengerName(item)}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {seatId ? `Seat ${seatId}` : "No seat selected"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Aircraft seat map
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Front of aircraft at the top
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLegend((previous) => !previous)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Info className="h-4 w-4" />
              {showLegend ? "Hide legend" : "Seat legend"}
            </button>
          </div>

          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-3 dark:border-slate-800">
                  {[
                    ["bg-emerald-50 border-emerald-300", "Economy"],
                    ["bg-blue-50 border-blue-300", "Premium economy"],
                    ["bg-violet-50 border-violet-300", "Business"],
                    ["bg-amber-50 border-amber-300", "First class"],
                    ["bg-sky-600 border-sky-600", "Your selection"],
                    ["bg-slate-200 border-slate-300", "Unavailable"],
                  ].map(([color, label]) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <span
                        className={`h-4 w-4 shrink-0 rounded border ${color}`}
                      />
                      {label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-4xl border border-slate-200 bg-slate-50/80 p-3 sm:p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-3 rounded-t-[50%] border-x-2 border-t-2 border-slate-300 py-5 dark:border-slate-700">
              <Plane className="h-5 w-5 text-sky-600" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">
                Front
              </span>
            </div>

            <div className="mx-auto max-w-md">
              <div className="mb-3 grid grid-cols-[24px_repeat(3,minmax(0,1fr))_16px_repeat(3,minmax(0,1fr))] items-center gap-1.5 sm:gap-2">
                <span />
                {COLUMNS.map((column, index) => (
                  <span
                    key={column}
                    className={`text-center text-xs font-bold text-slate-500 ${
                      index === 3 ? "col-start-6" : ""
                    }`}
                  >
                    {column}
                  </span>
                ))}
              </div>

              {ROWS.map((row) => {
               

                return (
                  <div
                    key={row}
                    className="mb-2 grid grid-cols-[24px_repeat(3,minmax(0,1fr))_16px_repeat(3,minmax(0,1fr))] items-center gap-1.5 sm:gap-2"
                  >
                    <span className="text-center text-xs font-semibold text-slate-500">
                      {row}
                    </span>

                    {COLUMNS.map((column) => {
                      const seat = seats.find(
                        (item) =>
                          item.row === row && item.column === column,
                      );

                      if (!seat) return null;

                      const seatLabel = getSeatLabel(seat);
                      const isSelected =
                        seatLabel === effectiveSelectedSeatId;

                      const isAssignedElsewhere = selectedSeats.some(
                        (item) =>
                          item.passenger.passengerId !==
                            activePassenger.passengerId &&
                          getSeatLabel(item.seat) === seatLabel,
                      );

                      const disabled =
                        seat.status === "occupied" ||
                        isAssignedElsewhere ||
                        loading;

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          title={`${seatLabel} · ${seat.cabinClass.replace(/-/g, " ")} · ${formatPrice(seat.price, currency)}${
                            seat.status === "occupied"
                              ? " · Unavailable"
                              : ""
                          }`}
                          aria-label={`Seat ${seatLabel}, ${seat.cabinClass.replace(/-/g, " ")}, ${seat.status === "occupied" ? "unavailable" : isSelected ? "selected" : "available"}`}
                          aria-pressed={isSelected}
                          disabled={disabled}
                          onClick={() => handleSeatClick(seat)}
                          className={`relative flex h-9 min-w-0 items-center justify-center rounded-lg border text-[10px] font-extrabold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 sm:h-10 sm:text-xs ${getSeatClasses(seat)} ${
                            column === "D" ? "col-start-6" : ""
                          }`}
                        >
                          {seat.status === "occupied" ? (
                            <X className="h-3.5 w-3.5" />
                          ) : isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            seatLabel
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              Demo aircraft layout. Seat availability and fees must be
              confirmed by your airline before booking is finalized.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {selectedSeatUnavailable && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
            >
              The currently assigned seat is unavailable. Please choose
              another seat.
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Seat summary
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {getPassengerName(activePassenger)}
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-500">
                Selected seat
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {activeSeat ? getSeatLabel(activeSeat) : "None"}
              </span>
            </div>

            {activeSeat && (
              <>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Cabin class
                  </span>
                  <span className="text-right text-sm font-bold capitalize text-slate-800 dark:text-slate-200">
                    {activeSeat.cabinClass.replace(/-/g, " ")}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Seat fee
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(activeSeat.price, currency)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {activeSeat.features?.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {selectedSeats.map((item) => (
              <div
                key={item.passenger.passengerId}
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {getPassengerName(item.passenger)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Seat {getSeatLabel(item.seat)}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.seat.price, currency)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Total seat fees
            </span>
            <span className="text-lg font-black text-slate-950 dark:text-white">
              {formatPrice(
                selectedSeats.reduce(
                  (total, item) => total + item.seat.price,
                  0,
                ),
                currency,
              )}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <PrimaryButton
              type="button"
              fullWidth
              loading={loading}
              disabled={!canContinue}
              onClick={onContinue}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </PrimaryButton>

            {onBack && (
              <OutlineButton
                type="button"
                fullWidth
                disabled={loading}
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </OutlineButton>
            )}
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Seat assignments shown here are temporary demo selections.
          </p>
        </aside>
      </div>
    </section>
  );
}
