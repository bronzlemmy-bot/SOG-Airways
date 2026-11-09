
"use client";

import { motion } from "framer-motion";
import {
  Eye,
  History,
  LockKeyhole,
  ShieldCheck,
  Share2,
} from "lucide-react";

import type { SettingsData } from "@/components/user/settings/settings-data/SettingsData";

type PrivacyField = keyof SettingsData["privacy"];

interface SettingsPrivacyProps {
  settings: SettingsData;
  isEditing: boolean;
  onChange: (field: PrivacyField, value: boolean) => void;
}

const privacyItems: {
  key: PrivacyField;
  title: string;
  description: string;
  icon: typeof Eye;
}[] = [
  {
    key: "personalizedOffers",
    title: "Personalized Offers",
    description:
      "Allow SOG Airways to tailor travel offers and destination suggestions to your preferences.",
    icon: Eye,
  },
  {
    key: "travelHistory",
    title: "Travel History",
    description:
      "Allow your previous journeys to be used to personalize your travel experience.",
    icon: History,
  },
  {
    key: "dataSharing",
    title: "Data Sharing",
    description:
      "Allow eligible sharing of your information for purposes described in the applicable privacy policy.",
    icon: Share2,
  },
];

export default function SettingsPrivacy({
  settings,
  isEditing,
  onChange,
}: SettingsPrivacyProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Privacy
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Choose how your preferences and travel information may be used
            to personalize your SOG Airways experience.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {privacyItems.map((item, index) => {
          const Icon = item.icon;
          const enabled = settings.privacy[item.key];

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.12 + index * 0.05,
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
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900 ${
                  enabled
                    ? "bg-emerald-600"
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

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <p className="text-xs leading-5 text-emerald-800 dark:text-emerald-300">
            These switches manage your selected privacy preferences in the
            Settings interface. Applying them to your account requires
            the corresponding backend support. They do not independently
            change data collection or sharing practices.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
