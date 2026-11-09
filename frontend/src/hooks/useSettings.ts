"use client";

import { useCallback, useState } from "react";

import {
  settingsService,
  type UpdateSettingsData,
} from "@/services/settingsService";

import type { UserPreferences } from "@/types";

interface UseSettingsState {
  settings: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

export function useSettings() {
  const [state, setState] =
    useState<UseSettingsState>({
      settings: null,
      loading: false,
      error: null,
    });

  const fetchSettings = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data =
        await settingsService.getSettings();

      setState({
        settings: data,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch settings.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const updateSettings = useCallback(
    async (data: UpdateSettingsData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const updatedSettings =
          await settingsService.updateSettings(data);

        setState({
          settings: updatedSettings,
          loading: false,
          error: null,
        });

        return updatedSettings;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update settings.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const updateSetting = useCallback(
    async <K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K],
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const updatedSettings =
          await settingsService.updateSetting(
            key,
            value,
          );

        setState({
          settings: updatedSettings,
          loading: false,
          error: null,
        });

        return updatedSettings;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update setting.";

        setState((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));

        throw error;
      }
    },
    [],
  );

  const resetSettings = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data =
        await settingsService.resetSettings();

      setState({
        settings: data,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to reset settings.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const clearSettings = useCallback(() => {
    setState({
      settings: null,
      loading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    fetchSettings,
    updateSettings,
    updateSetting,
    resetSettings,
    clearSettings,
    clearError,
  };
}