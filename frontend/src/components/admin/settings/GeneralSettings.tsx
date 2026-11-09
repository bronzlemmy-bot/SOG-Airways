"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Globe2,
  Languages,
  Mail,
  MapPin,
  Phone,
  Plane,
  Save,
  WalletCards,
} from "lucide-react";

import {
  AdminSettings,
  currencyOptions,
  dateFormatOptions,
  languageOptions,
  timezoneOptions,
} from "./admin-settings-data/SettingsData";

interface GeneralSettingsProps {
  settings: AdminSettings["general"];
  onChange: (
    field: keyof AdminSettings["general"],
    value: string
  ) => void;
}

export default function GeneralSettings({
  settings,
  onChange,
}: GeneralSettingsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Plane className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Airline Information
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage the basic information displayed throughout the admin
              system.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SettingField
            label="Airline Name"
            value={settings.airlineName}
            onChange={(value) => onChange("airlineName", value)}
            placeholder="SOG Airways"
            icon={<Plane className="h-4 w-4" />}
          />

          <SettingField
            label="Airline Code"
            value={settings.airlineCode}
            onChange={(value) =>
              onChange("airlineCode", value.toUpperCase())
            }
            placeholder="SOG"
            maxLength={5}
            icon={<Globe2 className="h-4 w-4" />}
          />

          <SettingField
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(value) => onChange("supportEmail", value)}
            placeholder="support@example.com"
            icon={<Mail className="h-4 w-4" />}
          />

          <SettingField
            label="Support Phone"
            type="tel"
            value={settings.supportPhone}
            onChange={(value) => onChange("supportPhone", value)}
            placeholder="+234..."
            icon={<Phone className="h-4 w-4" />}
          />

          <div className="md:col-span-2">
            <SettingField
              label="Website"
              type="url"
              value={settings.website}
              onChange={(value) => onChange("website", value)}
              placeholder="https://example.com"
              icon={<Globe2 className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Regional Preferences
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Configure currency, language, timezone, and date preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SettingSelect
            label="Default Currency"
            value={settings.defaultCurrency}
            onChange={(value) => onChange("defaultCurrency", value)}
            options={currencyOptions.map((option) => ({
              value: option.value,
              label: `${option.label} (${option.symbol})`,
            }))}
            icon={<WalletCards className="h-4 w-4" />}
          />

          <SettingSelect
            label="Language"
            value={settings.language}
            onChange={(value) => onChange("language", value)}
            options={languageOptions}
            icon={<Languages className="h-4 w-4" />}
          />

          <div className="md:col-span-2">
            <SettingSelect
              label="Timezone"
              value={settings.timezone}
              onChange={(value) => onChange("timezone", value)}
              options={timezoneOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          <SettingSelect
            label="Date Format"
            value={settings.dateFormat}
            onChange={(value) => onChange("dateFormat", value)}
            options={dateFormatOptions}
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <SettingSelect
            label="Time Format"
            value={settings.timeFormat}
            onChange={(value) => onChange("timeFormat", value)}
            options={[
              { value: "12-hour", label: "12-hour" },
              { value: "24-hour", label: "24-hour" },
            ]}
            icon={<Clock3 className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <Save className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

        <p className="text-sm text-blue-700 dark:text-blue-300">
          Changes are kept in the current admin session until you save or
          reset the settings.
        </p>
      </div>
    </motion.section>
  );
}

interface SettingFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  icon?: React.ReactNode;
}

function SettingField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  icon,
}: SettingFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800 ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </label>
  );
}

interface SettingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  icon?: React.ReactNode;
}

function SettingSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: SettingSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800 ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}