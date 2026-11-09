"use client";

import { useCallback, useState } from "react";

import {
  tripService,
  type CreateTripData,
  type TripFilters,
  type UpdateTripData,
} from "@/services/tripService";

import type {
  Trip,
  TripStatus,
} from "@/types";

interface UseTripsState {
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
}

export function useTrips() {
  const [state, setState] =
    useState<UseTripsState>({
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
      const data =
        await tripService.getTrips();

      setState({
        trips: data,
        selectedTrip: null,
        loading: false,
        error: null,
      });

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
        const data =
          await tripService.getTripById(id);

        setState((previous) => ({
          ...previous,
          selectedTrip: data,
          loading: false,
          error: null,
        }));

        return data;
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

  const getTripsByUser = useCallback(
    async () => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data = await tripService.getTripsByUser();

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
            : "Failed to fetch user trips.";

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

  const getTripByBooking = useCallback(
    async (bookingId: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await tripService.getTripByBooking(
            bookingId,
          );

        setState((previous) => ({
          ...previous,
          selectedTrip: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch booking trip.";

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

  const createTrip = async (
    data: CreateTripData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const createdTrip =
        await tripService.createTrip(data);

      setState((previous) => ({
        ...previous,
        trips: [
          ...previous.trips,
          createdTrip,
        ],
        selectedTrip: createdTrip,
        loading: false,
        error: null,
      }));

      return createdTrip;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create trip.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

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
        await tripService.updateTrip(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        trips: previous.trips.map(
          (trip) =>
            trip.id === updatedTrip.id
              ? updatedTrip
              : trip,
        ),
        selectedTrip:
          previous.selectedTrip?.id ===
          updatedTrip.id
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

  const updateTripStatus = async (
    id: string,
    status: TripStatus,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedTrip =
        await tripService.updateTripStatus(
          id,
          status,
        );

      setState((previous) => ({
        ...previous,
        trips: previous.trips.map(
          (trip) =>
            trip.id === updatedTrip.id
              ? updatedTrip
              : trip,
        ),
        selectedTrip:
          previous.selectedTrip?.id ===
          updatedTrip.id
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
          : "Failed to update trip status.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const cancelTrip = async (
    id: string,
  ) => {
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
        trips: previous.trips.map(
          (trip) =>
            trip.id === cancelledTrip.id
              ? cancelledTrip
              : trip,
        ),
        selectedTrip:
          previous.selectedTrip?.id ===
          cancelledTrip.id
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

  const deleteTrip = async (
    id: string,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await tripService.deleteTrip(id);

      setState((previous) => ({
        ...previous,
        trips: previous.trips.filter(
          (trip) => trip.id !== id,
        ),
        selectedTrip:
          previous.selectedTrip?.id === id
            ? null
            : previous.selectedTrip,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete trip.";

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
    getTripsByUser,
    getTripByBooking,
    getTripsByFilters,
    createTrip,
    updateTrip,
    updateTripStatus,
    cancelTrip,
    deleteTrip,
    clearSelectedTrip,
    clearError,
  };
}