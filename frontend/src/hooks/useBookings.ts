"use client";

import { useCallback, useState } from "react";

import {
  bookingService,
  type BookingFilters,
  type CreateBookingData,
  type UpdateBookingData,
} from "@/services/bookingService";

import type { Booking, CustomerBookingDetails } from "@/types";

interface UseBookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  managedBooking: CustomerBookingDetails | null;
  loading: boolean;
  error: string | null;
}

export function useBooking() {
  const [state, setState] = useState<UseBookingState>({
    bookings: [],
    selectedBooking: null,
    managedBooking: null,
    loading: false,
    error: null,
  });

  const fetchBookings = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await bookingService.getBookings();

      setState({
        bookings: data,
        selectedBooking: null,
        managedBooking: null,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch bookings.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getBookingById = useCallback(async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const booking = await bookingService.getBookingById(id);

      setState((previous) => ({
        ...previous,
        selectedBooking: booking,
        loading: false,
        error: null,
      }));

      return booking;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch booking.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getBookingByReference = useCallback(
    async (reference: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const booking =
          await bookingService.getBookingByReference(reference);

        setState((previous) => ({
          ...previous,
          selectedBooking: booking,
          loading: false,
          error: null,
        }));

        return booking;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch booking by reference.";

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

  const findManageBooking = useCallback(
    async (reference: string, lastName: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
        selectedBooking: null,
        managedBooking: null,
      }));

      try {
        const booking = await bookingService.findManageBooking(
          reference,
          lastName,
        );

        if (!booking) {
          setState((previous) => ({
            ...previous,
            loading: false,
            managedBooking: null,
            error:
              "No booking matched those details. Check your booking reference and passenger surname.",
          }));

          return null;
        }

        setState((previous) => ({
          ...previous,
          managedBooking: booking,
          loading: false,
          error: null,
        }));

        return booking;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to look up your booking. Please try again.";

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

  const getBookingsByFilters = useCallback(
    async (filters: BookingFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await bookingService.getBookingsByFilters(filters);

        setState((previous) => ({
          ...previous,
          bookings: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter bookings.";

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

  const createBooking = useCallback(
    async (data: CreateBookingData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const booking = await bookingService.createBooking(data);

        setState((previous) => ({
          ...previous,
          bookings: [...previous.bookings, booking],
          selectedBooking: booking,
          loading: false,
          error: null,
        }));

        return booking;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create booking.";

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

  const updateBooking = useCallback(
    async (id: string, data: UpdateBookingData) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const updatedBooking =
          await bookingService.updateBooking(id, data);

        setState((previous) => ({
          ...previous,
          bookings: previous.bookings.map((item) =>
            item.id === id ? updatedBooking : item,
          ),
          selectedBooking:
            previous.selectedBooking?.id === id
              ? updatedBooking
              : previous.selectedBooking,
          loading: false,
          error: null,
        }));

        return updatedBooking;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update booking.";

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

  const cancelBooking = useCallback(async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const cancelledBooking = await bookingService.cancelBooking(id);

      setState((previous) => ({
        ...previous,
        bookings: previous.bookings.map((item) =>
          item.id === id ? cancelledBooking : item,
        ),
        selectedBooking:
          previous.selectedBooking?.id === id
            ? cancelledBooking
            : previous.selectedBooking,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel booking.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await bookingService.deleteBooking(id);

      setState((previous) => ({
        ...previous,
        bookings: previous.bookings.filter((item) => item.id !== id),
        selectedBooking:
          previous.selectedBooking?.id === id
            ? null
            : previous.selectedBooking,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete booking.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const clearSelectedBooking = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedBooking: null,
      managedBooking: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    bookings: state.bookings,
    selectedBooking: state.selectedBooking,
    managedBooking: state.managedBooking,
    loading: state.loading,
    error: state.error,
    fetchBookings,
    getBookingById,
    getBookingByReference,
    findManageBooking,
    getBookingsByFilters,
    createBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    clearSelectedBooking,
    clearError,
  };
}