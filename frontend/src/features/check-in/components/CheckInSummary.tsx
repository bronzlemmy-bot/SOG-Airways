"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plane,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import InfoCard from "@/components/cards/InfoCard";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

import type { CheckIn, CheckInPassenger } from "@/types";

interface CheckInSummaryProps {
  checkIn: CheckIn;
  passengers?: CheckInPassenger[];
  airline?: string;
  departureAirport?: string;
  departureCity?: string;
  arrivalAirport?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  flightDate?: string;
  onContinue?: () => void;
  onBack?: () => void;
  onSelectPassenger?: (passenger: CheckInPassenger) => void;
  loading?: boolean;
  className?: string;
}

function formatDate(value?: string) {
  if (!value) return "To be confirmed";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value?: string) {
  if (!value) return "To be confirmed";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getStatusVariant(
  status: CheckIn["status"],
): "default" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "checked-in":
      return "success";
    case "in-progress":
      return "info";
    case "cancelled":
      return "danger";
    default:
      return "warning";
  }
}

function formatStatus(status: string) {
  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export default function CheckInSummary({
  checkIn,
  passengers,
  airline = "SOG Airways",
  departureAirport,
  departureCity,
  arrivalAirport,
  arrivalCity,
  departureTime,
  arrivalTime,
  flightDate,
  onContinue,
  onBack,
  onSelectPassenger,
  loading = false,
  className = "",
}: CheckInSummaryProps) {
  const displayedPassengers = passengers ?? checkIn.passengers;
  const checkedInCount = displayedPassengers.filter(
    (passenger) => passenger.checkedIn,
  ).length;

  const canContinue =
    checkIn.status !== "cancelled" &&
    checkedInCount < displayedPassengers.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              <Ticket className="h-3.5 w-3.5" />
              Booking summary
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Review your trip
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Confirm your flight and passenger details
              before continuing with online check-in.
            </p>
          </div>

          <Badge variant={getStatusVariant(checkIn.status)}>
            {formatStatus(checkIn.status)}
          </Badge>
        </div>

        {/* Flight route */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <div className="bg-linear-to-r from-slate-950 via-slate-900 to-sky-950 px-5 py-6 text-white sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Plane className="h-4 w-4" />
                {airline}
              </div>

              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
                Flight {checkIn.flightNumber}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
              <div className="min-w-0">
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {departureAirport || "—"}
                </p>
                <p className="mt-2 truncate text-sm text-white/65">
                  {departureCity || "Departure"}
                </p>
                <p className="mt-4 text-lg font-semibold">
                  {formatTime(departureTime)}
                </p>
              </div>

              <div className="flex min-w-16 flex-col items-center gap-2 sm:min-w-28">
                <Plane className="h-5 w-5 text-sky-300" />
                <div className="relative flex w-full items-center">
                  <div className="h-px w-full border-t border-dashed border-white/35" />
                  <MapPin className="absolute right-0 h-4 w-4 text-sky-300" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/55">
                  Route
                </span>
              </div>

              <div className="min-w-0 text-right">
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {arrivalAirport || "—"}
                </p>
                <p className="mt-2 truncate text-sm text-white/65">
                  {arrivalCity || "Arrival"}
                </p>
                <p className="mt-4 text-lg font-semibold">
                  {formatTime(arrivalTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-slate-50 p-5 sm:grid-cols-3 sm:px-8 sm:py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Flight date</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(flightDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Check-in status</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatStatus(checkIn.status)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Baggage count</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {checkIn.baggageCount ?? 0} bag(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            title="Booking reference"
            description="Use this reference when managing your reservation."
            icon={<Ticket className="h-4 w-4" />}
          >
            <p className="text-xl font-bold tracking-widest text-slate-900">
              {checkIn.bookingReference}
            </p>
          </InfoCard>

          <InfoCard
            title="Passenger progress"
            description="Your check-in progress for this booking."
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            <div className="flex items-end justify-between gap-3">
              <p className="text-xl font-bold text-slate-900">
                {checkedInCount} of {displayedPassengers.length}
              </p>
              <p className="text-xs font-medium text-slate-500">
                Checked in
              </p>
            </div>

            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={displayedPassengers.length}
              aria-valuenow={checkedInCount}
              aria-label="Passenger check-in progress"
            >
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{
                  width: `${
                    displayedPassengers.length
                      ? (checkedInCount /
                          displayedPassengers.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </InfoCard>
        </div>

        {/* Passengers */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Passengers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a passenger to continue their check-in.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {displayedPassengers.length} passenger(s)
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {displayedPassengers.map((passenger) => {
              const fullName =
                `${passenger.firstName} ${passenger.lastName}`.trim();

              return (
                <div
                  key={passenger.passengerId}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {fullName || "Passenger"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {passenger.seatNumber
                          ? `Seat ${passenger.seatNumber}`
                          : "Seat not selected"}
                        {" · "}
                        {passenger.seatClass
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1),
                          )
                          .join(" ")}
                      </p>

                      {passenger.boardingPassIssued && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Boarding pass issued
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant={
                        passenger.checkedIn ? "success" : "warning"
                      }
                    >
                      {passenger.checkedIn
                        ? "Checked in"
                        : "Not checked in"}
                    </Badge>

                    {onSelectPassenger && (
                      <OutlineButton
                        type="button"
                        onClick={() => onSelectPassenger(passenger)}
                        disabled={loading || passenger.checkedIn}
                      >
                        {passenger.checkedIn
                          ? "Completed"
                          : "Select passenger"}
                      </OutlineButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notice */}
        {checkIn.status === "cancelled" ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
          >
            This check-in has been cancelled. Please contact
            SOG Airways support for assistance.
          </div>
        ) : checkedInCount === displayedPassengers.length &&
          displayedPassengers.length > 0 ? (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">
                All passengers are checked in
              </p>
              <p className="mt-1 text-sm leading-5 text-emerald-800">
                Your booking is ready. Make sure each passenger
                has their boarding pass before travelling.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
            <div>
              <p className="font-semibold text-sky-950">
                Before you continue
              </p>
              <p className="mt-1 text-sm leading-5 text-sky-800">
                Check that every passenger name matches their
                travel document. Seat availability and check-in
                eligibility must be confirmed by the check-in
                workflow.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {onBack ? (
            <OutlineButton
              type="button"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </OutlineButton>
          ) : (
            <span />
          )}

          {onContinue && (
            <PrimaryButton
              type="button"
              onClick={onContinue}
              disabled={loading || !canContinue}
              loading={loading}
            >
              Continue Check-in
              <ArrowRight className="ml-2 h-4 w-4" />
            </PrimaryButton>
          )}
        </div>
      </div>
    </motion.section>
  );
}
