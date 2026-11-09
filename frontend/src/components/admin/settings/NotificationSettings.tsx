"use client";

import { motion } from "framer-motion";
import {
  Bell,
  BellRing,
  CalendarCheck2,
  CreditCard,
  Mail,
  Megaphone,
  Plane,
  Send,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

import { AdminSettings } from "./admin-settings-data/SettingsData";

interface NotificationSettingsProps {
  settings: AdminSettings["notifications"];
  onChange: (
    field: keyof AdminSettings["notifications"],
    value: boolean
  ) => void;
}

export default function NotificationSettings({
  settings,
  onChange,
}: NotificationSettingsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<BellRing className="h-5 w-5" />}
          title="Notification Categories"
          description="Choose which events should generate notifications for the airline."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <NotificationCard
            icon={<CalendarCheck2 className="h-5 w-5" />}
            title="Booking Notifications"
            description="Receive alerts about new and updated bookings."
            checked={settings.bookingNotifications}
            onChange={(value) =>
              onChange("bookingNotifications", value)
            }
          />

          <NotificationCard
            icon={<CreditCard className="h-5 w-5" />}
            title="Payment Notifications"
            description="Receive alerts for successful and failed payments."
            checked={settings.paymentNotifications}
            onChange={(value) =>
              onChange("paymentNotifications", value)
            }
          />

          <NotificationCard
            icon={<Plane className="h-5 w-5" />}
            title="Flight Notifications"
            description="Receive alerts about flight activity and changes."
            checked={settings.flightNotifications}
            onChange={(value) =>
              onChange("flightNotifications", value)
            }
          />

          <NotificationCard
            icon={<Bell className="h-5 w-5" />}
            title="Cancellation Notifications"
            description="Receive alerts when bookings or flights are cancelled."
            checked={settings.cancellationNotifications}
            onChange={(value) =>
              onChange("cancellationNotifications", value)
            }
          />

          <NotificationCard
            icon={<Send className="h-5 w-5" />}
            title="Check-in Notifications"
            description="Receive alerts related to passenger check-in activity."
            checked={settings.checkInNotifications}
            onChange={(value) =>
              onChange("checkInNotifications", value)
            }
          />

          <NotificationCard
            icon={<Megaphone className="h-5 w-5" />}
            title="Promotional Notifications"
            description="Allow promotional and marketing-related notifications."
            checked={settings.promotionalNotifications}
            onChange={(value) =>
              onChange("promotionalNotifications", value)
            }
          />

          <NotificationCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Admin Alerts"
            description="Receive important system and administrative alerts."
            checked={settings.adminAlerts}
            onChange={(value) => onChange("adminAlerts", value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <SectionHeader
          icon={<Smartphone className="h-5 w-5" />}
          title="Delivery Channels"
          description="Choose which communication channels can be used for notifications."
        />

        <div className="space-y-3">
          <ChannelSetting
            icon={<Mail className="h-5 w-5" />}
            title="Email Notifications"
            description="Send supported notifications through email."
            checked={settings.emailNotifications}
            onChange={(value) => onChange("emailNotifications", value)}
          />

          <ChannelSetting
            icon={<Smartphone className="h-5 w-5" />}
            title="SMS Notifications"
            description="Send supported notifications through SMS."
            checked={settings.smsNotifications}
            onChange={(value) => onChange("smsNotifications", value)}
          />

          <ChannelSetting
            icon={<Bell className="h-5 w-5" />}
            title="Push Notifications"
            description="Send supported notifications through browser or app push notifications."
            checked={settings.pushNotifications}
            onChange={(value) => onChange("pushNotifications", value)}
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Notification preferences
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-700 dark:text-blue-400">
            These switches control the notification preferences in the admin
            interface. Actual email, SMS, and push delivery can be connected
            when the notification backend is implemented.
          </p>
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

interface NotificationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function NotificationCard({
  icon,
  title,
  description,
  checked,
  onChange,
}: NotificationCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        checked
          ? "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              checked
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <Switch
          checked={checked}
          label={title}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

interface ChannelSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ChannelSetting({
  icon,
  title,
  description,
  checked,
  onChange,
}: ChannelSettingProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <Switch
        checked={checked}
        label={title}
        onChange={onChange}
      />
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}

function Switch({ checked, label, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
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
  );
}