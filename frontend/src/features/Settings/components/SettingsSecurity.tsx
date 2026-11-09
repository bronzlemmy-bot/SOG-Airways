
"use client";

import { motion } from "framer-motion";
import {
  BellRing,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import type { SettingsData } from "@/components/user/settings/settings-data/SettingsData";

type SecurityField = keyof SettingsData["security"];

interface SettingsSecurityProps {
  settings: SettingsData;
  isEditing: boolean;
  onChange: (field: SecurityField, value: boolean) => void;
}

const securityItems: {
  key: SecurityField;
  title: string;
  description: string;
  icon: typeof Smartphone;
}[] = [
  {
    key: "twoFactorAuthentication",
    title: "Two-Factor Authentication",
    description:
      "Add an extra layer of protection to your account by requiring a verification code when signing in.",
    icon: Smartphone,
  },
  {
    key: "loginAlerts",
    title: "Login Alerts",
    description:
      "Receive an alert when a new sign-in to your SOG Airways account is detected.",
    icon: BellRing,
  },
];

export default function SettingsSecurity({
  settings,
  isEditing,
  onChange,
}: SettingsSecurityProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Security
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Manage additional security protections and account sign-in
            alerts.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {securityItems.map((item, index) => {
          const Icon = item.icon;
          const enabled = settings.security[item.key];

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.16 + index * 0.05,
              }}
              className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${item.title}: ${
                  enabled ? "enabled" : "disabled"
                }`}
                disabled={!isEditing}
                onClick={() => onChange(item.key, !enabled)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900 ${
                  enabled
                    ? "bg-amber-500"
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
                    enabled ? "ml-5" : "ml-0"
                  }`}
                />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" />

          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Account Protection
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Security settings help protect access to your bookings and
              personal account information.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" />

          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Secure Sign-in
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Additional verification can help prevent unauthorized
              account access.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

          <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
            These controls represent your selected preferences. Enabling
            two-factor authentication or login alerts requires corresponding
            backend security support; changing a switch here alone does not
            activate those protections on your account.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
