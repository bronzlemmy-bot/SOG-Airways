"use client";

import { useCallback, useState } from "react";

import {
  passengerService,
  type CreatePassengerData,
  type PassengerFilters,
  type UpdatePassengerData,
} from "@/services/passengerService";

import type { Passenger } from "@/types";

interface UsePassengersState {
  passengers: Passenger[];
  selectedPassenger: Passenger | null;
  loading: boolean;
  error: string | null;
}

export function usePassengers() {
  const [state, setState] = useState<UsePassengersState>({
    passengers: [],
    selectedPassenger: null,
    loading: false,
    error: null,
  });

  const fetchPassengers = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await passengerService.getPassengers();

      setState((previous) => ({
        ...previous,
        passengers: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch passengers.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getPassengerById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const passenger =
          await passengerService.getPassengerById(id);

        setState((previous) => ({
          ...previous,
          selectedPassenger: passenger,
          loading: false,
          error: null,
        }));

        return passenger;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch passenger.";

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

  const getPassengersByBooking = useCallback(
    async (bookingId: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await passengerService.getPassengersByBooking(
            bookingId,
          );

        setState((previous) => ({
          ...previous,
          passengers: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch booking passengers.";

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

  const getPassengersByFilters = useCallback(
    async (filters: PassengerFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await passengerService.getPassengersByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          passengers: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter passengers.";

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

  const createPassenger = async (
    data: CreatePassengerData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const passenger =
        await passengerService.createPassenger(data);

      setState((previous) => ({
        ...previous,
        passengers: [
          ...previous.passengers,
          passenger,
        ],
        selectedPassenger: passenger,
        loading: false,
        error: null,
      }));

      return passenger;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create passenger.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updatePassenger = async (
    id: string,
    data: UpdatePassengerData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedPassenger =
        await passengerService.updatePassenger(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        passengers: previous.passengers.map(
          (item) =>
            item.id === id
              ? updatedPassenger
              : item,
        ),
        selectedPassenger:
          previous.selectedPassenger?.id === id
            ? updatedPassenger
            : previous.selectedPassenger,
        loading: false,
        error: null,
      }));

      return updatedPassenger;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update passenger.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deletePassenger = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await passengerService.deletePassenger(id);

      setState((previous) => ({
        ...previous,
        passengers: previous.passengers.filter(
          (item) => item.id !== id,
        ),
        selectedPassenger:
          previous.selectedPassenger?.id === id
            ? null
            : previous.selectedPassenger,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete passenger.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedPassenger = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedPassenger: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    passengers: state.passengers,
    selectedPassenger: state.selectedPassenger,
    loading: state.loading,
    error: state.error,
    fetchPassengers,
    getPassengerById,
    getPassengersByBooking,
    getPassengersByFilters,
    createPassenger,
    updatePassenger,
    deletePassenger,
    clearSelectedPassenger,
    clearError,
  };
}