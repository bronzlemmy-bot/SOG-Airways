"use client";

import { useCallback, useState } from "react";

import {
  staffService,
  type CreateStaffData,
  type StaffFilters,
  type UpdateStaffData,
} from "@/services/staffService";

import type {
  Staff,
  StaffStatus,
} from "@/types";

interface UseStaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  loading: boolean;
  error: string | null;
}

export function useStaff() {
  const [state, setState] =
    useState<UseStaffState>({
      staff: [],
      selectedStaff: null,
      loading: false,
      error: null,
    });

  const fetchStaff = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data =
        await staffService.getStaff();

      setState({
        staff: data,
        selectedStaff: null,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch staff.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getStaffById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await staffService.getStaffById(id);

        setState((previous) => ({
          ...previous,
          selectedStaff: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch staff member.";

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

  const getStaffByFilters = useCallback(
    async (filters: StaffFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await staffService.getStaffByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          staff: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter staff.";

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

  const createStaff = async (
    data: CreateStaffData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const createdStaff =
        await staffService.createStaff(data);

      setState((previous) => ({
        ...previous,
        staff: [
          ...previous.staff,
          createdStaff,
        ],
        selectedStaff: createdStaff,
        loading: false,
        error: null,
      }));

      return createdStaff;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create staff member.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateStaff = async (
    id: string,
    data: UpdateStaffData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedStaff =
        await staffService.updateStaff(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        staff: previous.staff.map(
          (member) =>
            member.id === updatedStaff.id
              ? updatedStaff
              : member,
        ),
        selectedStaff:
          previous.selectedStaff?.id ===
          updatedStaff.id
            ? updatedStaff
            : previous.selectedStaff,
        loading: false,
        error: null,
      }));

      return updatedStaff;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update staff member.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateStaffStatus = async (
    id: string,
    status: StaffStatus,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedStaff =
        await staffService.updateStaffStatus(
          id,
          status,
        );

      setState((previous) => ({
        ...previous,
        staff: previous.staff.map(
          (member) =>
            member.id === updatedStaff.id
              ? updatedStaff
              : member,
        ),
        selectedStaff:
          previous.selectedStaff?.id ===
          updatedStaff.id
            ? updatedStaff
            : previous.selectedStaff,
        loading: false,
        error: null,
      }));

      return updatedStaff;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update staff status.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deleteStaff = async (
    id: string,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await staffService.deleteStaff(id);

      setState((previous) => ({
        ...previous,
        staff: previous.staff.filter(
          (member) => member.id !== id,
        ),
        selectedStaff:
          previous.selectedStaff?.id === id
            ? null
            : previous.selectedStaff,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete staff member.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedStaff = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedStaff: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    staff: state.staff,
    selectedStaff: state.selectedStaff,
    loading: state.loading,
    error: state.error,
    fetchStaff,
    getStaffById,
    getStaffByFilters,
    createStaff,
    updateStaff,
    updateStaffStatus,
    deleteStaff,
    clearSelectedStaff,
    clearError,
  };
}