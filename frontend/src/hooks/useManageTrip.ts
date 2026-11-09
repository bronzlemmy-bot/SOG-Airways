"use client";

import { useCallback, useState } from "react";

import {
  tripService,
  type TripFilters,
  type UpdateTripData,
} from "@/services/tripService";

import type { Trip } from "@/types";

interface UseManageTripState {
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
}

export function useManageTrip() {
  const [state, setState] = useState<UseManageTripState>({
    trips: [],
    selectedTrip: null,
    loading: false,
    error: null,
  });

  const fetchTrips = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await tripService.getTrips();

      setState((previous) => ({
        ...previous,
        trips: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch trips.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getTripById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const trip =
          await tripService.getTripById(id);

        setState((previous) => ({
          ...previous,
          selectedTrip: trip,
          loading: false,
          error: null,
        }));

        return trip;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch trip.";

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

  const getTripsByFilters = useCallback(
    async (filters: TripFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await tripService.getTripsByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          trips: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter trips.";

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

  const updateTrip = async (
    id: string,
    data: UpdateTripData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedTrip =
        await tripService.updateTrip(id, data);

      setState((previous) => ({
        ...previous,
        trips: previous.trips.map((item) =>
          item.id === id
            ? updatedTrip
            : item,
        ),
        selectedTrip:
          previous.selectedTrip?.id === id
            ? updatedTrip
            : previous.selectedTrip,
        loading: false,
        error: null,
      }));

      return updatedTrip;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update trip.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const cancelTrip = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const cancelledTrip =
        await tripService.cancelTrip(id);

      setState((previous) => ({
        ...previous,
        trips: previous.trips.map((item) =>
          item.id === id
            ? cancelledTrip
            : item,
        ),
        selectedTrip:
          previous.selectedTrip?.id === id
            ? cancelledTrip
            : previous.selectedTrip,
        loading: false,
        error: null,
      }));

      return cancelledTrip;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel trip.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedTrip = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedTrip: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    trips: state.trips,
    selectedTrip: state.selectedTrip,
    loading: state.loading,
    error: state.error,
    fetchTrips,
    getTripById,
    getTripsByFilters,
    updateTrip,
    cancelTrip,
    clearSelectedTrip,
    clearError,
  };
}