"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  
  X,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";
import Badge from "@/components/ui/Badge";

export type TripConfirmationStatus =
  | "success"
  | "warning"
  | "error"
  | "info";

export interface TripConfirmationProps {
  status?: TripConfirmationStatus;
  title?: string;
  message: string;
  bookingReference?: string;
  confirmationNumber?: string;
  details?: { label: string; value: string }[];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

const STATUS_CONFIG = {
  success: {
    title: "Request completed",
    badge: "Successful",
    icon: CheckCircle2,
    iconClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    panelClass:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20",
    titleClass: "text-emerald-950 dark:text-emerald-200",
    messageClass: "text-emerald-800 dark:text-emerald-300",
    badgeVariant: "success" as const,
  },
  warning: {
    title: "Action requires attention",
    badge: "Review required",
    icon: AlertCircle,
    iconClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    panelClass:
      "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20",
    titleClass: "text-amber-950 dark:text-amber-200",
    messageClass: "text-amber-800 dark:text-amber-300",
    badgeVariant: "warning" as const,
  },
  error: {
    title: "Something went wrong",
    badge: "Not completed",
    icon: AlertCircle,
    iconClass:
      "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    panelClass:
      "border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/20",
    titleClass: "text-rose-950 dark:text-rose-200",
    messageClass: "text-rose-800 dark:text-rose-300",
    badgeVariant: "danger" as const,
  },
  info: {
    title: "Request received",
    badge: "Information",
    icon: CircleHelp,
    iconClass:
      "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    panelClass:
      "border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/20",
    titleClass: "text-sky-950 dark:text-sky-200",
    messageClass: "text-sky-800 dark:text-sky-300",
    badgeVariant: "info" as const,
  },
};

export default function TripConfirmation({
  status = "success",
  title,
  message,
  bookingReference,
  confirmationNumber,
  details = [],
  primaryActionLabel = "Continue",
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
  showCloseButton = false,
  className = "",
}: TripConfirmationProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <motion.section
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-slate-950 ${className}`}
    >
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-500 transition hover:bg-black/5 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className={`p-5 sm:p-8 ${config.panelClass}`}>
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.25 }}
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconClass}`}
          >
            <Icon className="h-8 w-8" aria-hidden="true" />
          </motion.div>

          <Badge variant={config.badgeVariant}>{config.badge}</Badge>

          <h2
            className={`mt-3 text-xl font-bold sm:text-2xl ${config.titleClass}`}
          >
            {title ?? config.title}
          </h2>

          <p
            className={`mt-2 max-w-lg text-sm leading-6 ${config.messageClass}`}
          >
            {message}
          </p>
        </div>
      </div>

      {(bookingReference || confirmationNumber || details.length > 0) && (
        <div className="space-y-4 p-5 sm:p-8">
          {(bookingReference || confirmationNumber) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {bookingReference && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Booking reference
                  </p>
                  <p className="mt-1 break-all font-bold tracking-wide text-slate-900 dark:text-white">
                    {bookingReference}
                  </p>
                </div>
              )}

              {confirmationNumber && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Confirmation number
                  </p>
                  <p className="mt-1 break-all font-bold tracking-wide text-slate-900 dark:text-white">
                    {confirmationNumber}
                  </p>
                </div>
              )}
            </div>
          )}

          {details.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              {details.map((detail, index) => (
                <div
                  key={`${detail.label}-${index}`}
                  className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                    index > 0
                      ? "border-t border-slate-200 dark:border-slate-800"
                      : ""
                  }`}
                >
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {detail.label}
                  </span>
                  <span className="wrap-break-words text-sm font-medium text-slate-900 dark:text-white sm:text-right">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(onPrimaryAction || onSecondaryAction) && (
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:justify-end sm:p-6">
          {onSecondaryAction && secondaryActionLabel && (
            <OutlineButton type="button" onClick={onSecondaryAction}>
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {secondaryActionLabel}
              </span>
            </OutlineButton>
          )}

          {onPrimaryAction && (
            <PrimaryButton type="button" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </PrimaryButton>
          )}
        </div>
      )}
    </motion.section>
  );
}
