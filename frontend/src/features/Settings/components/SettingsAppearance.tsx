
"use client";

import { motion } from "framer-motion";
import { Monitor, Moon, Palette, Sun } from "lucide-react";

import type { SettingsData } from "@/components/user/settings/settings-data/SettingsData";

interface SettingsAppearanceProps {
  settings: SettingsData;
  isEditing: boolean;
  onChange: (
    field: keyof SettingsData["appearance"],
    value: string | boolean,
  ) => void;
}

const themeOptions = [
  {
    value: "system",
    label: "System",
    description: "Follow your device appearance",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    description: "Use the light appearance",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the dark appearance",
    icon: Moon,
  },
] as const;

export default function SettingsAppearance({
  settings,
  isEditing,
  onChange,
}: SettingsAppearanceProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
          <Palette className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Customize how your SOG Airways account area looks and feels.
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
          Theme
        </h3>

        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((option, index) => {
            const Icon = option.icon;
            const selected =
              settings.appearance.theme === option.value;

            return (
              <motion.button
                key={option.value}
                type="button"
                disabled={!isEditing}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.22 + index * 0.05,
                }}
                onClick={() => onChange("theme", option.value)}
                aria-pressed={selected}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  selected
                    ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:border-violet-400 dark:bg-violet-950/30 dark:ring-violet-400"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                } ${
                  !isEditing
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300"
                      : "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {option.label}
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {option.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Compact Mode
            </h3>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
              Use a more condensed layout for account pages and dashboard
              content.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.appearance.compactMode}
            aria-label={`Compact mode: ${
              settings.appearance.compactMode
                ? "enabled"
                : "disabled"
            }`}
            disabled={!isEditing}
            onClick={() =>
              onChange(
                "compactMode",
                !settings.appearance.compactMode,
              )
            }
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900 ${
              settings.appearance.compactMode
                ? "bg-violet-500"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <motion.span
              layout
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className={`block h-5 w-5 rounded-full bg-white shadow-sm ${
                settings.appearance.compactMode
                  ? "ml-5"
                  : "ml-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900/50 dark:bg-violet-950/20">
        <div className="flex items-start gap-3">
          <Palette className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />

          <p className="text-xs leading-5 text-violet-800 dark:text-violet-300">
            Appearance changes can be applied immediately and saved
            locally in the feature state. Synchronizing these settings
            across devices requires backend support.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
