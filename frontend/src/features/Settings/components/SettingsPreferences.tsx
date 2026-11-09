
"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  Languages,
  MapPinned,
  WalletCards,
} from "lucide-react";

import {
  currencyOptions,
  languageOptions,
  timezoneOptions,
  type SettingsData,
} from "@/components/user/settings/settings-data/SettingsData";

type AccountField = keyof SettingsData["account"];

interface SettingsPreferencesProps {
  settings: SettingsData;
  isEditing: boolean;
  onChange: (field: AccountField, value: string) => void;
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800 dark:disabled:text-slate-500";

const timezoneGroups = [
  { label: "Africa", prefixes: ["Africa/"] },
  { label: "America", prefixes: ["America/"] },
  { label: "Asia", prefixes: ["Asia/"] },
  {
    label: "Australia & Pacific",
    prefixes: ["Australia/", "Pacific/"],
  },
  { label: "Europe", prefixes: ["Europe/"] },
] as const;

export default function SettingsPreferences({
  settings,
  isEditing,
  onChange,
}: SettingsPreferencesProps) {
  const selectedTimezoneExists =
    settings.account.timezone === "auto" ||
    timezoneOptions.some(
      (timezone) => timezone.value === settings.account.timezone,
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
          <Globe2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Account Preferences
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Choose the language, currency, and time zone used throughout
            your SOG Airways experience.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="feature-settings-language"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            <Languages className="h-4 w-4 text-sky-500" />
            Language
          </label>

          <select
            id="feature-settings-language"
            value={settings.account.language}
            disabled={!isEditing}
            onChange={(event) =>
              onChange("language", event.target.value)
            }
            className={inputClassName}
          >
            {languageOptions.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="feature-settings-currency"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            <WalletCards className="h-4 w-4 text-sky-500" />
            Currency
          </label>

          <select
            id="feature-settings-currency"
            value={settings.account.currency}
            disabled={!isEditing}
            onChange={(event) =>
              onChange("currency", event.target.value)
            }
            className={inputClassName}
          >
            {currencyOptions.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} — {currency.name} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="feature-settings-timezone"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            <MapPinned className="h-4 w-4 text-sky-500" />
            Time Zone
          </label>

          <select
            id="feature-settings-timezone"
            value={
              selectedTimezoneExists
                ? settings.account.timezone
                : "auto"
            }
            disabled={!isEditing}
            onChange={(event) =>
              onChange("timezone", event.target.value)
            }
            className={inputClassName}
          >
            <option value="auto">
              Automatic — Detect my device time zone
            </option>

            {timezoneGroups.map((group) => {
              const groupOptions = timezoneOptions.filter((timezone) =>
                group.prefixes.some((prefix) =>
                  timezone.value.startsWith(prefix),
                ),
              );

              if (groupOptions.length === 0) return null;

              return (
                <optgroup key={group.label} label={group.label}>
                  {groupOptions.map((timezone) => (
                    <option
                      key={timezone.value}
                      value={timezone.value}
                    >
                      {timezone.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}

            <optgroup label="UTC">
              {timezoneOptions
                .filter((timezone) => timezone.value === "UTC")
                .map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.name}
                  </option>
                ))}
            </optgroup>
          </select>

          <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-slate-500 dark:text-slate-500">
            <Globe2 className="h-3.5 w-3.5 shrink-0" />
            Automatic selection uses your device time zone when applied.
            Selecting a time zone manually lets you choose a different
            region.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
