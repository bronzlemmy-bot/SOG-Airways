"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Headset,
  RefreshCw,
  WifiOff,
} from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

export type TripErrorType =
  | "load"
  | "lookup"
  | "network"
  | "action"
  | "not-found";

export interface TripErrorStateProps {
  type?: TripErrorType;
  title?: string;
  message?: string;
  errorCode?: string;
  showRetry?: boolean;
  retryLabel?: string;
  backLabel?: string;
  supportLabel?: string;
  onRetry?: () => void;
  onBack?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

interface ErrorConfig {
  title: string;
  message: string;
  icon: typeof AlertTriangle;
}

const ERROR_CONFIG: Record<TripErrorType, ErrorConfig> = {
  load: {
    title: "We couldn't load your trip",
    message:
      "Your trip details are temporarily unavailable. Please try loading them again.",
    icon: AlertTriangle,
  },
  lookup: {
    title: "We couldn't verify your booking",
    message:
      "Check your booking reference and passenger surname, then try your search again.",
    icon: AlertTriangle,
  },
  network: {
    title: "Connection problem",
    message:
      "We couldn't complete the request because of a connection problem. Check your connection and try again.",
    icon: WifiOff,
  },
  action: {
    title: "We couldn't complete that action",
    message:
      "Your request could not be completed. Please try again or contact our support team if the problem continues.",
    icon: AlertTriangle,
  },
  "not-found": {
    title: "Trip not found",
    message:
      "We couldn't find a trip matching the supplied details. Please check them and try again.",
    icon: AlertTriangle,
  },
};

export default function TripErrorState({
  type = "load",
  title,
  message,
  errorCode,
  showRetry = true,
  retryLabel = "Try again",
  backLabel = "Go back",
  supportLabel = "Contact support",
  onRetry,
  onBack,
  onContactSupport,
  className = "",
}: TripErrorStateProps) {
  const config = ERROR_CONFIG[type];
  const Icon = config.icon;

  return (
    <motion.section
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl border border-rose-200 bg-white px-5 py-10 text-center shadow-sm dark:border-rose-900 dark:bg-slate-950 sm:px-10 sm:py-12 ${className}`}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
        SOG Airways
      </p>

      <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        {title ?? config.title}
      </h2>

      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
        {message ?? config.message}
      </p>

      {errorCode && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reference code
          </p>
          <p className="mt-1 font-mono text-sm font-medium text-slate-800 dark:text-slate-200">
            {errorCode}
          </p>
        </div>
      )}

      <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
        {showRetry && onRetry && (
          <PrimaryButton type="button" onClick={onRetry}>
            <span className="inline-flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </span>
          </PrimaryButton>
        )}

        {onBack && (
          <OutlineButton type="button" onClick={onBack}>
            <span className="inline-flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </span>
          </OutlineButton>
        )}

        {onContactSupport && (
          <OutlineButton type="button" onClick={onContactSupport}>
            <span className="inline-flex items-center justify-center gap-2">
              <Headset className="h-4 w-4" />
              {supportLabel}
            </span>
          </OutlineButton>
        )}
      </div>

      {!onRetry && !onBack && !onContactSupport && (
        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          If this problem continues, please try again later or contact support.
        </p>
      )}
    </motion.section>
  );
}
