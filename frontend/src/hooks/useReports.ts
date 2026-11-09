"use client";

import { useCallback, useState } from "react";

import {
  reportService,
  type ReportData,
} from "@/services/reportService";

interface UseReportsState<T = unknown> {
  reports: ReportData<T> | null;
  loading: boolean;
  error: string | null;
}

export function useReports<T = unknown>() {
  const [state, setState] =
    useState<UseReportsState<T>>({
      reports: null,
      loading: false,
      error: null,
    });

  const fetchReports = useCallback(
    async (
      filters?: Parameters<
        typeof reportService.getReports
      >[0],
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await reportService.getReports<T>(filters);

        setState({
          reports: data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch reports.";

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

  const fetchBookingReport = useCallback(
    async (
      filters?: Parameters<
        typeof reportService.getBookingReport
      >[0],
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await reportService.getBookingReport<T>(
            filters,
          );

        setState({
          reports: data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch booking report.";

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

  const fetchFlightReport = useCallback(
    async (
      filters?: Parameters<
        typeof reportService.getFlightReport
      >[0],
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await reportService.getFlightReport<T>(
            filters,
          );

        setState({
          reports: data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch flight report.";

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

  const fetchPassengerReport = useCallback(
    async (
      filters?: Parameters<
        typeof reportService.getPassengerReport
      >[0],
    ) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await reportService.getPassengerReport<T>(
            filters,
          );

        setState({
          reports: data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch passenger report.";

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

  const clearReports = useCallback(() => {
    setState((previous) => ({
      ...previous,
      reports: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    reports: state.reports,
    loading: state.loading,
    error: state.error,
    fetchReports,
    fetchBookingReport,
    fetchFlightReport,
    fetchPassengerReport,
    clearReports,
    clearError,
  };
}