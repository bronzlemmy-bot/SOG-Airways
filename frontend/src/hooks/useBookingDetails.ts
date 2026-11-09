"use client";

import { useCallback, useState } from "react";

import { bookingService } from "@/services/bookingService";

import type { Booking } from "@/types";

interface UseBookingDetailsState {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
}

export function useBookingDetails() {
  const [state, setState] =
    useState<UseBookingDetailsState>({
      booking: null,
      loading: false,
      error: null,
    });

  const fetchBookingDetails = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const booking =
          await bookingService.getBookingById(id);

        setState({
          booking,
          loading: false,
          error: null,
        });

        return booking;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch booking details.";

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

  const refreshBookingDetails = async () => {
    const bookingId = state.booking?.id;

    if (!bookingId) {
      return null;
    }

    return fetchBookingDetails(bookingId);
  };

  const clearBooking = useCallback(() => {
    setState({
      booking: null,
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
    booking: state.booking,
    loading: state.loading,
    error: state.error,
    fetchBookingDetails,
    refreshBookingDetails,
    clearBooking,
    clearError,
  };
}