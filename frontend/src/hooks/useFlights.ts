"use client";

import { useCallback, useState } from "react";

import {
  flightService,
  type CreateFlightData,
  type FlightFilters,
  type UpdateFlightData,
} from "@/services/flightService";

import type { Flight } from "@/types";

interface UseFlightState {
  flights: Flight[];
  selectedFlight: Flight | null;
  loading: boolean;
  error: string | null;
}

export function useFlight() {
  const [state, setState] = useState<UseFlightState>({
    flights: [],
    selectedFlight: null,
    loading: false,
    error: null,
  });

  const fetchFlights = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await flightService.getFlights();

      setState((previous) => ({
        ...previous,
        flights: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch flights.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getFlightById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const flight =
          await flightService.getFlightById(id);

        setState((previous) => ({
          ...previous,
          selectedFlight: flight,
          loading: false,
          error: null,
        }));

        return flight;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch flight.";

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

  const getFlightsByFilters = useCallback(
    async (filters: FlightFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await flightService.getFlightsByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          flights: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter flights.";

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

  const createFlight = async (
    data: CreateFlightData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const flight =
        await flightService.createFlight(data);

      setState((previous) => ({
        ...previous,
        flights: [...previous.flights, flight],
        selectedFlight: flight,
        loading: false,
        error: null,
      }));

      return flight;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create flight.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateFlight = async (
    id: string,
    data: UpdateFlightData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedFlight =
        await flightService.updateFlight(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        flights: previous.flights.map((item) =>
          item.id === id
            ? updatedFlight
            : item,
        ),
        selectedFlight:
          previous.selectedFlight?.id === id
            ? updatedFlight
            : previous.selectedFlight,
        loading: false,
        error: null,
      }));

      return updatedFlight;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update flight.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deleteFlight = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await flightService.deleteFlight(id);

      setState((previous) => ({
        ...previous,
        flights: previous.flights.filter(
          (item) => item.id !== id,
        ),
        selectedFlight:
          previous.selectedFlight?.id === id
            ? null
            : previous.selectedFlight,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete flight.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedFlight = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedFlight: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    flights: state.flights,
    selectedFlight: state.selectedFlight,
    loading: state.loading,
    error: state.error,
    fetchFlights,
    getFlightById,
    getFlightsByFilters,
    createFlight,
    updateFlight,
    deleteFlight,
    clearSelectedFlight,
    clearError,
  };
}