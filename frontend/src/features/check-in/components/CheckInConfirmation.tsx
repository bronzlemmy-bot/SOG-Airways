"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  Plane,
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

interface CheckInConfirmationProps {
  checkIn: CheckIn;
  passenger?: CheckInPassenger;
  passengerIndex?: number;
  airline?: string;
  departureAirport?: string;
  departureCity?: string;
  arrivalAirport?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  flightDate?: string;
  onDownloadBoardingPass?: () => void;
  onViewBoardingPass?: () => void;
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
    weekday: "long",
    day: "numeric",
    month: "long",
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

export default function CheckInConfirmation({
  checkIn,
  passenger,
  passengerIndex = 0,
  airline = "SOG Airways",
  departureAirport = "—",
  departureCity = "Departure",
  arrivalAirport = "—",
  arrivalCity = "Arrival",
  departureTime,
  arrivalTime,
  flightDate,
  onDownloadBoardingPass,
  onViewBoardingPass,
  onContinue,
  onBack,
  loading = false,
  className = "",
}: CheckInConfirmationProps) {
  const passengerName = passenger
    ? `${passenger.firstName} ${passenger.lastName}`.trim()
    : "Passenger";

  const isCheckedIn =
    checkIn.status === "checked-in";

  const boardingPassIssued =
    passenger?.boardingPassIssued ?? false;

  const checkInTime = checkIn.checkInTime
    ? formatTime(checkIn.checkInTime)
    : "Recently";

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
      <div className="mx-auto w-full max-w-4xl">
        {/* Success header */}
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-slate-950 px-5 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-10">
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/4 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 180,
              }}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30"
            >
              <CheckCircle2 className="h-9 w-9 text-emerald-400" />
            </motion.div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              {airline}
            </p>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Check-in Complete
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
              You&apos;re successfully checked in for
              your flight. Your travel details are ready
              for your journey.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant={
                  isCheckedIn ? "success" : "warning"
                }
              >
                {formatStatus(checkIn.status)}
              </Badge>

              {passenger && (
                <Badge
                  variant={
                    boardingPassIssued
                      ? "info"
                      : "warning"
                  }
                >
                  {boardingPassIssued
                    ? "Boarding Pass Issued"
                    : "Boarding Pass Pending"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation content */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 sm:p-6">
          {/* Flight route */}
          <div className="rounded-2xl bg-slate-50 p-5 sm:p-7">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Departure
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {departureAirport}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {departureCity}
                </p>

                <p className="mt-3 font-bold text-slate-900">
                  {departureTime ?? "TBD"}
                </p>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <div className="h-px w-10 bg-slate-300" />

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                  <Plane className="h-4 w-4 text-slate-600" />
                </div>

                <div className="h-px w-10 bg-slate-300" />
              </div>

              <div className="md:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Arrival
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {arrivalAirport}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {arrivalCity}
                </p>

                <p className="mt-3 font-bold text-slate-900">
                  {arrivalTime ?? "TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard
              title="Passenger"
              icon={
                <UserRound className="h-4 w-4" />
              }
            >
              <p className="font-semibold text-slate-900">
                {passengerName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Passenger {passengerIndex + 1}
              </p>
            </InfoCard>

            <InfoCard
              title="Flight"
              icon={<Plane className="h-4 w-4" />}
            >
              <p className="font-semibold text-slate-900">
                {checkIn.flightNumber}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {airline}
              </p>
            </InfoCard>

            <InfoCard
              title="Check-in Time"
              icon={<Clock3 className="h-4 w-4" />}
            >
              <p className="font-semibold text-slate-900">
                {checkInTime}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Check-in successfully recorded
              </p>
            </InfoCard>

            <InfoCard
              title="Booking Reference"
              icon={<Ticket className="h-4 w-4" />}
            >
              <p className="font-bold tracking-wider text-slate-900">
                {checkIn.bookingReference}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {formatDate(flightDate)}
              </p>
            </InfoCard>
          </div>

          {/* Travel information */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Seat
              </p>

              <p className="mt-2 text-xl font-black text-slate-950">
                {passenger?.seatNumber ??
                  "Not assigned"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Gate
              </p>

              <p className="mt-2 text-xl font-black text-slate-950">
                {checkIn.gate ?? "TBD"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Boarding
              </p>

              <p className="mt-2 text-xl font-black text-slate-950">
                {checkIn.boardingTime
                  ? formatTime(checkIn.boardingTime)
                  : "TBD"}
              </p>
            </div>
          </div>

          {/* Important notice */}
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                <Clock3 className="h-4 w-4" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Before you travel
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Arrive at the airport in good time,
                  complete any required security checks,
                  and keep your boarding pass and travel
                  documents accessible.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {(onDownloadBoardingPass ||
            onViewBoardingPass ||
            onBack ||
            onContinue) && (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              {onBack && (
                <OutlineButton
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </OutlineButton>
              )}

              {onDownloadBoardingPass && (
                <OutlineButton
                  type="button"
                  onClick={onDownloadBoardingPass}
                  disabled={
                    loading || !boardingPassIssued
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Pass
                </OutlineButton>
              )}

              {onViewBoardingPass && (
                <OutlineButton
                  type="button"
                  onClick={onViewBoardingPass}
                  disabled={
                    loading || !boardingPassIssued
                  }
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  View Boarding Pass
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
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}