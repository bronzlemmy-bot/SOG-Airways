"use client";

import { useCallback, useState } from "react";

import {
  customerService,
  type CreateCustomerData,
  type UpdateCustomerData,
} from "@/services/customerService";

import type { Customer } from "@/types";

interface UseProfileState {
  profile: Customer | null;
  loading: boolean;
  error: string | null;
}

export function useProfile() {
  const [state, setState] =
    useState<UseProfileState>({
      profile: null,
      loading: false,
      error: null,
    });

  const getProfileById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const profile =
          await customerService.getCustomerById(id);

        setState({
          profile,
          loading: false,
          error: null,
        });

        return profile;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch profile.";

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

  const getProfileByEmail = useCallback(
    async (email: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const profile =
          await customerService.getCustomerByEmail(
            email,
          );

        setState({
          profile,
          loading: false,
          error: null,
        });

        return profile;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch profile.";

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

  const createProfile = async (
    data: CreateCustomerData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const profile =
        await customerService.createCustomer(data);

      setState({
        profile,
        loading: false,
        error: null,
      });

      return profile;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create profile.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateProfile = async (
    id: string,
    data: UpdateCustomerData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const profile =
        await customerService.updateCustomer(
          id,
          data,
        );

      setState({
        profile,
        loading: false,
        error: null,
      });

      return profile;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update profile.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deleteProfile = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await customerService.deleteCustomer(id);

      setState({
        profile: null,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete profile.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearProfile = useCallback(() => {
    setState((previous) => ({
      ...previous,
      profile: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    getProfileById,
    getProfileByEmail,
    createProfile,
    updateProfile,
    deleteProfile,
    clearProfile,
    clearError,
  };
}