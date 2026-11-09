"use client";

import { useCallback, useState } from "react";

import {
  customerService,
  type CustomerFilters,
  type CreateCustomerData,
  type UpdateCustomerData,
} from "@/services/customerService";

import type { Customer } from "@/types";

interface UseCustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

export function useCustomer() {
  const [state, setState] = useState<UseCustomerState>({
    customers: [],
    selectedCustomer: null,
    loading: false,
    error: null,
  });

  const fetchCustomers = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await customerService.getCustomers();

      setState((previous) => ({
        ...previous,
        customers: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch customers.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getCustomerById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const customer =
          await customerService.getCustomerById(id);

        setState((previous) => ({
          ...previous,
          selectedCustomer: customer,
          loading: false,
          error: null,
        }));

        return customer;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch customer.";

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

  const getCustomerByEmail = useCallback(
    async (email: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const customer =
          await customerService.getCustomerByEmail(
            email,
          );

        setState((previous) => ({
          ...previous,
          selectedCustomer: customer,
          loading: false,
          error: null,
        }));

        return customer;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch customer.";

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

  const getCustomersByFilters = useCallback(
    async (filters: CustomerFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await customerService.getCustomersByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          customers: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter customers.";

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

  const createCustomer = async (
    data: CreateCustomerData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const customer =
        await customerService.createCustomer(data);

      setState((previous) => ({
        ...previous,
        customers: [...previous.customers, customer],
        selectedCustomer: customer,
        loading: false,
        error: null,
      }));

      return customer;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create customer.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateCustomer = async (
    id: string,
    data: UpdateCustomerData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedCustomer =
        await customerService.updateCustomer(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        customers: previous.customers.map((item) =>
          item.id === id
            ? updatedCustomer
            : item,
        ),
        selectedCustomer:
          previous.selectedCustomer?.id === id
            ? updatedCustomer
            : previous.selectedCustomer,
        loading: false,
        error: null,
      }));

      return updatedCustomer;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update customer.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await customerService.deleteCustomer(id);

      setState((previous) => ({
        ...previous,
        customers: previous.customers.filter(
          (item) => item.id !== id,
        ),
        selectedCustomer:
          previous.selectedCustomer?.id === id
            ? null
            : previous.selectedCustomer,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete customer.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedCustomer = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedCustomer: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    customers: state.customers,
    selectedCustomer: state.selectedCustomer,
    loading: state.loading,
    error: state.error,
    fetchCustomers,
    getCustomerById,
    getCustomerByEmail,
    getCustomersByFilters,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearSelectedCustomer,
    clearError,
  };
}