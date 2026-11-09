"use client";

import { motion } from "framer-motion";
import {
  Check,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";

interface SettingsActionsProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export default function SettingsActions({
  hasUnsavedChanges,
  isSaving,
  onSave,
  onReset,
}: SettingsActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-4 z-20"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              hasUnsavedChanges
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
            }`}
          >
            {hasUnsavedChanges ? (
              <Save className="h-5 w-5" />
            ) : (
              <Check className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {hasUnsavedChanges
                ? "You have unsaved changes"
                : "All settings are saved"}
            </p>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {hasUnsavedChanges
                ? "Save your changes or reset them to the current saved configuration."
                : "Your current settings match the saved configuration."}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isSaving ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="inline-flex"
                >
                  <ShieldCheck className="h-4 w-4" />
                </motion.span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}