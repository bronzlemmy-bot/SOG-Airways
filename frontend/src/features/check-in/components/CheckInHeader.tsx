"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Plane,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";

interface CheckInHeaderProps {
  title?: string;
  description?: string;
  currentStep?: number;
  totalSteps?: number;
  bookingReference?: string;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  onBack?: () => void;
  onStepClick?: (step: number) => void;
  showBackButton?: boolean;
  showProgress?: boolean;
  className?: string;
}

const DEFAULT_STEPS = [
  { label: "Booking", icon: ClipboardCheck },
  { label: "Passenger", icon: ShieldCheck },
  { label: "Seat", icon: Plane },
  { label: "Confirmation", icon: TicketCheck },
];

export default function CheckInHeader({
  title = "Online Check-in",
  description = "Get ready for your journey. Verify your details, choose your seat, and receive your boarding pass.",
  currentStep = 1,
  totalSteps = 4,
  bookingReference,
  flightNumber,
  departureAirport,
  arrivalAirport,
  onBack,
  onStepClick,
  showBackButton = true,
  showProgress = true,
  className = "",
}: CheckInHeaderProps) {
  const safeTotalSteps = Math.max(1, Math.floor(totalSteps));
  const safeCurrentStep = Math.min(
    safeTotalSteps,
    Math.max(1, Math.floor(currentStep)),
  );

  const steps = Array.from({ length: safeTotalSteps }, (_, index) => ({
    number: index + 1,
    label:
      DEFAULT_STEPS[index]?.label ??
      `Step ${index + 1}`,
    icon: DEFAULT_STEPS[index]?.icon ?? CheckCircle2,
  }));

  const progressPercentage =
    safeTotalSteps > 1
      ? ((safeCurrentStep - 1) / (safeTotalSteps - 1)) * 100
      : 100;

  const hasFlightDetails =
    Boolean(bookingReference) ||
    Boolean(flightNumber) ||
    Boolean(departureAirport) ||
    Boolean(arrivalAirport);

  return (
    <section
      className={`relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600" />
      </div>

      <div className="p-5 sm:p-7 lg:p-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {showBackButton && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <span />
          )}

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Secure check-in
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Plane className="h-3.5 w-3.5" />
                SOG Airways
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                {description}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden h-28 w-28 items-center justify-center rounded-3xl border border-sky-100 bg-linear-to-br from-sky-50 to-blue-100 sm:flex dark:border-sky-900/60 dark:from-sky-950 dark:to-blue-950"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-blue-600/20">
              <TicketCheck className="h-10 w-10" />
            </div>
          </motion.div>
        </div>

        {hasFlightDetails && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bookingReference && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Booking reference
                </p>
                <p className="mt-1 break-all text-sm font-extrabold text-slate-900 dark:text-white">
                  {bookingReference}
                </p>
              </div>
            )}

            {flightNumber && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Flight number
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                  {flightNumber}
                </p>
              </div>
            )}

            {departureAirport && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  From
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                  {departureAirport}
                </p>
              </div>
            )}

            {arrivalAirport && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  To
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                  {arrivalAirport}
                </p>
              </div>
            )}
          </div>
        )}

        {showProgress && (
          <div className="mt-9 border-t border-slate-200 pt-7 dark:border-slate-800">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Check-in progress
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  Step {safeCurrentStep} of {safeTotalSteps}
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>

            <div
              className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-label="Check-in progress"
              aria-valuemin={1}
              aria-valuemax={safeTotalSteps}
              aria-valuenow={safeCurrentStep}
            >
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600"
                initial={{ width: 0 }}
                animate={{
                  width: `${progressPercentage}%`,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const completed = step.number < safeCurrentStep;
                const active = step.number === safeCurrentStep;
                const clickable =
                  Boolean(onStepClick) && step.number <= safeCurrentStep;

                return (
                  <button
                    key={step.number}
                    type="button"
                    disabled={!clickable}
                    onClick={() => {
                      if (clickable) onStepClick?.(step.number);
                    }}
                    aria-current={active ? "step" : undefined}
                    className={`group flex min-w-0 items-center gap-2.5 rounded-2xl border p-3 text-left transition sm:gap-3 sm:p-3.5 ${
                      active
                        ? "border-sky-300 bg-sky-50 shadow-sm dark:border-sky-800 dark:bg-sky-950/50"
                        : completed
                          ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                          : "border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60"
                    } ${
                      clickable
                        ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-sm"
                        : "cursor-default"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-sky-600 text-white"
                          : completed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      ) : (
                        <StepIcon className="h-4.5 w-4.5" />
                      )}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Step {step.number}
                      </span>
                      <span
                        className={`mt-0.5 block truncate text-xs font-extrabold sm:text-sm ${
                          active
                            ? "text-sky-800 dark:text-sky-200"
                            : completed
                              ? "text-emerald-800 dark:text-emerald-300"
                              : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {step.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
