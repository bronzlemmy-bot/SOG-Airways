"use client";

import { useCallback, useState } from "react";

import {
  aircraftService,
  type AircraftFilters,
  type CreateAircraftData,
  type UpdateAircraftData,
} from "@/services/aircraftService";

import type { Aircraft } from "@/types";

interface UseAircraftState {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  loading: boolean;
  error: string | null;
}

export function useAircraft() {
  const [state, setState] = useState<UseAircraftState>({
    aircraft: [],
    selectedAircraft: null,
    loading: false,
    error: null,
  });

  const fetchAircraft = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await aircraftService.getAircraft();

      setState({
        aircraft: data,
        selectedAircraft: null,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch aircraft.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getAircraftById = useCallback(async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const aircraft =
        await aircraftService.getAircraftById(id);

      setState((previous) => ({
        ...previous,
        selectedAircraft: aircraft,
        loading: false,
        error: null,
      }));

      return aircraft;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch aircraft.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getAircraftByFilters = useCallback(
    async (filters: AircraftFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await aircraftService.getAircraftByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          aircraft: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter aircraft.";

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

  const createAircraft = useCallback(
    async (data: CreateAircraftData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const aircraft =
          await aircraftService.createAircraft(data);

        setState((previous) => ({
          ...previous,
          aircraft: [...previous.aircraft, aircraft],
          selectedAircraft: aircraft,
          loading: false,
          error: null,
        }));

        return aircraft;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create aircraft.";

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

  const updateAircraft = useCallback(
    async (
      id: string,
      data: UpdateAircraftData,
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const updatedAircraft =
          await aircraftService.updateAircraft(
            id,
            data,
          );

        setState((previous) => ({
          ...previous,
          aircraft: previous.aircraft.map((item) =>
            item.id === id
              ? updatedAircraft
              : item,
          ),
          selectedAircraft:
            previous.selectedAircraft?.id === id
              ? updatedAircraft
              : previous.selectedAircraft,
          loading: false,
          error: null,
        }));

        return updatedAircraft;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update aircraft.";

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

  const deleteAircraft = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await aircraftService.deleteAircraft(id);

        setState((previous) => ({
          ...previous,
          aircraft: previous.aircraft.filter(
            (item) => item.id !== id,
          ),
          selectedAircraft:
            previous.selectedAircraft?.id === id
              ? null
              : previous.selectedAircraft,
          loading: false,
          error: null,
        }));

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete aircraft.";

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

  const clearSelectedAircraft = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedAircraft: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    aircraft: state.aircraft,
    selectedAircraft: state.selectedAircraft,
    loading: state.loading,
    error: state.error,
    fetchAircraft,
    getAircraftById,
    getAircraftByFilters,
    createAircraft,
    updateAircraft,
    deleteAircraft,
    clearSelectedAircraft,
    clearError,
  };
}