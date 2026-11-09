"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
Armchair,
Check,
Info,
X,
} from "lucide-react";

interface SeatChangeFormProps {
currentSeat: string;
onCancel?: () => void;
onSubmit?: (seat: string) => void;
}

const seatRows = [
{
row: 10,
seats: ["10A", "10B", "10C", "10D", "10E", "10F"],
},
{
row: 11,
seats: ["11A", "11B", "11C", "11D", "11E", "11F"],
},
{
row: 12,
seats: ["12A", "12B", "12C", "12D", "12E", "12F"],
},
{
row: 13,
seats: ["13A", "13B", "13C", "13D", "13E", "13F"],
},
{
row: 14,
seats: ["14A", "14B", "14C", "14D", "14E", "14F"],
},
];

const unavailableSeats = ["10C", "11D", "12C", "13A", "14F"];

export default function SeatChangeForm({
currentSeat,
onCancel,
onSubmit,
}: SeatChangeFormProps) {
const [selectedSeat, setSelectedSeat] =
useState<string>(currentSeat);

const [error, setError] = useState<string>("");

const handleSeatSelect = (seat: string) => {
if (unavailableSeats.includes(seat)) {
return;
}


setSelectedSeat(seat);
setError("");

};

const handleSubmit = (
event: FormEvent<HTMLFormElement>,
) => {
event.preventDefault();


if (!selectedSeat) {
  setError("Please select a seat.");
  return;
}

if (selectedSeat === currentSeat) {
  setError("Please select a different seat.");
  return;
}

setError("");
onSubmit?.(selectedSeat);


};

return (
<motion.div
initial={{ opacity: 0, y: 20, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 20, scale: 0.98 }}
transition={{ duration: 0.25 }}
className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6"> <div> <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"> <Armchair className="h-4 w-4" />
Change Seat </div>


      <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Select your seat
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose an available seat for your flight.
      </p>
    </div>

    <button
      type="button"
      onClick={onCancel}
      aria-label="Close seat selection"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <X className="h-5 w-5" />
    </button>
  </div>

  <form
    onSubmit={handleSubmit}
    className="space-y-6 p-5 sm:p-6"
  >
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="h-4 w-4 rounded-md border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900" />
        Available
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="h-4 w-4 rounded-md bg-slate-900 dark:bg-white" />
        Selected
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="h-4 w-4 rounded-md bg-slate-300 dark:bg-slate-700" />
        Unavailable
      </div>
    </div>

    <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800 sm:p-6">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-10 w-20 items-center justify-center rounded-b-2xl bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          FRONT
        </div>
      </div>

      <div className="space-y-3">
        {seatRows.map((row) => (
          <div
            key={row.row}
            className="grid grid-cols-[32px_1fr_1fr_20px_1fr_1fr] items-center gap-2 sm:gap-3"
          >
            <span className="text-center text-xs font-bold text-slate-400">
              {row.row}
            </span>

            {row.seats.map((seat, index) => {
              const isUnavailable =
                unavailableSeats.includes(seat);

              const isSelected =
                selectedSeat === seat;

              const isAisle = index === 2;

              return (
                <div
                  key={seat}
                  className={
                    isAisle
                      ? "contents"
                      : undefined
                  }
                >
                  {isAisle ? (
                    <span className="block" />
                  ) : null}

                  <button
                    type="button"
                    disabled={isUnavailable}
                    onClick={() =>
                      handleSeatSelect(seat)
                    }
                    className={
                      isUnavailable
                        ? "relative flex h-11 items-center justify-center rounded-xl bg-slate-300 text-slate-500 opacity-70 dark:bg-slate-700 dark:text-slate-500"
                        : isSelected
                          ? "relative flex h-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                          : "relative flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                    }
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Armchair className="h-4 w-4" />
                    )}

                    <span className="sr-only">
                      {seat}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          Selected seat
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {selectedSeat || "No seat selected"}
        </p>
      </div>
    </div>

    <AnimatePresence>
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </motion.div>
      ) : null}
    </AnimatePresence>

    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Continue
      </button>
    </div>
  </form>
</motion.div>


);
}
