
"use client";


import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useSettings } from "@/hooks/useSettings";
import type { UserPreferences } from "@/types";
import type { UpdateSettingsData } from "@/services/settingsService";

import type { SettingsData } from "@/components/user/settings/settings-data/SettingsData";

import SettingsAppearance from "./components/SettingsAppearance";
import SettingsHeader from "./components/SettingsHeader";
import SettingsNotifications from "./components/SettingsNotifications";
import SettingsPreferences from "./components/SettingsPreferences";
import SettingsPrivacy from "./components/SettingsPrivacy";
import SettingsSecurity from "./components/SettingsSecurity";
import SettingsActions from "./components/SettingsActions";

import { getSettingsDemoData } from "./data/settingsDemoData";

function copySettings(settings: SettingsData): SettingsData {
  return {
    account: { ...settings.account },
    notifications: { ...settings.notifications },
    privacy: { ...settings.privacy },
    security: { ...settings.security },
    appearance: { ...settings.appearance },
  };
}

function normalizeTheme(
  value: string | undefined,
): SettingsData["appearance"]["theme"] {
  if (value === "light" || value === "dark") {
    return value;
  }

  return "system";
}

/**
 * Apply API-supported preferences while preserving the other Settings
 * sections as in-memory preferences.
 *
 * The API currently has one marketingEmails flag, while the UI has
 * separate promotionalOffers and travelDeals switches.
 */
function mapPreferencesToSettings(
  preferences: UserPreferences,
  base: SettingsData,
): SettingsData {
  return {
    ...copySettings(base),
    account: {
      language: preferences.language || base.account.language,
      currency: preferences.currency || base.account.currency,
      timezone: preferences.timezone || base.account.timezone,
    },
    notifications: {
      ...base.notifications,
      promotionalOffers: preferences.marketingEmails,
      travelDeals: preferences.marketingEmails,
    },
  };
}

function createSettingsUpdate(
  settings: SettingsData,
): UpdateSettingsData {
  return {
    language: settings.account.language,
    currency: settings.account.currency,
    timezone: settings.account.timezone,

    // The current API exposes one combined marketing-email preference.
    // Keep it disabled unless both marketing categories are enabled.
    marketingEmails:
      settings.notifications.promotionalOffers &&
      settings.notifications.travelDeals,
  };
}

export default function SettingsFeature() {
  const {
    loading: settingsLoading,
    fetchSettings,
    updateSettings,
    clearError,
  } = useSettings();

  const { theme, setTheme } = useTheme();
const themeRef = useRef(theme);

useEffect(() => {
  themeRef.current = theme;
}, [theme]);

  const [settings, setSettings] = useState<SettingsData>(
    () => getSettingsDemoData(),
  );

  const [savedSettings, setSavedSettings] = useState<SettingsData>(
    () => getSettingsDemoData(),
  );

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");

  const isLoading = isBootstrapping || settingsLoading;

  const hasChanges = useMemo(
    () =>
      JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings],
  );

  const resetFeedback = useCallback(() => {
    setSaveSuccess(false);
    setNotice("");
    setSaveError("");
  }, []);

  /**
   * Fetch saved preferences through the existing hook/service.
   * If the API is unavailable, initialize from in-memory demo defaults.
   */
  useEffect(() => {
    let isCurrent = true;

    async function loadSettings(): Promise<void> {
      try {
        const preferences = await fetchSettings();

        if (!isCurrent) return;

        const base = getSettingsDemoData();
        base.appearance.theme = normalizeTheme(themeRef.current);

        const loadedSettings = mapPreferencesToSettings(
          preferences,
          base,
        );

        setSettings(loadedSettings);
        setSavedSettings(copySettings(loadedSettings));
        setIsDemoMode(false);
        setNotice("");
        setSaveError("");
      } catch {
        if (!isCurrent) return;

        const demoSettings = getSettingsDemoData();
        demoSettings.appearance.theme = normalizeTheme(
          themeRef.current,
        );

        setSettings(demoSettings);
        setSavedSettings(copySettings(demoSettings));
        setIsDemoMode(true);

        setNotice(
          "The Settings API is unavailable. You can still explore and edit settings, but changes will remain in memory for this session only.",
        );
      } finally {
        if (isCurrent) {
          setIsBootstrapping(false);
        }
      }
    }

    void loadSettings();

    return () => {
      isCurrent = false;
    };
  }, [fetchSettings]);

  const handleEdit = () => {
    if (isLoading || isSaving) return;

    setSettings(copySettings(savedSettings));
    setIsEditing(true);
    resetFeedback();
  };

  const handleCancel = () => {
    const restoredSettings = copySettings(savedSettings);

    setSettings(restoredSettings);
    setIsEditing(false);
    setSaveSuccess(false);
    setSaveError("");
    setNotice("");

    setTheme(restoredSettings.appearance.theme);
  };

  const handleAccountChange = (
    field: keyof SettingsData["account"],
    value: string,
  ) => {
    setSettings((current) => ({
      ...current,
      account: {
        ...current.account,
        [field]: value,
      },
    }));

    resetFeedback();
  };

  const handleNotificationChange = (
    field: keyof SettingsData["notifications"],
    value: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [field]: value,
      },
    }));

    resetFeedback();
  };

  const handlePrivacyChange = (
    field: keyof SettingsData["privacy"],
    value: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      privacy: {
        ...current.privacy,
        [field]: value,
      },
    }));

    resetFeedback();
  };

  const handleSecurityChange = (
    field: keyof SettingsData["security"],
    value: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      security: {
        ...current.security,
        [field]: value,
      },
    }));

    resetFeedback();
  };

  const handleAppearanceChange = (
    field: keyof SettingsData["appearance"],
    value: string | boolean,
  ) => {
    if (field === "theme" && typeof value === "string") {
      if (!["system", "light", "dark"].includes(value)) return;

      const selectedTheme =
        value as SettingsData["appearance"]["theme"];

      setSettings((current) => ({
        ...current,
        appearance: {
          ...current.appearance,
          theme: selectedTheme,
        },
      }));

      setTheme(selectedTheme);
    } else if (
      field === "compactMode" &&
      typeof value === "boolean"
    ) {
      setSettings((current) => ({
        ...current,
        appearance: {
          ...current.appearance,
          compactMode: value,
        },
      }));
    }

    resetFeedback();
  };

  const handleSave = async (): Promise<void> => {
    if (isSaving || isLoading) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    setNotice("");
    clearError();

    try {
      if (isDemoMode) {
        const nextSettings = copySettings(settings);

        setSavedSettings(nextSettings);
        setSettings(nextSettings);
        setIsEditing(false);
        setSaveSuccess(true);

        setNotice(
          "Settings saved in memory for this session only. No account settings were saved to a server because the Settings API is unavailable.",
        );

        return;
      }

      const payload = createSettingsUpdate(settings);

      const updatedPreferences = await updateSettings(payload);

      /*
       * Preserve session-only choices while updating the fields returned
       * by the API. The server only supports account preferences and its
       * combined marketingEmails field at this time.
       */
      const nextSettings = copySettings(settings);

      nextSettings.account = {
        language: updatedPreferences.language,
        currency: updatedPreferences.currency,
        timezone: updatedPreferences.timezone,
      };

      setSettings(nextSettings);
      setSavedSettings(copySettings(nextSettings));
      setIsEditing(false);
      setSaveSuccess(true);

      setNotice(
        "Language, currency, time zone, and the combined marketing-email preference were sent to the Settings API successfully. Detailed notification categories, privacy preferences, security switches, and compact mode remain in memory only because the current API does not expose matching fields. Promotional offers and travel deals share one server preference; both must be enabled for marketing emails to be enabled.",
      );

      setTheme(nextSettings.appearance.theme);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? `Settings could not be saved: ${error.message}`
          : "Settings could not be saved. Check your connection and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader isEditing={isEditing} />

      {isLoading && (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Loading your account settings...
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Account Preferences
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {isEditing
              ? "Make your changes and save them when you are finished."
              : "Your current SOG Airways preferences are shown below."}
          </p>
        </div>

        <SettingsActions
          isEditing={isEditing}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>

      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            isDemoMode
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300"
          }`}
        >
          {saveSuccess ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <p>{notice}</p>
        </motion.div>
      )}

      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{saveError}</p>
        </motion.div>
      )}

      <div className="grid gap-6">
        <SettingsPreferences
          settings={settings}
          isEditing={isEditing}
          onChange={handleAccountChange}
        />

        <SettingsNotifications
          settings={settings}
          isEditing={isEditing}
          onChange={handleNotificationChange}
        />

        <SettingsPrivacy
          settings={settings}
          isEditing={isEditing}
          onChange={handlePrivacyChange}
        />

        <SettingsSecurity
          settings={settings}
          isEditing={isEditing}
          onChange={handleSecurityChange}
        />

        <SettingsAppearance
          settings={settings}
          isEditing={isEditing}
          onChange={handleAppearanceChange}
        />
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800"
        >
          <SettingsActions
            isEditing={isEditing}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </motion.div>
      )}

      {hasChanges && !isEditing && !isLoading && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Some settings have changed in the current session.
        </p>
      )}
    </div>
  );
}
