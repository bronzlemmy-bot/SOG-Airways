
"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Hash,
  MapPin,
  Plane,
  Users,
} from "lucide-react";

import type { Trip, TripStatus, TripType } from "@/types";
import Modal from "@/components/modals/Modal";

interface TripDetailsProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (trip: Trip) => void;
  onCancel?: (trip: Trip) => void;
}

const STATUS_STYLES: Record<
  TripStatus,
  { label: string; className: string }
> = {
  upcoming: {
    label: "Upcoming",
    className:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900",
  },
  "in-progress": {
    label: "In Progress",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
  },
  completed: {
    label: "Completed",
    className:
      "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900",
  },
};

const TYPE_LABELS: Record<TripType, string> = {
  "one-way": "One-way",
  "round-trip": "Round trip",
  "multi-city": "Multi-city",
};

function formatDate(value?: string): string {
  if (!value) return "Not provided";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(
  date?: string,
  time?: string,
): string {
  const formattedDate = formatDate(date);

  return time
    ? `${formattedDate} · ${time}`
    : formattedDate;
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Plane;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
      <span className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
        <Icon size={17} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TripDetails({
  trip,
  isOpen,
  onClose,
  onEdit,
  onCancel,
}: TripDetailsProps) {
  if (!trip) return null;

  const status = STATUS_STYLES[trip.status];

  const canCancel =
    trip.status !== "cancelled" &&
    trip.status !== "completed";

  const firstSegment = trip.segments[0];
  const lastSegment =
    trip.segments[trip.segments.length - 1];

  const heading =
    trip.title?.trim() ||
    trip.destination?.trim() ||
    "Trip details";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={heading}
      description={`Trip details for booking ${trip.bookingReference || "reference unavailable"}.`}
      size="xl"
      showCloseButton
      closeOnOverlayClick
    >
      <div className="space-y-6">
        {/* Trip summary */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-5 text-white sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                <Plane size={14} aria-hidden="true" />
                {TYPE_LABELS[trip.type]}
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {heading}
              </h3>

              <p className="mt-2 text-sm text-blue-100/80">
                Booking reference:{" "}
                <span className="font-semibold text-white">
                  {trip.bookingReference || "Not provided"}
                </span>
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {firstSegment && lastSegment && (
            <div className="mt-7 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-t border-white/15 pt-6">
              <div className="min-w-0">
                <p className="text-3xl font-extrabold sm:text-4xl">
                  {firstSegment.departureAirportCode || "—"}
                </p>
                <p className="mt-2 text-xs leading-5 text-blue-100/80">
                  {firstSegment.departureAirportName ||
                    "Departure airport"}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 text-blue-200">
                <Plane size={19} aria-hidden="true" />
                <div className="flex items-center">
                  <span className="h-px w-5 bg-blue-200/60" />
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
                <span className="text-[10px] font-medium">
                  {trip.segments.length}{" "}
                  {trip.segments.length === 1
                    ? "segment"
                    : "segments"}
                </span>
              </div>

              <div className="min-w-0 text-right">
                <p className="text-3xl font-extrabold sm:text-4xl">
                  {lastSegment.arrivalAirportCode || "—"}
                </p>
                <p className="mt-2 text-xs leading-5 text-blue-100/80">
                  {lastSegment.arrivalAirportName ||
                    trip.destination ||
                    "Arrival airport"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* General information */}
        <section>
          <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
            Trip information
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              icon={Hash}
              label="Trip ID"
              value={trip.id}
            />

            <DetailItem
              icon={Hash}
              label="Booking ID"
              value={trip.bookingId || "Not provided"}
            />

            <DetailItem
              icon={CalendarDays}
              label="Start date"
              value={formatDate(trip.startDate)}
            />

            <DetailItem
              icon={CalendarDays}
              label="End date"
              value={formatDate(trip.endDate)}
            />

            <DetailItem
              icon={Users}
              label="Passengers"
              value={`${trip.passengerCount} ${
                trip.passengerCount === 1
                  ? "passenger"
                  : "passengers"
              }`}
            />

            <DetailItem
              icon={MapPin}
              label="Destination"
              value={trip.destination || "Not provided"}
            />
          </div>
        </section>

        {/* Flight segments */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white">
              Flight segments
            </h4>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {trip.segments.length}{" "}
              {trip.segments.length === 1
                ? "flight"
                : "flights"}
            </span>
          </div>

          {trip.segments.length > 0 ? (
            <div className="space-y-3">
              {trip.segments.map((segment, index) => {
                const segmentStatus =
                  STATUS_STYLES[segment.status];

                return (
                  <article
                    key={segment.id}
                    className="relative rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          <Plane
                            size={18}
                            aria-hidden="true"
                          />
                        </span>

                        <div>
                          <p className="font-bold text-slate-950 dark:text-white">
                            {segment.flightNumber ||
                              "Flight number unavailable"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Segment {index + 1}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${segmentStatus.className}`}
                      >
                        {segmentStatus.label}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Departure
                        </p>

                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {segment.departureAirportCode || "—"}
                        </p>

                        <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
                          {segment.departureAirportName ||
                            "Airport not provided"}
                        </p>

                        <p className="mt-2 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <CalendarDays
                            size={14}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {formatDateTime(
                              segment.departureDate,
                              segment.departureTime,
                            )}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Arrival
                        </p>

                        <p className="mt-1 font-bold text-slate-900 dark:text-white">
                          {segment.arrivalAirportCode || "—"}
                        </p>

                        <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
                          {segment.arrivalAirportName ||
                            "Airport not provided"}
                        </p>

                        <p className="mt-2 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock3
                            size={14}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {formatDateTime(
                              segment.arrivalDate,
                              segment.arrivalTime,
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center dark:border-slate-700">
              <Plane
                size={25}
                className="mx-auto text-slate-400"
                aria-hidden="true"
              />

              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                No flight segments available
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Flight details have not been added to this trip.
              </p>
            </div>
          )}
        </section>

        {/* Record timestamps */}
        <section className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:grid-cols-2">
          <p>
            Created: {formatDate(trip.createdAt)}
          </p>
          <p className="sm:text-right">
            Last updated: {formatDate(trip.updatedAt)}
          </p>
        </section>

        {/* Actions */}
        {(onEdit || (onCancel && canCancel)) && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Close
            </button>

            {onCancel && canCancel && (
              <button
                type="button"
                onClick={() => onCancel(trip)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                Cancel trip
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(trip)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Edit trip
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
