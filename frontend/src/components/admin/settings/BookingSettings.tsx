"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import { AdminSettings } from "./admin-settings-data/SettingsData";

interface BookingSettingsProps {
  settings: AdminSettings["booking"];
  onChange: (
    field: keyof AdminSettings["booking"],
    value: boolean | number | string
  ) => void;
}

export default function BookingSettings({
  settings,
  onChange,
}: BookingSettingsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<CalendarCheck2 className="h-5 w-5" />}
          title="Booking Availability"
          description="Control how customers can create and manage bookings."
        />

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          <ToggleSetting
            icon={<CalendarCheck2 className="h-5 w-5" />}
            title="Allow Online Booking"
            description="Allow customers to create bookings through the airline website."
            checked={settings.allowOnlineBooking}
            onChange={(value) =>
              onChange("allowOnlineBooking", value)
            }
          />

          <ToggleSetting
            icon={<Users className="h-5 w-5" />}
            title="Allow Guest Booking"
            description="Allow customers to book flights without creating an account first."
            checked={settings.allowGuestBooking}
            onChange={(value) => onChange("allowGuestBooking", value)}
          />

          <ToggleSetting
            icon={<Mail className="h-5 w-5" />}
            title="Require Passenger Email"
            description="Require an email address when creating a passenger booking."
            checked={settings.requirePassengerEmail}
            onChange={(value) =>
              onChange("requirePassengerEmail", value)
            }
          />

          <ToggleSetting
            icon={<Phone className="h-5 w-5" />}
            title="Require Passenger Phone"
            description="Require a phone number when creating a passenger booking."
            checked={settings.requirePassengerPhone}
            onChange={(value) =>
              onChange("requirePassengerPhone", value)
            }
          />

          <ToggleSetting
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Auto Confirm Bookings"
            description="Automatically confirm eligible bookings after they are created."
            checked={settings.autoConfirmBookings}
            onChange={(value) =>
              onChange("autoConfirmBookings", value)
            }
          />

          <ToggleSetting
            icon={<XCircle className="h-5 w-5" />}
            title="Allow Booking Cancellation"
            description="Allow eligible bookings to be cancelled according to the cancellation window."
            checked={settings.allowBookingCancellation}
            onChange={(value) =>
              onChange("allowBookingCancellation", value)
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Booking Rules"
          description="Set limits and requirements for customer bookings."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Cancellation Window"
            description="Minimum hours before departure when a booking can be cancelled."
            value={settings.cancellationWindow}
            min={0}
            max={720}
            suffix="hours"
            onChange={(value) =>
              onChange("cancellationWindow", value)
            }
          />

          <NumberSetting
            icon={<Users className="h-4 w-4" />}
            label="Minimum Booking Age"
            description="Minimum passenger age permitted for a booking."
            value={settings.minimumBookingAge}
            min={0}
            max={18}
            suffix="years"
            onChange={(value) =>
              onChange("minimumBookingAge", value)
            }
          />

          <NumberSetting
            icon={<Users className="h-4 w-4" />}
            label="Maximum Passengers"
            description="Maximum number of passengers allowed in one booking."
            value={settings.maximumPassengersPerBooking}
            min={1}
            max={50}
            suffix="passengers"
            onChange={(value) =>
              onChange("maximumPassengersPerBooking", value)
            }
          />

          <TextSetting
            icon={<FileText className="h-4 w-4" />}
            label="Booking Reference Prefix"
            description="Prefix used when generating booking references."
            value={settings.bookingReferencePrefix}
            maxLength={8}
            onChange={(value) =>
              onChange(
                "bookingReferencePrefix",
                value.toUpperCase().replace(/\s/g, "")
              )
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Booking policy
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
              These controls define the booking rules that the future booking
              service can enforce. They currently update the admin settings
              interface only.
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
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-24 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800"
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

interface TextSettingProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: string;
  maxLength?: number;
  onChange: (value: string) => void;
}

function TextSetting({
  icon,
  label,
  description,
  value,
  maxLength,
  onChange,
}: TextSettingProps) {
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
          type="text"
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium uppercase text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:ring-slate-800"
        />
      </div>

      <span className="mt-2 block text-xs leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </label>
  );
}