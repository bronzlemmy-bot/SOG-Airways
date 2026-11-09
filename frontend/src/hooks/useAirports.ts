"use client";

import { useCallback, useState } from "react";

import {
  airportService,
  type AirportFilters,
  type CreateAirportData,
  type UpdateAirportData,
} from "@/services/airportService";

import type { Airport } from "@/types";

interface UseAirportState {
  airports: Airport[];
  selectedAirport: Airport | null;
  loading: boolean;
  error: string | null;
}

export function useAirport() {
  const [state, setState] = useState<UseAirportState>({
    airports: [],
    selectedAirport: null,
    loading: false,
    error: null,
  });

  const fetchAirports = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await airportService.getAirports();

      setState({
        airports: data,
        selectedAirport: null,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch airports.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getAirportById = useCallback(async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const airport =
        await airportService.getAirportById(id);

      setState((previous) => ({
        ...previous,
        selectedAirport: airport,
        loading: false,
        error: null,
      }));

      return airport;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch airport.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getAirportByCode = useCallback(
    async (code: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const airport =
          await airportService.getAirportByCode(code);

        setState((previous) => ({
          ...previous,
          selectedAirport: airport,
          loading: false,
          error: null,
        }));

        return airport;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch airport by code.";

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

  const getAirportByFilters = useCallback(
    async (filters: AirportFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await airportService.getAirportByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          airports: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter airports.";

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

  const createAirport = useCallback(
    async (data: CreateAirportData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const airport =
          await airportService.createAirport(data);

        setState((previous) => ({
          ...previous,
          airports: [...previous.airports, airport],
          selectedAirport: airport,
          loading: false,
          error: null,
        }));

        return airport;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create airport.";

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

  const updateAirport = useCallback(
    async (
      id: string,
      data: UpdateAirportData,
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const updatedAirport =
          await airportService.updateAirport(id, data);

        setState((previous) => ({
          ...previous,
          airports: previous.airports.map((item) =>
            item.id === id
              ? updatedAirport
              : item,
          ),
          selectedAirport:
            previous.selectedAirport?.id === id
              ? updatedAirport
              : previous.selectedAirport,
          loading: false,
          error: null,
        }));

        return updatedAirport;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update airport.";

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

  const deleteAirport = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        await airportService.deleteAirport(id);

        setState((previous) => ({
          ...previous,
          airports: previous.airports.filter(
            (item) => item.id !== id,
          ),
          selectedAirport:
            previous.selectedAirport?.id === id
              ? null
              : previous.selectedAirport,
          loading: false,
          error: null,
        }));

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete airport.";

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

  const clearSelectedAirport = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedAirport: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    airports: state.airports,
    selectedAirport: state.selectedAirport,
    loading: state.loading,
    error: state.error,
    fetchAirports,
    getAirportById,
    getAirportByCode,
    getAirportByFilters,
    createAirport,
    updateAirport,
    deleteAirport,
    clearSelectedAirport,
    clearError,
  };
}