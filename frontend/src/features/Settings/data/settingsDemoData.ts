
import {
  settingsData,
  type SettingsData,
} from "@/components/user/settings/settings-data/SettingsData";

/**
 * Returns a fresh copy of the existing Settings defaults.
 *
 * This data is stored only in React/application memory.
 * It does not use localStorage or sessionStorage.
 */
export function getSettingsDemoData(): SettingsData {
  return {
    account: {
      ...settingsData.account,
    },
    notifications: {
      ...settingsData.notifications,
    },
    privacy: {
      ...settingsData.privacy,
    },
    security: {
      ...settingsData.security,
    },
    appearance: {
      ...settingsData.appearance,
    },
  };
}

/**
 * Creates initial in-memory Settings data.
 * Call getSettingsDemoData() when a fresh copy is needed.
 */
export const settingsDemoData: SettingsData =
  getSettingsDemoData();
