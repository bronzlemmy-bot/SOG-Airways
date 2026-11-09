"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Armchair,
  Users,
  Banknote,
  MapPin,
  Hash,
  Luggage,
  RadioTower,
  Pencil,
  X,
  CircleAlert,
} from "lucide-react";
import type { Flight } from "@/types/flight";

import FlightStatusBadge from "./FlightStatusBadge";
import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface FlightDetailsProps {
  flight: Flight;
  onEdit?: (flight: Flight) => void;
  onClose?: () => void;
  className?: string;
}

function formatDate(value: string): string {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string): string {
  if (!value) return "Not specified";

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return value;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(2000, 0, 1, hours, minutes));
}

function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "Not specified";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} minutes`;
  if (remainingMinutes === 0) return `${hours} hours`;

  return `${hours}h ${remainingMinutes}m`;
}

function formatPrice(price: number, currency: string): string {
  if (!Number.isFinite(price)) return "Not specified";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency || ""} ${price.toLocaleString("en-NG")}`.trim();
  }
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="mt-1 wrap-break-words text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function FlightDetails({
  flight,
  onEdit,
  onClose,
  className = "",
}: FlightDetailsProps) {
  const isDelayed = flight.status === "delayed";
  const isCancelled = flight.status === "cancelled";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl"
        />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
              <Plane className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Flight details
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                {flight.flightNumber}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {flight.type === "international"
                  ? "International flight"
                  : "Domestic flight"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FlightStatusBadge status={flight.status} />
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close flight details"
                className="rounded-lg border border-white/15 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <div className="min-w-0">
            <PlaneTakeoff className="mb-3 h-5 w-5 text-sky-300" aria-hidden="true" />
            <p className="text-3xl font-bold sm:text-4xl">
              {flight.route.departureAirportCode}
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-300">
              {flight.route.departureAirportName}
            </p>
            <p className="mt-3 text-lg font-semibold">
              {formatTime(flight.schedule.departureTime)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {formatDate(flight.schedule.departureDate)}
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-2">
            <span className="text-xs font-medium text-slate-300">
              {formatDuration(flight.schedule.durationMinutes)}
            </span>
            <div className="flex w-full min-w-12 items-center">
              <div className="h-px flex-1 bg-slate-500" />
              <Plane className="mx-1 h-5 w-5 shrink-0 rotate-90 text-sky-300" aria-hidden="true" />
              <div className="h-px flex-1 bg-slate-500" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">
              {flight.type}
            </span>
          </div>

          <div className="min-w-0 text-right">
            <PlaneLanding className="mb-3 ml-auto h-5 w-5 text-sky-300" aria-hidden="true" />
            <p className="text-3xl font-bold sm:text-4xl">
              {flight.route.arrivalAirportCode}
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-300">
              {flight.route.arrivalAirportName}
            </p>
            <p className="mt-3 text-lg font-semibold">
              {formatTime(flight.schedule.arrivalTime)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {formatDate(flight.schedule.arrivalDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {(isDelayed || isCancelled) && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              isCancelled
                ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200"
                : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
            }`}
          >
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                {isCancelled ? "Flight cancelled" : "Flight delayed"}
              </p>
              <p className="mt-1 text-sm">
                {isCancelled
                  ? flight.cancellationReason || "No cancellation reason provided."
                  : flight.delayReason || "No delay reason provided."}
                {isDelayed && flight.delayMinutes
                  ? ` Estimated delay: ${flight.delayMinutes} minutes.`
                  : ""}
              </p>
            </div>
          </div>
        )}

        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Flight information
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              icon={<Hash className="h-4 w-4" />}
              label="Flight ID"
              value={flight.id}
            />
            <DetailItem
              icon={<Plane className="h-4 w-4" />}
              label="Aircraft ID"
              value={flight.aircraftId}
            />
            <DetailItem
              icon={<Plane className="h-4 w-4" />}
              label="Aircraft registration"
              value={flight.aircraftRegistration || "Not assigned"}
            />
            <DetailItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Flight type"
              value={flight.type}
            />
            <DetailItem
              icon={<Clock3 className="h-4 w-4" />}
              label="Flight duration"
              value={formatDuration(flight.schedule.durationMinutes)}
            />
            <DetailItem
              icon={<Banknote className="h-4 w-4" />}
              label="Base fare"
              value={formatPrice(flight.price, flight.currency)}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Operational details
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Terminal"
              value={flight.terminal || "Not assigned"}
            />
            <DetailItem
              icon={<RadioTower className="h-4 w-4" />}
              label="Departure gate"
              value={flight.departureGate || "Not assigned"}
            />
            <DetailItem
              icon={<ArrowRight className="h-4 w-4" />}
              label="Arrival gate"
              value={flight.arrivalGate || "Not assigned"}
            />
            <DetailItem
              icon={<Luggage className="h-4 w-4" />}
              label="Baggage claim"
              value={flight.baggageClaim || "Not assigned"}
            />
            <DetailItem
              icon={<Users className="h-4 w-4" />}
              label="Seat capacity"
              value={`${flight.availableSeats.toLocaleString()} available of ${flight.totalSeats.toLocaleString()}`}
            />
            <DetailItem
              icon={<Armchair className="h-4 w-4" />}
              label="Cabin classes"
              value={
                flight.cabinClasses.length
                  ? flight.cabinClasses
                      .map((item) => item.replaceAll("-", " "))
                      .join(", ")
                  : "Not specified"
              }
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Record timestamps
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Created at"
              value={formatDate(flight.createdAt)}
            />
            <DetailItem
              icon={<Clock3 className="h-4 w-4" />}
              label="Last updated"
              value={formatDate(flight.updatedAt)}
            />
          </div>
        </section>

        {onEdit && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            {onClose && (
              <OutlineButton
                type="button"
                onClick={onClose}
                className="justify-center"
              >
                Close
              </OutlineButton>
            )}
            <PrimaryButton
              type="button"
              onClick={() => onEdit(flight)}
              disabled={
                flight.status === "departed" ||
                flight.status === "in-air" ||
                flight.status === "landed"
              }
              className="justify-center"
            >
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Edit Flight
            </PrimaryButton>
          </div>
        )}
      </div>
    </motion.section>
  );
}