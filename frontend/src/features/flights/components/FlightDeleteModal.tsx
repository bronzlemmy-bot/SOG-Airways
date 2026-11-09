"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Plane, ShieldAlert, X } from "lucide-react";
import type { Flight } from "@/types/flight";
import OutlineButton from "@/components/buttons/OutlineButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";


interface FlightDeleteModalProps {
  isOpen: boolean;
  flight: Flight | null;
  onConfirm: (flight: Flight) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function FlightDeleteModal({
  isOpen,
  flight,
  onConfirm,
  onClose,
  loading = false,
  error = null,
}: FlightDeleteModalProps) {
  if (!isOpen || !flight) return null;

  const isOperational =
    flight.status === "departed" ||
    flight.status === "in-air" ||
    flight.status === "landed";

  const handleConfirm = () => {
    if (loading || isOperational) return;
    void onConfirm(flight);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="flight-delete-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !loading) {
            onClose();
          }
        }}
      >
        <motion.section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="flight-delete-title"
          aria-describedby="flight-delete-description"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="flight-delete-title"
                  className="text-lg font-bold text-slate-950 dark:text-white"
                >
                  Delete flight?
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Review the flight details before confirming this action.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close delete confirmation"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div
              id="flight-delete-description"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm dark:bg-slate-800 dark:text-sky-400">
                  <Plane className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-950 dark:text-white">
                    {flight.flightNumber}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {flight.route.departureAirportCode}{" "}
                    <span aria-hidden="true">→</span>{" "}
                    {flight.route.arrivalAirportCode}
                  </p>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {flight.status.replaceAll("-", " ")}
                </span>
              </div>
            </div>

            {isOperational ? (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p>
                  This flight has departed, is airborne, or has landed. Deletion
                  is disabled here to help protect operational records.
                </p>
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                Deleting this flight may affect related bookings and passenger
                records. Make sure the flight can safely be removed before
                proceeding.
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
              <OutlineButton
                type="button"
                onClick={onClose}
                disabled={loading}
                className="justify-center"
              >
                Keep Flight
              </OutlineButton>

              <PrimaryButton
                type="button"
                onClick={handleConfirm}
                disabled={loading || isOperational}
                loading={loading}
                className="justify-center !bg-red-600! hover:!bg-red-700! focus:!ring-red-500!"
              >
                <AlertTriangle className="mr-2 h-4 w-4" aria-hidden="true" />
                {loading ? "Deleting..." : "Confirm Delete"}
              </PrimaryButton>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}