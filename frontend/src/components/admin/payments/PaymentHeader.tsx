"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Download,
  FileDown,
} from "lucide-react";

interface PaymentHeaderProps {
  totalPayments: number;
  onExport?: () => void;
}

export default function PaymentHeader({
  totalPayments,
  onExport,
}: PaymentHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:p-6"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-slate-200/50 blur-3xl dark:bg-slate-700/20" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
          >
            <CreditCard className="h-5 w-5" />
          </motion.div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Finance Management
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Payments
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Monitor, review, and manage passenger payment
              transactions across SOG Airways.
            </p>

            <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {totalPayments}{" "}
              {totalPayments === 1 ? "payment" : "payments"}{" "}
              recorded
            </div>
          </div>
        </div>

        {onExport && (
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 lg:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Download className="h-4 w-4" />
            <span>Export Payments</span>
          </motion.button>
        )}
      </div>

      {/* Bottom information strip */}
      <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <FileDown className="h-3.5 w-3.5" />
          Export records as CSV
        </div>

        <div className="hidden h-3 w-px bg-slate-200 sm:block dark:bg-slate-700" />

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Payment activity overview
        </div>
      </div>
    </motion.header>
  );
}