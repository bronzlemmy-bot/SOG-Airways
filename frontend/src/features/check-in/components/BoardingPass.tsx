"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Armchair,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  DoorOpen,
  Plane,
  QrCode,
  Ticket,
  UserRound,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import InfoCard from "@/components/cards/InfoCard";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

import type {
  CheckIn,
  CheckInPassenger,
} from "@/types";

interface BoardingPassProps {
  checkIn: CheckIn;
  passenger: CheckInPassenger;
  passengerIndex?: number;
  airline?: string;
  departureAirport?: string;
  departureCity?: string;
  departureTime?: string;
  arrivalAirport?: string;
  arrivalCity?: string;
  arrivalTime?: string;
  flightDate?: string;
  onDownload?: () => void;
  onContinue?: () => void;
  onBack?: () => void;
  loading?: boolean;
  className?: string;
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

function formatDate(value?: string) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value?: string) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function BoardingPass({
  checkIn,
  passenger,
  passengerIndex = 0,
  airline = "SOG Airways",
  departureAirport = "—",
  departureCity = "Departure",
  departureTime,
  arrivalAirport = "—",
  arrivalCity = "Arrival",
  arrivalTime,
  flightDate,
  onDownload,
  onContinue,
  onBack,
  loading = false,
  className = "",
}: BoardingPassProps) {
  const passengerName =
    `${passenger.firstName} ${passenger.lastName}`.trim();

  const seat = passenger.seatNumber ?? "Not assigned";
  const boardingTime =
    checkIn.boardingTime ?? "TBD";
  const gate = checkIn.gate ?? "TBD";

  const hasBoardingPass =
    passenger.boardingPassIssued &&
    Boolean(checkIn.boardingPassUrl);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className={`w-full ${className}`}
    >
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        {/* Header */}
        <div className="relative overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <Plane className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                    {airline}
                  </p>

                  <h2 className="text-xl font-bold tracking-tight">
                    Boarding Pass
                  </h2>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-6 text-white/65">
                Your digital boarding pass is ready. Keep
                this information available throughout your
                journey.
              </p>
            </div>

            <Badge
              variant={
                passenger.boardingPassIssued
                  ? "success"
                  : "warning"
              }
              className="self-start sm:self-auto"
            >
              {passenger.boardingPassIssued
                ? "Boarding Pass Issued"
                : "Pending"}
            </Badge>
          </div>
        </div>

        {/* Main pass */}
        <div className="p-4 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Flight route */}
            <div className="border-b border-dashed border-slate-200 p-5 sm:p-7">
              <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Departure
                  </p>

                  <p className="text-3xl font-black tracking-tight text-slate-950">
                    {departureAirport}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {departureCity}
                  </p>

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {departureTime ?? "TBD"}
                  </p>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                  <div className="h-px w-12 bg-slate-200" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                    <Plane className="h-4 w-4 text-slate-600" />
                  </div>

                  <div className="h-px w-12 bg-slate-200" />
                </div>

                <div className="md:text-right">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Arrival
                  </p>

                  <p className="text-3xl font-black tracking-tight text-slate-950">
                    {arrivalAirport}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {arrivalCity}
                  </p>

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {arrivalTime ?? "TBD"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
                <div className="h-px flex-1 bg-slate-200" />

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </div>

                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </div>

            {/* Passenger + flight details */}
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto]">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Passenger"
                  icon={
                    <UserRound className="h-4 w-4" />
                  }
                >
                  <p className="font-semibold text-slate-900">
                    {passengerName || "Passenger"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Passenger {passengerIndex + 1}
                  </p>
                </InfoCard>

                <InfoCard
                  title="Flight"
                  icon={
                    <Plane className="h-4 w-4" />
                  }
                >
                  <p className="font-semibold text-slate-900">
                    {checkIn.flightNumber}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {airline}
                  </p>
                </InfoCard>

                <InfoCard
                  title="Travel Date"
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                >
                  <p className="font-semibold text-slate-900">
                    {formatDate(flightDate)}
                  </p>
                </InfoCard>

                <InfoCard
                  title="Cabin"
                  icon={
                    <Ticket className="h-4 w-4" />
                  }
                >
                  <p className="font-semibold capitalize text-slate-900">
                    {passenger.seatClass.replace(
                      "-",
                      " ",
                    )}
                  </p>
                </InfoCard>
              </div>

              {/* QR / pass area */}
              <div className="flex min-h-48 min-w-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  {hasBoardingPass ? (
                    <QrCode className="h-16 w-16 text-slate-950" />
                  ) : (
                    <Ticket className="h-12 w-12 text-slate-300" />
                  )}
                </div>

                <p className="mt-3 text-center text-xs font-medium text-slate-500">
                  {hasBoardingPass
                    ? "Boarding pass"
                    : "Pass not yet issued"}
                </p>
              </div>
            </div>

            {/* Operational details */}
            <div className="border-t border-dashed border-slate-200 bg-slate-50/70 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                  title="Seat"
                  icon={
                    <Armchair className="h-4 w-4" />
                  }
                >
                  <p className="font-bold text-slate-900">
                    {seat}
                  </p>
                </InfoCard>

                <InfoCard
                  title="Gate"
                  icon={
                    <DoorOpen className="h-4 w-4" />
                  }
                >
                  <p className="font-bold text-slate-900">
                    {gate}
                  </p>
                </InfoCard>

                <InfoCard
                  title="Boarding"
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                >
                  <p className="font-bold text-slate-900">
                    {boardingTime === "TBD"
                      ? "TBD"
                      : formatTime(boardingTime)}
                  </p>
                </InfoCard>

                <InfoCard
                  title="Status"
                  icon={
                    <CheckCircle2 className="h-4 w-4" />
                  }
                >
                  <Badge
                    variant={
                      checkIn.boardingStatus ===
                      "boarded"
                        ? "success"
                        : checkIn.boardingStatus ===
                            "missed"
                          ? "danger"
                          : "info"
                    }
                  >
                    {formatStatus(
                      checkIn.boardingStatus,
                    )}
                  </Badge>
                </InfoCard>
              </div>
            </div>

            {/* Reference strip */}
            <div className="border-t border-dashed border-slate-200 px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-slate-500">
                    Booking reference
                  </span>

                  <span className="ml-2 font-bold tracking-wider text-slate-900">
                    {checkIn.bookingReference}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">
                    Check-in
                  </span>

                  <span className="ml-2 font-semibold capitalize text-slate-900">
                    {formatStatus(checkIn.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {(onDownload || onBack || onContinue) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.3,
              }}
              className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
            >
              {onBack && (
                <OutlineButton
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                >
                  Back
                </OutlineButton>
              )}

              {onDownload && (
                <OutlineButton
                  type="button"
                  onClick={onDownload}
                  disabled={
                    loading ||
                    !passenger.boardingPassIssued
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Pass
                </OutlineButton>
              )}

              {onContinue && (
                <PrimaryButton
                  type="button"
                  onClick={onContinue}
                  loading={loading}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </PrimaryButton>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}