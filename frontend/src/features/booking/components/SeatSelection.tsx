"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Armchair,
  Check,
  Info,
  Plane,
} from "lucide-react";

type SeatStatus =
  | "available"
  | "occupied"
  | "selected";

export interface Seat {
  id: string;
  row: number;
  seat: string;
  status: SeatStatus;
  price?: number;
}

interface SeatSelectionProps {
  seats?: Seat[];
  selectedSeat?: string;
  onSeatSelect?: (
    seat: Seat,
  ) => void;
  currency?: string;
  disabled?: boolean;
}

const DEFAULT_SEATS: Seat[] = [
  {
    id: "1A",
    row: 1,
    seat: "A",
    status: "available",
  },
  {
    id: "1B",
    row: 1,
    seat: "B",
    status: "available",
  },
  {
    id: "1C",
    row: 1,
    seat: "C",
    status: "occupied",
  },
  {
    id: "1D",
    row: 1,
    seat: "D",
    status: "available",
  },
  {
    id: "1E",
    row: 1,
    seat: "E",
    status: "available",
  },
  {
    id: "1F",
    row: 1,
    seat: "F",
    status: "occupied",
  },
  {
    id: "2A",
    row: 2,
    seat: "A",
    status: "available",
  },
  {
    id: "2B",
    row: 2,
    seat: "B",
    status: "available",
  },
  {
    id: "2C",
    row: 2,
    seat: "C",
    status: "available",
  },
  {
    id: "2D",
    row: 2,
    seat: "D",
    status: "available",
  },
  {
    id: "2E",
    row: 2,
    seat: "E",
    status: "occupied",
  },
  {
    id: "2F",
    row: 2,
    seat: "F",
    status: "available",
  },
  {
    id: "3A",
    row: 3,
    seat: "A",
    status: "available",
  },
  {
    id: "3B",
    row: 3,
    seat: "B",
    status: "available",
  },
  {
    id: "3C",
    row: 3,
    seat: "C",
    status: "available",
  },
  {
    id: "3D",
    row: 3,
    seat: "D",
    status: "occupied",
  },
  {
    id: "3E",
    row: 3,
    seat: "E",
    status: "available",
  },
  {
    id: "3F",
    row: 3,
    seat: "F",
    status: "available",
  },
  {
    id: "4A",
    row: 4,
    seat: "A",
    status: "occupied",
  },
  {
    id: "4B",
    row: 4,
    seat: "B",
    status: "available",
  },
  {
    id: "4C",
    row: 4,
    seat: "C",
    status: "available",
  },
  {
    id: "4D",
    row: 4,
    seat: "D",
    status: "available",
  },
  {
    id: "4E",
    row: 4,
    seat: "E",
    status: "occupied",
  },
  {
    id: "4F",
    row: 4,
    seat: "F",
    status: "available",
  },
  {
    id: "5A",
    row: 5,
    seat: "A",
    status: "available",
  },
  {
    id: "5B",
    row: 5,
    seat: "B",
    status: "available",
  },
  {
    id: "5C",
    row: 5,
    seat: "C",
    status: "available",
  },
  {
    id: "5D",
    row: 5,
    seat: "D",
    status: "available",
  },
  {
    id: "5E",
    row: 5,
    seat: "E",
    status: "available",
  },
  {
    id: "5F",
    row: 5,
    seat: "F",
    status: "available",
  },
  {
    id: "6A",
    row: 6,
    seat: "A",
    status: "available",
  },
  {
    id: "6B",
    row: 6,
    seat: "B",
    status: "occupied",
  },
  {
    id: "6C",
    row: 6,
    seat: "C",
    status: "available",
  },
  {
    id: "6D",
    row: 6,
    seat: "D",
    status: "available",
  },
  {
    id: "6E",
    row: 6,
    seat: "E",
    status: "available",
  },
  {
    id: "6F",
    row: 6,
    seat: "F",
    status: "available",
  },
];

function formatSeatPrice(
  price: number,
  currency: string,
) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SeatSelection({
  seats = DEFAULT_SEATS,
  selectedSeat,
  onSeatSelect,
  currency = "NGN",
  disabled = false,
}: SeatSelectionProps) {
  const [internalSelectedSeat, setInternalSelectedSeat] =
    useState<string | undefined>(
      selectedSeat,
    );

  const activeSeat =
    selectedSeat ?? internalSelectedSeat;

  const rows = useMemo(() => {
    const grouped = new Map<
      number,
      Seat[]
    >();

    seats.forEach((seat) => {
      const existing =
        grouped.get(seat.row) ?? [];

      existing.push(seat);
      grouped.set(seat.row, existing);
    });

    return Array.from(grouped.entries()).sort(
      ([rowA], [rowB]) => rowA - rowB,
    );
  }, [seats]);

  const handleSeatSelect = (seat: Seat) => {
    if (
      disabled ||
      seat.status === "occupied"
    ) {
      return;
    }

    const nextSeat =
      activeSeat === seat.id
        ? undefined
        : seat.id;

    setInternalSelectedSeat(nextSeat);

    if (nextSeat) {
      onSeatSelect?.({
        ...seat,
        status: "selected",
      });
    }
  };

  const availableCount = seats.filter(
    (seat) => seat.status === "available",
  ).length;

  const occupiedCount = seats.filter(
    (seat) => seat.status === "occupied",
  ).length;

  const selectedSeatData = seats.find(
    (seat) => seat.id === activeSeat,
  );

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            <Armchair className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              Seat selection
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              Choose your seat
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select an available seat for your
              journey. Occupied seats cannot be
              selected.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="h-4 w-4 rounded-md border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900" />
            Available
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="h-4 w-4 rounded-md bg-slate-300 dark:bg-slate-700" />
            Occupied
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400">
            <span className="h-4 w-4 rounded-md bg-sky-500" />
            Selected
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Seat Map */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
          <div className="mx-auto max-w-xl">
            {/* Aircraft Front */}
            <div className="mb-6 flex flex-col items-center">
              <div className="flex h-12 w-24 items-center justify-center rounded-t-[3rem] bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <Plane className="h-5 w-5 -rotate-90" />
              </div>

              <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Front
              </span>
            </div>

            {/* Seat Map */}
            <div className="overflow-x-auto pb-3">
              <div className="mx-auto min-w-85">
                {/* Column Labels */}
                <div className="mb-3 grid grid-cols-[36px_repeat(6,minmax(38px,1fr))] items-center gap-2 px-1 text-center text-xs font-bold text-slate-400">
                  <span />

                  <span>A</span>
                  <span>B</span>
                  <span>C</span>

                  <span className="text-slate-300 dark:text-slate-700">
                    |
                  </span>

                  <span>E</span>
                  <span>F</span>
                </div>

                <div className="space-y-3">
                  {rows.map(
                    ([rowNumber, rowSeats]) => {
                      const seatMap =
                        new Map(
                          rowSeats.map(
                            (seat) => [
                              seat.seat,
                              seat,
                            ],
                          ),
                        );

                      return (
                        <div
                          key={rowNumber}
                          className="grid grid-cols-[36px_repeat(6,minmax(38px,1fr))] items-center gap-2"
                        >
                          <span className="text-center text-xs font-semibold text-slate-400">
                            {rowNumber}
                          </span>

                          {[
                            "A",
                            "B",
                            "C",
                            "D",
                            "E",
                            "F",
                          ].map(
                            (
                              seatLetter,
                              index,
                            ) => {
                              const seat =
                                seatMap.get(
                                  seatLetter,
                                );

                              if (!seat) {
                                return (
                                  <div
                                    key={`${rowNumber}-${seatLetter}`}
                                    className="h-11"
                                  />
                                );
                              }

                              const isSelected =
                                activeSeat ===
                                seat.id;

                              const isOccupied =
                                seat.status ===
                                "occupied";

                              const isAisle =
                                index === 3;

                              return (
                                <div
                                  key={seat.id}
                                  className={
                                    isAisle
                                      ? "relative pl-2"
                                      : "relative"
                                  }
                                >
                                  {isAisle && (
                                    <span className="pointer-events-none absolute -left-1 top-1/2 hidden h-5 w-px -translate-y-1/2 bg-slate-200 dark:bg-slate-800 sm:block" />
                                  )}

                                  <motion.button
                                    type="button"
                                    whileHover={
                                      !disabled &&
                                      !isOccupied
                                        ? {
                                            scale: 1.05,
                                          }
                                        : undefined
                                    }
                                    whileTap={
                                      !disabled &&
                                      !isOccupied
                                        ? {
                                            scale: 0.95,
                                          }
                                        : undefined
                                    }
                                    onClick={() =>
                                      handleSeatSelect(
                                        seat,
                                      )
                                    }
                                    disabled={
                                      disabled ||
                                      isOccupied
                                    }
                                    aria-label={`Seat ${seat.id}${
                                      isOccupied
                                        ? ", occupied"
                                        : isSelected
                                          ? ", selected"
                                          : ", available"
                                    }`}
                                    className={`relative flex h-11 w-full min-w-9.5 items-center justify-center rounded-lg border text-xs font-bold transition ${
                                      isSelected
                                        ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                                        : isOccupied
                                          ? "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-600"
                                          : "border-slate-300 bg-white text-slate-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                                    }`}
                                  >
                                    {isSelected ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      seat.id
                                    )}

                                    {seat.price &&
                                      seat.price >
                                        0 && (
                                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1 text-[8px] font-semibold text-sky-600 shadow-sm dark:bg-slate-950 dark:text-sky-400">
                                          +
                                          {formatSeatPrice(
                                            seat.price,
                                            currency,
                                          )}
                                        </span>
                                      )}
                                  </motion.button>
                                </div>
                              );
                            },
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            {/* Aircraft Rear */}
            <div className="mt-8 flex flex-col items-center">
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rear
              </span>

              <div className="h-5 w-32 rounded-b-3xl bg-slate-100 dark:bg-slate-900" />
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <motion.aside
          layout
          className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-6"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-sky-600 dark:text-sky-400" />

            <h3 className="font-semibold text-slate-900 dark:text-white">
              Seat summary
            </h3>
          </div>

          {selectedSeatData ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-5"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Selected seat
              </p>

              <div className="mt-2 flex items-center justify-between rounded-xl bg-sky-50 p-4 dark:bg-sky-500/10">
                <div>
                  <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                    {selectedSeatData.id}
                  </p>

                  <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">
                    Seat selected
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white">
                  <Check className="h-5 w-5" />
                </div>
              </div>

              {selectedSeatData.price &&
                selectedSeatData.price > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Seat fee
                    </span>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatSeatPrice(
                        selectedSeatData.price,
                        currency,
                      )}
                    </span>
                  </div>
                )}
            </motion.div>
          ) : (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900">
              <Armchair className="mx-auto h-6 w-6 text-slate-400" />

              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                No seat selected
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Select an available seat from the
                seat map.
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-xs text-slate-400">
                Available
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {availableCount}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-xs text-slate-400">
                Occupied
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {occupiedCount}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}