"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import SettingsHeader from "@/components/admin/settings/SettingsHeader";
import SettingsTabs from "@/components/admin/settings/SettingsTabs";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";
import NotificationSettings from "@/components/admin/settings/NotificationSettings";
import BookingSettings from "@/components/admin/settings/BookingSettings";
import PaymentSettings from "@/components/admin/settings/PaymentSettings";
import FlightSettings from "@/components/admin/settings/FlightSettings";
import SettingsActions from "@/components/admin/settings/SettingsActions";

import {
  AdminSettings,
  SettingsTab,
  defaultAdminSettings,
} from "@/components/admin/settings/admin-settings-data/SettingsData";

const createSettingsCopy = (): AdminSettings => {
  return structuredClone(defaultAdminSettings);
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(
    createSettingsCopy,
  );

  const [savedSettings, setSavedSettings] = useState<AdminSettings>(
    createSettingsCopy,
  );

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  const handleGeneralChange = (
    field: keyof AdminSettings["general"],
    value: string,
  ) => {
    setSettings((previous) => ({
      ...previous,
      general: {
        ...previous.general,
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handleSecurityChange = (
    field: keyof AdminSettings["security"],
    value: boolean | number,
  ) => {
    setSettings((previous) => ({
      ...previous,
      security: {
        ...previous.security,
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handleNotificationChange = (
    field: keyof AdminSettings["notifications"],
    value: boolean,
  ) => {
    setSettings((previous) => ({
      ...previous,
      notifications: {
        ...previous.notifications,
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handleBookingChange = (
    field: keyof AdminSettings["booking"],
    value: boolean | number | string,
  ) => {
    setSettings((previous) => ({
      ...previous,
      booking: {
        ...previous.booking,
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handlePaymentChange = (
    field: keyof AdminSettings["payment"],
    value: boolean | number | string | string[],
  ) => {
    if (
      field === "enabledMethods" &&
      Array.isArray(value) &&
      value.length === 0
    ) {
      return;
    }

    setSettings((previous) => ({
      ...previous,
      payment: {
        ...previous.payment,
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handleFlightChange = (
    field: keyof AdminSettings["flight"],
    value: boolean | number,
  ) => {
    setSettings((previous) => ({
      ...previous,
      flight: {
        ...previous.flight,
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handleSave = () => {
    if (!hasUnsavedChanges || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    setTimeout(() => {
      setSavedSettings(structuredClone(settings));
      setIsSaving(false);
      setSaveMessage("Settings saved successfully.");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }, 700);
  };

  const handleReset = () => {
    if (!hasUnsavedChanges || isSaving) {
      return;
    }

    setSettings(structuredClone(savedSettings));
    setSaveMessage("Changes have been reset.");
  };

  const activeSettingsContent = useMemo(() => {
    switch (activeTab) {
      case "security":
        return (
          <SecuritySettings
            settings={settings.security}
            onChange={handleSecurityChange}
          />
        );

      case "notifications":
        return (
          <NotificationSettings
            settings={settings.notifications}
            onChange={handleNotificationChange}
          />
        );

      case "booking":
        return (
          <BookingSettings
            settings={settings.booking}
            onChange={handleBookingChange}
          />
        );

      case "payment":
        return (
          <PaymentSettings
            settings={settings.payment}
            onChange={handlePaymentChange}
          />
        );

      case "flight":
        return (
          <FlightSettings
            settings={settings.flight}
            onChange={handleFlightChange}
          />
        );

      case "general":
      default:
        return (
          <GeneralSettings
            settings={settings.general}
            onChange={handleGeneralChange}
          />
        );
    }
  }, [
    activeTab,
    settings,
  ]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SettingsHeader hasUnsavedChanges={hasUnsavedChanges} />

        <SettingsTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{saveMessage}</span>
          </motion.div>
        )}

        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeSettingsContent}
        </motion.section>

        <SettingsActions
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
        />
      </div>
    </main>
  );
}