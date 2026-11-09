"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
CalendarDays,
CheckCircle2,
Clock3,
Plane,
X,
} from "lucide-react";

import type { ManageTripFlight } from "./manage-trip-data/ManageTripData";

interface ChangeFlightFormProps {
flight: ManageTripFlight;
onCancel?: () => void;
onSubmit?: (data: {
flightNumber: string;
departureDate: string;
cabinClass: string;
}) => void;
}

const flightOptions = [
{
flightNumber: "SOG 204",
route: "Lagos → London",
time: "10:30 AM – 5:20 PM",
duration: "7h 50m",
},
{
flightNumber: "SOG 208",
route: "Lagos → London",
time: "2:15 PM – 9:05 PM",
duration: "7h 50m",
},
{
flightNumber: "SOG 212",
route: "Lagos → London",
time: "8:45 PM – 3:35 AM",
duration: "7h 50m",
},
];

export default function ChangeFlightForm({
flight,
onCancel,
onSubmit,
}: ChangeFlightFormProps) {
const [selectedFlight, setSelectedFlight] = useState(
flight.flightNumber,
);

const [departureDate, setDepartureDate] = useState(
"2026-10-15",
);

const [cabinClass, setCabinClass] = useState(
flight.cabinClass,
);

const [error, setError] = useState("");

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


if (!selectedFlight || !departureDate || !cabinClass) {
  setError("Please complete all required fields.");
  return;
}

setError("");

onSubmit?.({
  flightNumber: selectedFlight,
  departureDate,
  cabinClass,
});


};

return (
<motion.div
initial={{ opacity: 0, scale: 0.97, y: 12 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.97, y: 12 }}
transition={{ duration: 0.25 }}
className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6"> <div> <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400"> <Plane className="h-4 w-4" />
Change Flight </div>


      <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        Choose a new flight
      </h2>

      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Select your preferred flight and travel date.
      </p>
    </div>

    <button
      type="button"
      onClick={onCancel}
      aria-label="Close change flight form"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <X className="h-5 w-5" />
    </button>
  </div>

  <form onSubmit={handleSubmit} className="p-5 sm:p-6">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          New departure date
        </span>

        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="date"
            value={departureDate}
            min="2026-09-25"
            onChange={(event) =>
              setDepartureDate(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Cabin class
        </span>

        <select
          value={cabinClass}
          onChange={(event) =>
            setCabinClass(event.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
        >
          <option value="Economy">Economy</option>
          <option value="Premium Economy">
            Premium Economy
          </option>
          <option value="Business">Business</option>
          <option value="First Class">First Class</option>
        </select>
      </label>
    </div>

    <div className="mt-6">
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          Available flights
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Select one flight for your new itinerary.
        </p>
      </div>

      <div className="space-y-3">
        {flightOptions.map((option) => {
          const selected =
            selectedFlight === option.flightNumber;

          return (
            <motion.button
              key={option.flightNumber}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() =>
                setSelectedFlight(option.flightNumber)
              }
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-slate-900 bg-slate-50 shadow-sm dark:border-white dark:bg-slate-800"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <Plane className="h-5 w-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {option.flightNumber}
                  </span>

                  {option.flightNumber ===
                    flight.flightNumber && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                      Current
                    </span>
                  )}
                </span>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {option.route}
                </span>

                <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Clock3 className="h-3.5 w-3.5" />
                  {option.time}
                </span>
              </span>

              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {selected && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>

    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>

    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
