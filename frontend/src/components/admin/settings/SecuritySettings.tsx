"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  KeyRound,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { AdminSettings } from "./admin-settings-data/SettingsData";

interface SecuritySettingsProps {
  settings: AdminSettings["security"];
  onChange: (
    field: keyof AdminSettings["security"],
    value: boolean | number
  ) => void;
}

export default function SecuritySettings({
  settings,
  onChange,
}: SecuritySettingsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Authentication & Access
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Configure how administrators authenticate and access the
              dashboard.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          <ToggleSetting
            icon={<Smartphone className="h-5 w-5" />}
            title="Two-Factor Authentication"
            description="Require administrators to use an additional verification step when signing in."
            checked={settings.twoFactorAuthentication}
            onChange={(value) =>
              onChange("twoFactorAuthentication", value)
            }
          />

          <ToggleSetting
            icon={<LockKeyhole className="h-5 w-5" />}
            title="Require Strong Password"
            description="Require passwords to contain stronger combinations of characters."
            checked={settings.requireStrongPassword}
            onChange={(value) => onChange("requireStrongPassword", value)}
          />

          <ToggleSetting
            icon={<MonitorSmartphone className="h-5 w-5" />}
            title="Allow Remembered Devices"
            description="Allow administrators to trust a device and reduce repeated verification."
            checked={settings.allowRememberDevice}
            onChange={(value) => onChange("allowRememberDevice", value)}
          />

          <ToggleSetting
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Login Alerts"
            description="Notify administrators whenever a new login is detected."
            checked={settings.loginAlerts}
            onChange={(value) => onChange("loginAlerts", value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <KeyRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Password & Session Policies
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Control password expiration, sessions, and failed login
              attempts.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <NumberSetting
            icon={<Clock3 className="h-4 w-4" />}
            label="Session Timeout"
            description="Minutes before an inactive administrator session expires."
            value={settings.sessionTimeout}
            min={5}
            max={480}
            suffix="minutes"
            onChange={(value) => onChange("sessionTimeout", value)}
          />

          <NumberSetting
            icon={<KeyRound className="h-4 w-4" />}
            label="Password Expiry"
            description="Number of days before an administrator password expires."
            value={settings.passwordExpiry}
            min={0}
            max={365}
            suffix="days"
            onChange={(value) => onChange("passwordExpiry", value)}
          />

          <NumberSetting
            icon={<LockKeyhole className="h-4 w-4" />}
            label="Maximum Login Attempts"
            description="Failed attempts allowed before access is temporarily restricted."
            value={settings.maxLoginAttempts}
            min={1}
            max={20}
            suffix="attempts"
            onChange={(value) => onChange("maxLoginAttempts", value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Security configuration
            </p>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              These settings control the security policy displayed by the
              admin interface. Authentication enforcement can be connected
              to the backend when the authentication system is implemented.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
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
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
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
            ? "bg-emerald-600"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <motion.span
          layout
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
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