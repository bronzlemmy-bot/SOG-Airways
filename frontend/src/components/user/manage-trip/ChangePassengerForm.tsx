"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
Check,
UserRound,
UserRoundPen,
X,
} from "lucide-react";

import type { ManageTripPassenger } from "./manage-trip-data/ManageTripData";

interface ChangePassengerFormProps {
passengers: ManageTripPassenger[];
onCancel?: () => void;
onSubmit?: (passenger: ManageTripPassenger) => void;
}

export default function ChangePassengerForm({
passengers,
onCancel,
onSubmit,
}: ChangePassengerFormProps) {
const [selectedPassengerId, setSelectedPassengerId] =
useState<string>(passengers[0]?.id ?? "");

const [title, setTitle] = useState<string>(
passengers[0]?.title ?? "Mr",
);

const [firstName, setFirstName] = useState<string>(
passengers[0]?.firstName ?? "",
);

const [lastName, setLastName] = useState<string>(
passengers[0]?.lastName ?? "",
);

const [error, setError] = useState<string>("");

const handlePassengerChange = (id: string) => {
const passenger = passengers.find(
(item) => item.id === id,
);


if (!passenger) {
  return;
}

setSelectedPassengerId(passenger.id);
setTitle(passenger.title);
setFirstName(passenger.firstName);
setLastName(passenger.lastName);
setError("");


};

const handleSubmit = (
event: FormEvent<HTMLFormElement>,
) => {
event.preventDefault();


if (!selectedPassengerId) {
  setError("Please select a passenger.");
  return;
}

if (!firstName.trim()) {
  setError("Please enter the passenger's first name.");
  return;
}

if (!lastName.trim()) {
  setError("Please enter the passenger's last name.");
  return;
}

const passenger = passengers.find(
  (item) => item.id === selectedPassengerId,
);

if (!passenger) {
  setError("Passenger information could not be found.");
  return;
}

setError("");

onSubmit?.({
  ...passenger,
  title,
  firstName: firstName.trim(),
  lastName: lastName.trim(),
});


};

return (
<motion.div
initial={{ opacity: 0, y: 20, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 20, scale: 0.98 }}
transition={{ duration: 0.25 }}
className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
> <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6"> <div> <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"> <UserRoundPen className="h-4 w-4" />
Change Passenger </div>


      <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Update passenger details
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Select a passenger and update their booking
        information.
      </p>
    </div>

    <button
      type="button"
      onClick={onCancel}
      aria-label="Close change passenger form"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <X className="h-5 w-5" />
    </button>
  </div>

  <form
    onSubmit={handleSubmit}
    className="space-y-6 p-5 sm:p-6"
  >
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Select passenger
        </h3>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Choose the passenger whose details you want to
          update.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {passengers.map((passenger) => {
          const isSelected =
            passenger.id === selectedPassengerId;

          return (
            <button
              key={passenger.id}
              type="button"
              onClick={() =>
                handlePassengerChange(passenger.id)
              }
              className={
                isSelected
                  ? "flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-50 p-4 text-left transition dark:border-white dark:bg-slate-800"
                  : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              }
            >
              <span
                className={
                  isSelected
                    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }
              >
                <UserRound className="h-5 w-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-slate-900 dark:text-white">
                  {passenger.title} {passenger.firstName}{" "}
                  {passenger.lastName}
                </span>

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {passenger.type} · Seat {passenger.seat}
                </span>
              </span>

              {isSelected ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Check className="h-4 w-4" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>

    <section>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Passenger information
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Title
          </span>

          <select
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
          >
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            First name
          </span>

          <input
            type="text"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            placeholder="First name"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Last name
          </span>

          <input
            type="text"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            placeholder="Last name"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
        </label>
      </div>
    </section>

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
