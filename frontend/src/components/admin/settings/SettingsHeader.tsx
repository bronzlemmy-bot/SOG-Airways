"use client";

import { Settings, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsHeaderProps {
  hasUnsavedChanges?: boolean;
}

export default function SettingsHeader({
  hasUnsavedChanges = false,
}: SettingsHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 shadow-xl dark:border-slate-800 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-indigo-300 ring-1 ring-white/10">
            <Settings className="h-7 w-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Admin Settings
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-300/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administration
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Manage SOG Airways configuration, security, notifications,
              bookings, payments, and flight operations.
            </p>
          </div>
        </div>

        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex w-fit items-center rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/20"
          >
            Unsaved changes
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}