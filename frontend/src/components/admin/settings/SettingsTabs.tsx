"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CalendarCheck2,
  CreditCard,
  Globe2,
  Plane,
  ShieldCheck,
} from "lucide-react";

import { SettingsTab } from "./admin-settings-data/SettingsData";

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

const settingsTabItems: {
  id: SettingsTab;
  label: string;
  description: string;
  icon: typeof Globe2;
}[] = [
  {
    id: "general",
    label: "General",
    description: "Airline information",
    icon: Globe2,
  },
  {
    id: "security",
    label: "Security",
    description: "Admin security",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts and messages",
    icon: Bell,
  },
  {
    id: "booking",
    label: "Booking",
    description: "Booking rules",
    icon: CalendarCheck2,
  },
  {
    id: "payment",
    label: "Payment",
    description: "Payment options",
    icon: CreditCard,
  },
  {
    id: "flight",
    label: "Flight",
    description: "Flight settings",
    icon: Plane,
  },
];

export default function SettingsTabs({
  activeTab,
  onChange,
}: SettingsTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {settingsTabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex min-w-37.5 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-settings-active-tab"
                  className="absolute inset-0 rounded-xl bg-slate-900 dark:bg-white"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-white/15 dark:bg-slate-900/10"
                    : "bg-slate-100 dark:bg-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="relative z-10 min-w-0">
                <span className="block text-sm font-semibold">
                  {tab.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    isActive
                      ? "text-slate-300 dark:text-slate-600"
                      : "text-slate-500 dark:text-slate-500"
                  }`}
                >
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}