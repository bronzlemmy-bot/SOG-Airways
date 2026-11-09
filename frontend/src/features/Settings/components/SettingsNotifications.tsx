
"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CalendarCheck,
  Mail,
  Plane,
  Tag,
  TicketCheck,
  UserRound,
} from "lucide-react";

import type { SettingsData } from "@/components/user/settings/settings-data/SettingsData";

type NotificationField = keyof SettingsData["notifications"];

interface SettingsNotificationsProps {
  settings: SettingsData;
  isEditing: boolean;
  onChange: (
    field: NotificationField,
    value: boolean,
  ) => void;
}

const notificationItems: {
  key: NotificationField;
  title: string;
  description: string;
  icon: typeof Bell;
}[] = [
  {
    key: "bookingUpdates",
    title: "Booking Updates",
    description:
      "Receive notifications when your booking is created, changed, or cancelled.",
    icon: TicketCheck,
  },
  {
    key: "flightStatus",
    title: "Flight Status",
    description:
      "Get important updates about delays, cancellations, gate changes, and departures.",
    icon: Plane,
  },
  {
    key: "checkInReminders",
    title: "Check-in Reminders",
    description:
      "Receive reminders when online check-in becomes available for your flight.",
    icon: CalendarCheck,
  },
  {
    key: "promotionalOffers",
    title: "Promotional Offers",
    description:
      "Receive information about special offers, promotions, and seasonal campaigns.",
    icon: Tag,
  },
  {
    key: "travelDeals",
    title: "Travel Deals",
    description:
      "Receive selected travel deals and destination offers from SOG Airways.",
    icon: Mail,
  },
  {
    key: "accountAlerts",
    title: "Account Alerts",
    description:
      "Receive important security and account-related notifications.",
    icon: UserRound,
  },
];

export default function SettingsNotifications({
  settings,
  isEditing,
  onChange,
}: SettingsNotificationsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
          <Bell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Notifications
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Choose which SOG Airways notifications you would like to receive.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {notificationItems.map((item, index) => {
          const Icon = item.icon;
          const enabled = settings.notifications[item.key];

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.08 + index * 0.04,
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
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900 ${
                  enabled
                    ? "bg-sky-600"
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

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />

        <p className="text-xs leading-5 text-sky-700 dark:text-sky-300">
          These notification preferences are editable here. They will only
          be synchronized with your account when the backend supports these
          individual notification categories.
        </p>
      </div>
    </motion.section>
  );
}
