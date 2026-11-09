
"use client";

import { motion } from "framer-motion";
import { Headphones, ShieldCheck } from "lucide-react";

interface SupportHeaderProps {
  isSubmitting?: boolean;
}

export default function SupportHeader({
  isSubmitting = false,
}: SupportHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-8"
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-slate-100 dark:bg-slate-800/50" />

      <div className="absolute -bottom-24 -left-16 h-40 w-40 rounded-full bg-slate-100/70 dark:bg-slate-800/30" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900 sm:h-14 sm:w-14">
            <Headphones className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              SOG Airways Assistance
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              How can we help?
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Find answers, get help with your trip, or contact SOG Airways
              support when you need assistance.
            </p>
          </div>
        </div>

        <div
          role="status"
          className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>
            {isSubmitting ? "Sending Request" : "Customer Support"}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
