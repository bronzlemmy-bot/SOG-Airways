"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Minus,
  Plane,
  Plus,
  Search,
  Users,
} from "lucide-react";

import type {
  BookingClass,
  BookingType,
} from "@/types/booking";

interface FlightSearchFormProps {
  initialTripType?: BookingType;
  initialFrom?: string;
  initialTo?: string;
  initialDepartureDate?: string;
  initialReturnDate?: string;
  initialPassengers?: number;
  initialCabinClass?: BookingClass;
  loading?: boolean;
  onSearch?: (data: FlightSearchData) => void;
}

export interface FlightSearchData {
  tripType: BookingType;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: BookingClass;
}

const CABIN_OPTIONS: {
  value: BookingClass;
  label: string;
}[] = [
  {
    value: "economy",
    label: "Economy",
  },
  {
    value: "premium-economy",
    label: "Premium Economy",
  },
  {
    value: "business",
    label: "Business",
  },
  {
    value: "first",
    label: "First Class",
  },
];

const TRIP_OPTIONS: {
  value: BookingType;
  label: string;
}[] = [
  {
    value: "one-way",
    label: "One Way",
  },
  {
    value: "round-trip",
    label: "Round Trip",
  },
  {
    value: "multi-city",
    label: "Multi City",
  },
];

export default function FlightSearchForm({
  initialTripType = "round-trip",
  initialFrom = "",
  initialTo = "",
  initialDepartureDate = "",
  initialReturnDate = "",
  initialPassengers = 1,
  initialCabinClass = "economy",
  loading = false,
  onSearch,
}: FlightSearchFormProps) {
  const [tripType, setTripType] =
    useState<BookingType>(initialTripType);

  const [from, setFrom] =
    useState(initialFrom);

  const [to, setTo] =
    useState(initialTo);

  const [departureDate, setDepartureDate] =
    useState(initialDepartureDate);

  const [returnDate, setReturnDate] =
    useState(initialReturnDate);

  const [passengers, setPassengers] =
    useState(Math.max(1, initialPassengers));

  const [cabinClass, setCabinClass] =
    useState<BookingClass>(
      initialCabinClass,
    );

  const handlePassengerChange = (
    amount: number,
  ) => {
    setPassengers((current) =>
      Math.min(
        9,
        Math.max(1, current + amount),
      ),
    );
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!from.trim() || !to.trim()) {
      return;
    }

    if (!departureDate) {
      return;
    }

    if (
      tripType === "round-trip" &&
      !returnDate
    ) {
      return;
    }

    onSearch?.({
      tripType,
      from: from.trim(),
      to: to.trim(),
      departureDate,
      returnDate:
        tripType === "round-trip"
          ? returnDate
          : undefined,
      passengers,
      cabinClass,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Trip Type */}
      <div className="flex flex-wrap gap-2">
        {TRIP_OPTIONS.map((option) => {
          const active =
            tripType === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setTripType(option.value)
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-sky-600 text-white shadow-sm dark:bg-sky-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Main Search Fields */}
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        {/* From */}
        <div>
          <label
            htmlFor="booking-from"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            From
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              id="booking-from"
              value={from}
              onChange={(event) =>
                setFrom(event.target.value)
              }
              placeholder="Departure airport"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center lg:pb-1">
          <button
            type="button"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap departure and arrival airports"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-sky-700 dark:hover:text-sky-400"
          >
            <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
          </button>
        </div>

        {/* To */}
        <div>
          <label
            htmlFor="booking-to"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            To
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              id="booking-to"
              value={to}
              onChange={(event) =>
                setTo(event.target.value)
              }
              placeholder="Arrival airport"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Dates and Passengers */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Departure */}
        <div>
          <label
            htmlFor="booking-departure-date"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Departure
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              id="booking-departure-date"
              type="date"
              value={departureDate}
              onChange={(event) =>
                setDepartureDate(
                  event.target.value,
                )
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Return */}
        <div>
          <label
            htmlFor="booking-return-date"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Return
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              id="booking-return-date"
              type="date"
              value={returnDate}
              disabled={
                tripType !== "round-trip"
              }
              onChange={(event) =>
                setReturnDate(
                  event.target.value,
                )
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900/50"
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Passengers
          </label>

          <div className="flex h-12 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-400" />

              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {passengers}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  handlePassengerChange(-1)
                }
                disabled={passengers <= 1}
                aria-label="Remove passenger"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
              >
                <Minus className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePassengerChange(1)
                }
                disabled={passengers >= 9}
                aria-label="Add passenger"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cabin */}
        <div>
          <label
            htmlFor="booking-cabin"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Cabin Class
          </label>

          <select
            id="booking-cabin"
            value={cabinClass}
            onChange={(event) =>
              setCabinClass(
                event.target
                  .value as BookingClass,
              )
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {CABIN_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:bg-sky-500 dark:hover:bg-sky-600"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search Flights
            </>
          )}
        </button>
      </div>

      {/* Mobile helper */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 lg:hidden">
        <Plane className="h-3.5 w-3.5" />
        Find your next SOG Airways journey
      </div>
    </motion.form>
  );
}