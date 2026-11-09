"use client";

import { motion } from "framer-motion";
import {
  Eye,
  RefreshCw,
  XCircle,
  ReceiptText,
  ChevronRight,
} from "lucide-react";


import type { Booking } from "@/types/booking";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlineButton from "@/components/buttons/OutlineButton";

interface BookingActionsProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onRequestChange: (booking: Booking) => void;
  onRequestCancellation: (booking: Booking) => void;
  onViewReceipt: (booking: Booking) => void;
  loading?: boolean;
  className?: string;
}

export default function BookingActions({
  booking,
  onViewDetails,
  onRequestChange,
  onRequestCancellation,
  onViewReceipt,
  loading = false,
  className = "",
}: BookingActionsProps) {
  const status = String(
    (booking as Booking & { status?: string }).status ?? "",
  ).toLowerCase();

  const isCancelled = status === "cancelled";
  const isCompleted = ["completed", "landed"].includes(status);
  const canChange = !isCancelled && !isCompleted;
  const canCancel = !isCancelled && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`space-y-3 ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <PrimaryButton
          type="button"
          onClick={() => onViewDetails(booking)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Booking
          <ChevronRight className="h-4 w-4" />
        </PrimaryButton>

        <OutlineButton
          type="button"
          onClick={() => onViewReceipt(booking)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2"
        >
          <ReceiptText className="h-4 w-4" />
          View Receipt
        </OutlineButton>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <OutlineButton
          type="button"
          onClick={() => onRequestChange(booking)}
          disabled={loading || !canChange}
          className="inline-flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Request Flight Change
        </OutlineButton>

        <OutlineButton
          type="button"
          onClick={() => onRequestCancellation(booking)}
          disabled={loading || !canCancel}
          className="inline-flex items-center justify-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          <XCircle className="h-4 w-4" />
          Request Cancellation
        </OutlineButton>
      </div>

      {(isCancelled || isCompleted) && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isCancelled
            ? "This booking is cancelled. Flight changes and cancellation requests are unavailable."
            : "This trip is completed. Flight changes and cancellation requests are unavailable."}
        </p>
      )}
    </motion.div>
  );
}
