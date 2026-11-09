"use client";

import { useCallback, useState } from "react";

import {
  supportService,
  type CreateSupportMessageData,
  type CreateSupportTicketData,
  type SupportTicketFilters,
  type UpdateSupportTicketData,
} from "@/services/supportService";

import type {
  SupportTicket,
  SupportTicketStatus,
} from "@/types";

interface UseSupportState {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  loading: boolean;
  error: string | null;
}

export function useSupport() {
  const [state, setState] =
    useState<UseSupportState>({
      tickets: [],
      selectedTicket: null,
      loading: false,
      error: null,
    });

  const fetchTickets = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data =
        await supportService.getTickets();

      setState({
        tickets: data,
        selectedTicket: null,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch support tickets.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getTicketById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await supportService.getTicketById(id);

        setState((previous) => ({
          ...previous,
          selectedTicket: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch support ticket.";

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

  const getTicketsByUser = useCallback(
    async () => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await supportService.getTicketsByUser();

        setState((previous) => ({
          ...previous,
          tickets: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch user support tickets.";

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

  const getTicketsByFilters = useCallback(
    async (filters: SupportTicketFilters) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await supportService.getTicketsByFilters(
            filters,
          );

        setState((previous) => ({
          ...previous,
          tickets: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to filter support tickets.";

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

  const createTicket = async (
    data: CreateSupportTicketData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const createdTicket =
        await supportService.createTicket(data);

      setState((previous) => ({
        ...previous,
        tickets: [
          ...previous.tickets,
          createdTicket,
        ],
        selectedTicket: createdTicket,
        loading: false,
        error: null,
      }));

      return createdTicket;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create support ticket.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateTicket = async (
    id: string,
    data: UpdateSupportTicketData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedTicket =
        await supportService.updateTicket(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        tickets: previous.tickets.map(
          (ticket) =>
            ticket.id === updatedTicket.id
              ? updatedTicket
              : ticket,
        ),
        selectedTicket:
          previous.selectedTicket?.id ===
          updatedTicket.id
            ? updatedTicket
            : previous.selectedTicket,
        loading: false,
        error: null,
      }));

      return updatedTicket;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update support ticket.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateTicketStatus = async (
    id: string,
    status: SupportTicketStatus,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedTicket =
        await supportService.updateTicketStatus(
          id,
          status,
        );

      setState((previous) => ({
        ...previous,
        tickets: previous.tickets.map(
          (ticket) =>
            ticket.id === updatedTicket.id
              ? updatedTicket
              : ticket,
        ),
        selectedTicket:
          previous.selectedTicket?.id ===
          updatedTicket.id
            ? updatedTicket
            : previous.selectedTicket,
        loading: false,
        error: null,
      }));

      return updatedTicket;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update ticket status.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const addMessage = async (
    data: CreateSupportMessageData,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await supportService.addMessage(data);

      setState((previous) => ({
        ...previous,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add support message.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const closeTicket = async (
    id: string,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const closedTicket =
        await supportService.closeTicket(id);

      setState((previous) => ({
        ...previous,
        tickets: previous.tickets.map(
          (ticket) =>
            ticket.id === closedTicket.id
              ? closedTicket
              : ticket,
        ),
        selectedTicket:
          previous.selectedTicket?.id ===
          closedTicket.id
            ? closedTicket
            : previous.selectedTicket,
        loading: false,
        error: null,
      }));

      return closedTicket;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to close support ticket.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deleteTicket = async (
    id: string,
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await supportService.deleteTicket(id);

      setState((previous) => ({
        ...previous,
        tickets: previous.tickets.filter(
          (ticket) => ticket.id !== id,
        ),
        selectedTicket:
          previous.selectedTicket?.id === id
            ? null
            : previous.selectedTicket,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete support ticket.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedTicket = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedTicket: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    tickets: state.tickets,
    selectedTicket: state.selectedTicket,
    loading: state.loading,
    error: state.error,
    fetchTickets,
    getTicketById,
    getTicketsByUser,
    getTicketsByFilters,
    createTicket,
    updateTicket,
    updateTicketStatus,
    addMessage,
    closeTicket,
    deleteTicket,
    clearSelectedTicket,
    clearError,
  };
}