"use client";

import { useCallback, useState } from "react";

import { checkInService } from "@/services/checkInService";

import type { CheckInRecord } from "@/types";

interface UseCheckInState {
  checkIn: CheckInRecord | null;
  checkIns: CheckInRecord[];
  loading: boolean;
  error: string | null;
}

export function useCheckIn() {
  const [state, setState] = useState<UseCheckInState>({
    checkIn: null,
    checkIns: [],
    loading: false,
    error: null,
  });

  const fetchCheckIns = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await checkInService.getMyCheckIns();

      setState((previous) => ({
        ...previous,
        checkIns: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch check-ins.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getCheckInById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const checkIn =
          await checkInService.getCheckInById(id);

        setState((previous) => ({
          ...previous,
          checkIn,
          loading: false,
          error: null,
        }));

        return checkIn;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch check-in.";

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

  const getCheckInByBooking = useCallback(
    async (bookingId: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const checkIns =
          await checkInService.getCheckInByBooking(
            bookingId,
          );

        setState((previous) => ({
          ...previous,
          checkIn: checkIns[0] ?? null,
          checkIns,
          loading: false,
          error: null,
        }));

        return checkIns;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch check-in.";

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

  const createCheckIn = async (
    data: Parameters<
      typeof checkInService.createCheckIn
    >[0],
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const checkIn =
        await checkInService.createCheckIn(data);

      setState((previous) => ({
        ...previous,
        checkIn,
        checkIns: [...previous.checkIns, checkIn],
        loading: false,
        error: null,
      }));

      return checkIn;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create check-in.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const completeCheckIn = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const checkIn =
          await checkInService.completeCheckIn(id);

        setState((previous) => ({
          ...previous,
          checkIn,
          checkIns: previous.checkIns.map((item) =>
            item.id === id ? checkIn : item,
          ),
          loading: false,
          error: null,
        }));

        return checkIn;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to complete check-in.";

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

  const cancelCheckIn = useCallback(
    async (id: string, reason: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const checkIn =
          await checkInService.cancelCheckIn(id, reason);

        setState((previous) => ({
          ...previous,
          checkIn,
          checkIns: previous.checkIns.map((item) =>
            item.id === id ? checkIn : item,
          ),
          loading: false,
          error: null,
        }));

        return checkIn;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to cancel check-in.";

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

  const clearCheckIn = useCallback(() => {
    setState((previous) => ({
      ...previous,
      checkIn: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    checkIn: state.checkIn,
    checkIns: state.checkIns,
    loading: state.loading,
    error: state.error,
    fetchCheckIns,
    getCheckInById,
    getCheckInByBooking,
    createCheckIn,
    completeCheckIn,
    cancelCheckIn,
    clearCheckIn,
    clearError,
  };
}