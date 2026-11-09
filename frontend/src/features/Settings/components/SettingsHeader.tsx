
"use client";

import { motion } from "framer-motion";
import { Settings, ShieldCheck } from "lucide-react";

interface SettingsHeaderProps {
  isEditing?: boolean;
}

export default function SettingsHeader({
  isEditing = false,
}: SettingsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-7"
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-slate-100/70 dark:bg-slate-800/40" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <Settings className="h-6 w-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                SOG Airways Account
              </p>

              {isEditing && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  Editing
                </span>
              )}
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Manage your account preferences, notifications, privacy,
              security, and appearance settings.
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          Protected Account
        </div>
      </div>
    </motion.div>
  );
}
