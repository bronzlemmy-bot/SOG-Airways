"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  UserPlus,
} from "lucide-react";

import type {
  Gender,
  PassengerType,
} from "@/types/passenger";

import PassengerForm, {
  type BookingPassengerFormData,
} from "./PassengerForm";

interface PassengerListProps {
  passengers: BookingPassengerFormData[];
  onChange?: (
    passengers: BookingPassengerFormData[],
  ) => void;
  maxPassengers?: number;
  disabled?: boolean;
}

const createPassenger = (
  index: number,
): BookingPassengerFormData => ({
  id: `passenger-${Date.now()}-${index}`,
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "prefer-not-to-say" as Gender,
  passengerType: "adult" as PassengerType,
  nationality: "",
  documentType: "passport",
  documentNumber: "",
  documentExpiryDate: "",
});

export default function PassengerList({
  passengers,
  onChange,
  maxPassengers = 9,
  disabled = false,
}: PassengerListProps) {
  const canAddPassenger =
    passengers.length < maxPassengers;

  const passengerCountLabel = useMemo(() => {
    return `${passengers.length} ${
      passengers.length === 1
        ? "passenger"
        : "passengers"
    }`;
  }, [passengers.length]);

  const handlePassengerChange = (
    updatedPassenger: BookingPassengerFormData,
  ) => {
    const updatedPassengers =
      passengers.map((passenger) =>
        passenger.id === updatedPassenger.id
          ? updatedPassenger
          : passenger,
      );

    onChange?.(updatedPassengers);
  };

  const handleAddPassenger = () => {
    if (!canAddPassenger || disabled) {
      return;
    }

    const newPassenger = createPassenger(
      passengers.length,
    );

    onChange?.([
      ...passengers,
      newPassenger,
    ]);
  };

  const handleRemovePassenger = (
    passengerId: string,
  ) => {
    if (disabled) {
      return;
    }

    const updatedPassengers =
      passengers.filter(
        (passenger) =>
          passenger.id !== passengerId,
      );

    onChange?.(updatedPassengers);
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                Passengers
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Passenger details
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Add the details for everyone
                travelling on this booking. Make
                sure the information matches each
                passenger&apos;s travel document.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900">
            <UserPlus className="h-4 w-4 text-slate-500 dark:text-slate-400" />

            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {passengerCountLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Passenger Forms */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {passengers.map(
            (passenger, index) => (
              <motion.div
                key={passenger.id}
                layout
                initial={{
                  opacity: 0,
                  y: 16,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <PassengerForm
                  passenger={passenger}
                  index={index}
                  onChange={
                    handlePassengerChange
                  }
                  onRemove={() =>
                    handleRemovePassenger(
                      passenger.id,
                    )
                  }
                  canRemove={
                    passengers.length > 1
                  }
                  disabled={disabled}
                />
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {passengers.length === 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
            <Users className="h-5 w-5" />
          </div>

          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
            No passengers added
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Add at least one passenger to continue
            with your booking.
          </p>
        </motion.div>
      )}

      {/* Add Passenger */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          You can add up to {maxPassengers}{" "}
          passengers to this booking.
        </p>

        <button
          type="button"
          onClick={handleAddPassenger}
          disabled={
            !canAddPassenger || disabled
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20 dark:disabled:border-slate-800 dark:disabled:bg-slate-900 dark:disabled:text-slate-600"
        >
          <Plus className="h-4 w-4" />

          {canAddPassenger
            ? "Add passenger"
            : "Passenger limit reached"}
        </button>
      </div>
    </section>
  );
}