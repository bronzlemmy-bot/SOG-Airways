"use client";

import { useCallback, useState } from "react";

import {
  paymentService,
  type CreatePaymentData,
  type PaymentFilters,
  type UpdatePaymentData,
} from "@/services/paymentService";

import type { Payment } from "@/types";

interface UsePaymentState {
  payments: Payment[];
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

export function usePayment() {
  const [state, setState] = useState<UsePaymentState>({
    payments: [],
    selectedPayment: null,
    loading: false,
    error: null,
  });

  const fetchPayments = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await paymentService.getPayments();

      setState((previous) => ({
        ...previous,
        payments: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch payments.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getPaymentById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const payment =
          await paymentService.getPaymentById(id);

        setState((previous) => ({
          ...previous,
          selectedPayment: payment,
          loading: false,
          error: null,
        }));

        return payment;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch payment.";

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

  const getPaymentsByFilters = useCallback(
    async (filters: PaymentFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await paymentService.getPaymentsByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          payments: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter payments.";

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

  const createPayment = async (
    data: CreatePaymentData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const payment =
        await paymentService.createPayment(data);

      setState((previous) => ({
        ...previous,
        payments: [...previous.payments, payment],
        selectedPayment: payment,
        loading: false,
        error: null,
      }));

      return payment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create payment.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updatePayment = async (
    id: string,
    data: UpdatePaymentData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedPayment =
        await paymentService.updatePayment(id, data);

      setState((previous) => ({
        ...previous,
        payments: previous.payments.map((item) =>
          item.id === id ? updatedPayment : item,
        ),
        selectedPayment:
          previous.selectedPayment?.id === id
            ? updatedPayment
            : previous.selectedPayment,
        loading: false,
        error: null,
      }));

      return updatedPayment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update payment.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await paymentService.deletePayment(id);

      setState((previous) => ({
        ...previous,
        payments: previous.payments.filter(
          (item) => item.id !== id,
        ),
        selectedPayment:
          previous.selectedPayment?.id === id
            ? null
            : previous.selectedPayment,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete payment.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedPayment = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedPayment: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    payments: state.payments,
    selectedPayment: state.selectedPayment,
    loading: state.loading,
    error: state.error,
    fetchPayments,
    getPaymentById,
    getPaymentsByFilters,
    createPayment,
    updatePayment,
    deletePayment,
    clearSelectedPayment,
    clearError,
  };
}