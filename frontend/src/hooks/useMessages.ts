"use client";

import { useCallback, useState } from "react";

import { messageService } from "@/services/messageService";

import type { Message } from "@/types";

interface UseMessagesState {
  messages: Message[];
  selectedMessage: Message | null;
  loading: boolean;
  error: string | null;
}

export function useMessages() {
  const [state, setState] = useState<UseMessagesState>({
    messages: [],
    selectedMessage: null,
    loading: false,
    error: null,
  });

  const fetchMessages = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await messageService.getMessages();

      setState((previous) => ({
        ...previous,
        messages: data,
        loading: false,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch messages.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  }, []);

  const getMessageById = useCallback(
    async (id: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const message =
          await messageService.getMessageById(id);

        setState((previous) => ({
          ...previous,
          selectedMessage: message,
          loading: false,
          error: null,
        }));

        return message;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch message.";

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

  const getMessagesByConversation = useCallback(
    async (conversationId: string) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await messageService.getMessagesByConversation(
            conversationId,
          );

        setState((previous) => ({
          ...previous,
          messages: data,
          loading: false,
          error: null,
        }));

        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch conversation messages.";

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

  const sendMessage = async (
    data: Parameters<
      typeof messageService.sendMessage
    >[0],
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const message =
        await messageService.sendMessage(data);

      setState((previous) => ({
        ...previous,
        messages: [
          ...previous.messages,
          message,
        ],
        selectedMessage: message,
        loading: false,
        error: null,
      }));

      return message;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send message.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const updateMessage = async (
    id: string,
    data: Parameters<
      typeof messageService.updateMessage
    >[1],
  ) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const updatedMessage =
        await messageService.updateMessage(
          id,
          data,
        );

      setState((previous) => ({
        ...previous,
        messages: previous.messages.map((item) =>
          item.id === id
            ? updatedMessage
            : item,
        ),
        selectedMessage:
          previous.selectedMessage?.id === id
            ? updatedMessage
            : previous.selectedMessage,
        loading: false,
        error: null,
      }));

      return updatedMessage;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update message.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const deleteMessage = async (id: string) => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      await messageService.deleteMessage(id);

      setState((previous) => ({
        ...previous,
        messages: previous.messages.filter(
          (item) => item.id !== id,
        ),
        selectedMessage:
          previous.selectedMessage?.id === id
            ? null
            : previous.selectedMessage,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete message.";

      setState((previous) => ({
        ...previous,
        loading: false,
        error: message,
      }));

      throw error;
    }
  };

  const clearSelectedMessage = useCallback(() => {
    setState((previous) => ({
      ...previous,
      selectedMessage: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
    }));
  }, []);

  return {
    messages: state.messages,
    selectedMessage: state.selectedMessage,
    loading: state.loading,
    error: state.error,
    fetchMessages,
    getMessageById,
    getMessagesByConversation,
    sendMessage,
    updateMessage,
    deleteMessage,
    clearSelectedMessage,
    clearError,
  };
}