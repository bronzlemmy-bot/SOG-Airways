"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  RefreshCw,
  Wallet,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Badge from "@/components/ui/Badge";

export interface ChangeFlightOption {
  id: string;
  flightNumber: string;
  airline: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  cabinClass: string;
  price: number;
  currency: string;
  seatsAvailable: number;
}

export interface ChangeFlightRequest {
  currentFlightId: string;
  replacementFlightId: string;
  fareDifference: number;
  currency: string;
}

interface ChangeFlightFormProps {
  bookingReference?: string;
  currentFlightId?: string;
  currentFlight?: ChangeFlightOption;
  availableFlights?: ChangeFlightOption[];
  currency?: string;
  onSubmit?: (request: ChangeFlightRequest) => void | Promise<void>;
  onCancel?: () => void;
}

const MOCK_CURRENT_FLIGHT: ChangeFlightOption = {
  id: "SOG-FLT-101",
  flightNumber: "SOG 101",
  airline: "SOG Airways",
  departureAirportCode: "LOS",
  departureAirportName: "Murtala Muhammed International Airport",
  arrivalAirportCode: "ABV",
  arrivalAirportName: "Nnamdi Azikiwe International Airport",
  departureDate: "2026-11-14",
  departureTime: "08:30",
  arrivalDate: "2026-11-14",
  arrivalTime: "09:45",
  duration: "1h 15m",
  cabinClass: "Economy",
  price: 95000,
  currency: "NGN",
  seatsAvailable: 0,
};

const MOCK_AVAILABLE_FLIGHTS: ChangeFlightOption[] = [
  {
    id: "SOG-FLT-201",
    flightNumber: "SOG 201",
    airline: "SOG Airways",
    departureAirportCode: "LOS",
    departureAirportName: "Murtala Muhammed International Airport",
    arrivalAirportCode: "ABV",
    arrivalAirportName: "Nnamdi Azikiwe International Airport",
    departureDate: "2026-11-14",
    departureTime: "11:00",
    arrivalDate: "2026-11-14",
    arrivalTime: "12:15",
    duration: "1h 15m",
    cabinClass: "Economy",
    price: 102000,
    currency: "NGN",
    seatsAvailable: 18,
  },
  {
    id: "SOG-FLT-202",
    flightNumber: "SOG 202",
    airline: "SOG Airways",
    departureAirportCode: "LOS",
    departureAirportName: "Murtala Muhammed International Airport",
    arrivalAirportCode: "ABV",
    arrivalAirportName: "Nnamdi Azikiwe International Airport",
    departureDate: "2026-11-14",
    departureTime: "14:30",
    arrivalDate: "2026-11-14",
    arrivalTime: "15:45",
    duration: "1h 15m",
    cabinClass: "Economy",
    price: 88000,
    currency: "NGN",
    seatsAvailable: 9,
  },
  {
    id: "SOG-FLT-203",
    flightNumber: "SOG 203",
    airline: "SOG Airways",
    departureAirportCode: "LOS",
    departureAirportName: "Murtala Muhammed International Airport",
    arrivalAirportCode: "ABV",
    arrivalAirportName: "Nnamdi Azikiwe International Airport",
    departureDate: "2026-11-14",
    departureTime: "17:15",
    arrivalDate: "2026-11-14",
    arrivalTime: "18:30",
    duration: "1h 15m",
    cabinClass: "Economy",
    price: 115000,
    currency: "NGN",
    seatsAvailable: 4,
  },
];

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

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function ChangeFlightForm({
  bookingReference,
  currentFlightId,
  currentFlight,
  availableFlights,
  currency = "NGN",
  onSubmit,
  onCancel,
}: ChangeFlightFormProps) {
  const originalFlight = currentFlight ?? MOCK_CURRENT_FLIGHT;
  const flights = availableFlights ?? MOCK_AVAILABLE_FLIGHTS;

  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedFlight = flights.find(
    (flight) => flight.id === selectedFlightId,
  );

  const fareDifference = useMemo(() => {
    if (!selectedFlight) return 0;
    return selectedFlight.price - originalFlight.price;
  }, [selectedFlight, originalFlight.price]);

  const selectableFlights = flights.filter(
    (flight) =>
      flight.id !== (currentFlightId ?? originalFlight.id) &&
      flight.seatsAvailable > 0,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!selectedFlight) {
      setError("Please select an available replacement flight.");
      return;
    }

    if (selectedFlight.currency !== originalFlight.currency) {
      setError(
        "The current and replacement flights use different currencies. Please contact support.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.({
        currentFlightId: currentFlightId ?? originalFlight.id,
        replacementFlightId: selectedFlight.id,
        fareDifference,
        currency: originalFlight.currency || currency,
      });

      setSuccess(true);
    } catch {
      setError(
        "We couldn't submit your flight-change request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="info">Flight changes</Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Find a flight that suits you
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Compare alternative flights on your existing route and review
              any fare difference before submitting your request.
            </p>
            {bookingReference && (
              <p className="mt-4 text-sm text-blue-200">
                Booking reference:{" "}
                <span className="font-semibold text-white">
                  {bookingReference}
                </span>
              </p>
            )}
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <RefreshCw className="h-9 w-9" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <Plane className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current flight
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {originalFlight.flightNumber}
              </h3>
              <Badge variant="default">{originalFlight.cabinClass}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {originalFlight.departureAirportCode}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {originalFlight.departureAirportName}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {formatDate(originalFlight.departureDate)} ·{" "}
                  {originalFlight.departureTime}
                </p>
              </div>

              <ArrowRight className="hidden h-5 w-5 text-slate-400 sm:block" />

              <div className="sm:text-right">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {originalFlight.arrivalAirportCode}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {originalFlight.arrivalAirportName}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {formatDate(originalFlight.arrivalDate)} ·{" "}
                  {originalFlight.arrivalTime}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {originalFlight.duration}
              </span>
              <span className="inline-flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Original fare: {formatMoney(originalFlight.price, originalFlight.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Available replacement flights
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select one flight to compare its fare with your current booking.
          </p>
        </div>

        {selectableFlights.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <Plane className="mx-auto h-8 w-8 text-slate-400" />
            <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">
              No alternative flights available
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try again later or contact SOG Airways support for assistance.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectableFlights.map((flight, index) => {
              const isSelected = selectedFlightId === flight.id;
              const difference = flight.price - originalFlight.price;

              return (
                <motion.label
                  key={flight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className={`block cursor-pointer rounded-2xl border bg-white p-4 transition dark:bg-slate-900 sm:p-5 ${
                    isSelected
                      ? "border-sky-500 ring-2 ring-sky-500/15"
                      : "border-slate-200 hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="replacementFlight"
                      value={flight.id}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedFlightId(flight.id);
                        setError("");
                        setSuccess(false);
                      }}
                      className="mt-1 h-4 w-4 accent-sky-600"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">
                              {flight.flightNumber}
                            </h4>
                            <Badge variant="default">{flight.cabinClass}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {flight.airline}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {formatMoney(flight.price, flight.currency)}
                          </p>
                          <p
                            className={`mt-1 text-sm font-medium ${
                              difference > 0
                                ? "text-amber-600 dark:text-amber-400"
                                : difference < 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {difference > 0
                              ? `Pay ${formatMoney(difference, flight.currency)} more`
                              : difference < 0
                                ? `Save ${formatMoney(Math.abs(difference), flight.currency)}`
                                : "No fare difference"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                        <div>
                          <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {flight.departureTime}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {flight.departureAirportCode}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(flight.departureDate)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-col">
                          <ArrowRight className="h-4 w-4 sm:rotate-0" />
                          <span>{flight.duration}</span>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {flight.arrivalTime}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {flight.arrivalAirportCode}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(flight.arrivalDate)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <CalendarDays className="h-4 w-4" />
                        {flight.seatsAvailable} seats shown as available in this demo
                      </div>
                    </div>
                  </div>
                </motion.label>
              );
            })}
          </div>
        )}

        {selectedFlight && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40">
            <div className="flex items-start gap-3">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Fare difference summary
                </h4>
                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Replacement flight fare
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatMoney(selectedFlight.price, selectedFlight.currency)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Current flight fare
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    − {formatMoney(originalFlight.price, originalFlight.currency)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-sky-200 pt-3 dark:border-sky-900">
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {fareDifference > 0
                      ? "Additional amount"
                      : fareDifference < 0
                        ? "Potential savings"
                        : "Fare difference"}
                  </span>
                  <span className="text-lg font-bold text-slate-950 dark:text-white">
                    {fareDifference > 0
                      ? formatMoney(fareDifference, selectedFlight.currency)
                      : fareDifference < 0
                        ? formatMoney(Math.abs(fareDifference), selectedFlight.currency)
                        : formatMoney(0, selectedFlight.currency)}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  Sample development fares only. Final changes, penalties,
                  refunds, and taxes must be confirmed by the airline.
                </p>
              </div>
            </div>
          </div>
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
              <p className="font-semibold">Request submitted</p>
              <p className="mt-1">
                Your flight-change request has been recorded for this frontend
                preview. Your booking isnt&apos changed until the request is
                processed by the airline.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {onCancel && (
            <OutlineButton type="button" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </OutlineButton>
          )}
          <PrimaryButton
            type="submit"
            disabled={!selectedFlight || isSubmitting || selectableFlights.length === 0}
            loading={isSubmitting}
          >
            {isSubmitting ? "Submitting request..." : "Request flight change"}
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}