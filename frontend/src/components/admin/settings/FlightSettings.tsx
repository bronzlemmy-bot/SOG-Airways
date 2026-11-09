"use client";

import { motion } from "framer-motion";
import {
  Armchair,
  BaggageClaim,
  CalendarClock,
  Clock3,
  Plane,
  RefreshCw,
  ScanLine,
  Timer,
} from "lucide-react";

import { AdminSettings } from "./admin-settings-data/SettingsData";

interface FlightSettingsProps {
  settings: AdminSettings["flight"];
  onChange: (
    field: keyof AdminSettings["flight"],
    value: boolean | number
  ) => void;
}

export default function FlightSettings({
  settings,
  onChange,
}: FlightSettingsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<Plane className="h-5 w-5" />}
          title="Flight Services"
          description="Configure the services and options available to passengers."
        />

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          <ToggleSetting
            icon={<ScanLine className="h-5 w-5" />}
            title="Allow Online Check-in"
            description="Allow eligible passengers to check in through the airline website."
            checked={settings.allowOnlineCheckIn}
            onChange={(value) =>
              onChange("allowOnlineCheckIn", value)
            }
          />

          <ToggleSetting
            icon={<RefreshCw className="h-5 w-5" />}
            title="Allow Flight Changes"
            description="Allow eligible passengers to request changes to their flights."
            checked={settings.allowFlightChanges}
            onChange={(value) =>
              onChange("allowFlightChanges", value)
            }
          />

          <ToggleSetting
            icon={<Armchair className="h-5 w-5" />}
            title="Allow Seat Selection"
            description="Allow passengers to select available seats during booking or check-in."
            checked={settings.allowSeatSelection}
            onChange={(value) =>
              onChange("allowSeatSelection", value)
            }
          />

          <ToggleSetting
            icon={<BaggageClaim className="h-5 w-5" />}
            title="Allow Extra Baggage"
            description="Allow passengers to purchase additional baggage allowance."
            checked={settings.allowExtraBaggage}
            onChange={(value) =>
              onChange("allowExtraBaggage", value)
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<CalendarClock className="h-5 w-5" />}
          title="Flight Timing Rules"
          description="Configure the timing windows used by flight services."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Check-in Opens"
            description="Number of hours before departure when online check-in becomes available."
            value={settings.checkInOpeningHours}
            min={1}
            max={168}
            suffix="hours"
            onChange={(value) =>
              onChange("checkInOpeningHours", value)
            }
          />

          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Check-in Closes"
            description="Number of hours before departure when online check-in closes."
            value={settings.checkInClosingHours}
            min={0}
            max={48}
            suffix="hours"
            onChange={(value) =>
              onChange("checkInClosingHours", value)
            }
          />

          <NumberSetting
            icon={<RefreshCw className="h-4 w-4" />}
            label="Flight Change Window"
            description="Minimum hours before departure when eligible flight changes can be made."
            value={settings.flightChangeWindow}
            min={0}
            max={168}
            suffix="hours"
            onChange={(value) =>
              onChange("flightChangeWindow", value)
            }
          />

          <NumberSetting
            icon={<Timer className="h-4 w-4" />}
            label="Minimum Connection Time"
            description="Minimum recommended connection time between connecting flights."
            value={settings.minimumConnectionTime}
            min={15}
            max={720}
            suffix="minutes"
            onChange={(value) =>
              onChange("minimumConnectionTime", value)
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<BaggageClaim className="h-5 w-5" />}
          title="Baggage & Duration"
          description="Set default baggage limits and flight duration values."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <NumberSetting
            icon={<BaggageClaim className="h-4 w-4" />}
            label="Maximum Baggage Weight"
            description="Maximum baggage weight allowed under the configured baggage rule."
            value={settings.maximumBaggageWeight}
            min={1}
            max={100}
            suffix="kg"
            onChange={(value) =>
              onChange("maximumBaggageWeight", value)
            }
          />

          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Default Flight Duration"
            description="Default duration used when a flight does not have a specific duration."
            value={settings.defaultFlightDuration}
            min={30}
            max={1440}
            suffix="minutes"
            onChange={(value) =>
              onChange("defaultFlightDuration", value)
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
        <div className="flex items-start gap-3">
          <Plane className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />

          <div>
            <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
              Flight configuration
            </p>

            <p className="mt-1 text-sm leading-6 text-indigo-700 dark:text-indigo-400">
              These values are currently frontend settings. When the flight
              management backend is connected, the same configuration can be
              used to enforce the corresponding flight rules.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeader({
  icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleSetting({
  icon,
  title,
  description,
  checked,
  onChange,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            checked
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </p>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          checked
            ? "bg-slate-900 dark:bg-white"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <motion.span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm dark:bg-slate-900"
          animate={{
            left: checked ? "24px" : "4px",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </div>
  );
}

interface NumberSettingProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}

function NumberSetting({
  icon,
  label,
  description,
  value,
  min,
  max,
  suffix,
  onChange,
}: NumberSettingProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            if (Number.isNaN(nextValue)) {
              return;
            }

            onChange(Math.min(max, Math.max(min, nextValue)));
          }}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-20 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          {suffix}
        </span>
      </div>

      <span className="mt-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </label>
  );
}