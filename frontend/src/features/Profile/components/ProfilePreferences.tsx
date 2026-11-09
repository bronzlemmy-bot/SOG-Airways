
"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Clock3,
  Globe2,
  LoaderCircle,
  Mail,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

export interface ProfilePreferenceValues {
  currency: string;
  timeZone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  flightUpdates: boolean;
  promotionalEmails: boolean;
}

export interface ProfilePreferenceOption {
  value: string;
  label: string;
  description?: string;
  symbol?: string;
}

interface ProfilePreferencesProps {
  values: ProfilePreferenceValues;
  currencyOptions: ProfilePreferenceOption[];
  timeZoneOptions: ProfilePreferenceOption[];
  languageOptions?: ProfilePreferenceOption[];
  onChange: (
    field: keyof ProfilePreferenceValues,
    value: string | boolean,
  ) => void;
  onSave: () => void | Promise<void>;
  onReset?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
  error?: string;
  successMessage?: string;
}

const defaultLanguageOptions: ProfilePreferenceOption[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese" },
];

const inputClasses =
  "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

interface PreferenceSelectProps {
  id: string;
  label: string;
  description: string;
  value: string;
  options: ProfilePreferenceOption[];
  icon: typeof Globe2;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function PreferenceSelect({
  id,
  label,
  description,
  value,
  options,
  icon: Icon,
  disabled = false,
  onChange,
}: PreferenceSelectProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <label
            htmlFor={id}
            className="block text-sm font-bold text-slate-900 dark:text-white"
          >
            {label}
          </label>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.value)}
        className={inputClasses}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.symbol ? `${option.symbol} — ` : ""}
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface PreferenceToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  icon: typeof Bell;
  onChange: (checked: boolean) => void;
}

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  icon: Icon,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-blue-100 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-900">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <label
            htmlFor={id}
            className="block cursor-pointer text-sm font-bold text-slate-900 dark:text-white"
          >
            {label}
          </label>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {checked && <Check className="h-3 w-3 text-blue-600" />}
        </span>
      </button>
    </div>
  );
}

export default function ProfilePreferences({
  values,
  currencyOptions,
  timeZoneOptions,
  languageOptions = defaultLanguageOptions,
  onChange,
  onSave,
  onReset,
  isSaving = false,
  hasChanges = true,
  error,
  successMessage,
}: ProfilePreferencesProps) {
  const rawId = useId().replace(/:/g, "");
  const disabled = isSaving;

  const selectId = (field: string) => `${rawId}-${field}`;
  const toggleId = (field: string) => `${rawId}-${field}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-5 py-6 dark:border-slate-800 dark:from-blue-950/30 dark:via-slate-950 dark:to-indigo-950/20 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Globe2 className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Account Preferences
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Personalize your SOG Airways experience, regional settings,
              and the notifications you receive.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-7">
        <section className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Regional Settings
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose how currencies, dates, and times are presented.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <PreferenceSelect
              id={selectId("currency")}
              label="Preferred Currency"
              description="Your preferred currency for displaying amounts."
              value={values.currency}
              options={currencyOptions}
              icon={Wallet}
              disabled={disabled}
              onChange={(value) => onChange("currency", value)}
            />

            <PreferenceSelect
              id={selectId("time-zone")}
              label="Time Zone"
              description="Use your preferred local time zone."
              value={values.timeZone}
              options={timeZoneOptions}
              icon={Clock3}
              disabled={disabled}
              onChange={(value) => onChange("timeZone", value)}
            />

            <PreferenceSelect
              id={selectId("language")}
              label="Language"
              description="Choose your preferred account language."
              value={values.language}
              options={languageOptions}
              icon={Globe2}
              disabled={disabled}
              onChange={(value) => onChange("language", value)}
            />
          </div>
        </section>

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <section className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notification Preferences
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Select how you would like to receive account and travel updates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <PreferenceToggle
              id={toggleId("email-notifications")}
              label="Email Notifications"
              description="Receive important account notices by email."
              checked={values.emailNotifications}
              icon={Mail}
              disabled={disabled}
              onChange={(checked) => onChange("emailNotifications", checked)}
            />

            <PreferenceToggle
              id={toggleId("sms-notifications")}
              label="SMS Notifications"
              description="Receive selected updates by text message."
              checked={values.smsNotifications}
              icon={Smartphone}
              disabled={disabled}
              onChange={(checked) => onChange("smsNotifications", checked)}
            />

            <PreferenceToggle
              id={toggleId("push-notifications")}
              label="Push Notifications"
              description="Receive alerts in supported applications or browsers."
              checked={values.pushNotifications}
              icon={Bell}
              disabled={disabled}
              onChange={(checked) => onChange("pushNotifications", checked)}
            />

            <PreferenceToggle
              id={toggleId("flight-updates")}
              label="Flight Updates"
              description="Receive flight changes and travel-status updates."
              checked={values.flightUpdates}
              icon={ShieldCheck}
              disabled={disabled}
              onChange={(checked) => onChange("flightUpdates", checked)}
            />

            <PreferenceToggle
              id={toggleId("promotional-emails")}
              label="Offers and Promotions"
              description="Receive promotional offers, deals, and airline news."
              checked={values.promotionalEmails}
              icon={Mail}
              disabled={disabled}
              onChange={(checked) => onChange("promotionalEmails", checked)}
            />
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            {successMessage}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            Changes take effect after the parent feature successfully saves
            your preferences.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {onReset && (
              <button
                type="button"
                disabled={disabled || !hasChanges}
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Changes
              </button>
            )}

            <button
              type="button"
              disabled={disabled || !hasChanges}
              onClick={() => void onSave()}
              aria-busy={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving Preferences..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
