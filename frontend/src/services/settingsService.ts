import { apiService } from "./api";

import type { UserPreferences } from "@/types";

export type SettingsData = UserPreferences;

export type UpdateSettingsData =
  Partial<UserPreferences>;

export const settingsService = {
  async getSettings(): Promise<UserPreferences> {
    return apiService.get<UserPreferences>(
      "/users/me/settings",
    );
  },

  async updateSettings(
    data: UpdateSettingsData,
  ): Promise<UserPreferences> {
    return apiService.patch<UserPreferences>(
      "/users/me/settings",
      data,
    );
  },

  async updateSetting<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ): Promise<UserPreferences> {
    return apiService.patch<UserPreferences>(
      "/users/me/settings",
      {
        [key]: value,
      },
    );
  },

  async resetSettings(): Promise<UserPreferences> {
    return apiService.post<UserPreferences>(
      "/users/me/settings/reset",
    );
  },
};