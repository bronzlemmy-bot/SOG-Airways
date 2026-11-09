"use client";

import { useCallback, useState } from "react";

import {
  paymentService,
  type CreatePaymentData,
  type UpdatePaymentData,
} from "@/services/paymentService";

import type {
  Payment,
  PaymentStatus,
} from "@/types";

interface UsePaymentMethodState {
  payments: Payment[];
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

export function usePaymentMethod() {
  const [state, setState] =
    useState<UsePaymentMethodState>({
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
      const payments =
        await paymentService.getPayments();

      setState({
        payments,
        selectedPayment: null,
        loading: false,
        error: null,
      });

      return payments;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch payment methods.";

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
            : "Failed to fetch payment method.";

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

  const getPaymentsByUser = useCallback(
    async (userId: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const payments =
          await paymentService.getPaymentsByUser(
            userId,
          );

        setState((previous) => ({
          ...previous,
          payments,
          loading: false,
          error: null,
        }));

        return payments;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch user payment methods.";

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

  const getPaymentsByBooking = useCallback(
    async (bookingId: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const payments =
          await paymentService.getPaymentsByBooking(
            bookingId,
          );

        setState((previous) => ({
          ...previous,
          payments,
          loading: false,
          error: null,
        }));

        return payments;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch booking payments.";

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
        payments: [
          ...previous.payments,
          payment,
        ],
        selectedPayment: payment,
        loading: false,
        error: null,
      }));

      return payment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add payment method.";

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
      const payment =
        await paymentService.updatePayment(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        payments: previous.payments.map(
          (item) =>
            item.id === id ? payment : item,
        ),
        selectedPayment:
          previous.selectedPayment?.id === id
            ? payment
            : previous.selectedPayment,
        loading: false,
        error: null,
      }));

      return payment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update payment method.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updatePaymentStatus = async (
    id: string,
    status: PaymentStatus,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const payment =
        await paymentService.updatePaymentStatus(
          id,
          status,
        );

      setState((previous) => ({
        ...previous,
        payments: previous.payments.map(
          (item) =>
            item.id === id ? payment : item,
        ),
        selectedPayment:
          previous.selectedPayment?.id === id
            ? payment
            : previous.selectedPayment,
        loading: false,
        error: null,
      }));

      return payment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update payment status.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const processPayment = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const payment =
        await paymentService.processPayment(id);

      setState((previous) => ({
        ...previous,
        payments: previous.payments.map(
          (item) =>
            item.id === id ? payment : item,
        ),
        selectedPayment:
          previous.selectedPayment?.id === id
            ? payment
            : previous.selectedPayment,
        loading: false,
        error: null,
      }));

      return payment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to process payment.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const refundPayment = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const payment =
        await paymentService.refundPayment(id);

      setState((previous) => ({
        ...previous,
        payments: previous.payments.map(
          (item) =>
            item.id === id ? payment : item,
        ),
        selectedPayment:
          previous.selectedPayment?.id === id
            ? payment
            : previous.selectedPayment,
        loading: false,
        error: null,
      }));

      return payment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to refund payment.";

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
          : "Failed to delete payment method.";

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
    getPaymentsByUser,
    getPaymentsByBooking,
    createPayment,
    updatePayment,
    updatePaymentStatus,
    processPayment,
    refundPayment,
    deletePayment,
    clearSelectedPayment,
    clearError,
  };
}