import { apiService } from "./api";

import type { Message } from "@/types";

export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  recipientId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMessageData {
  conversationId: string;
  recipient?: string | null;
  subject?: string | null;
  body: string;
}

export type UpdateMessageData = Partial<
  Pick<CreateMessageData, "body">
>;

export const messageService = {
  async getMessages(): Promise<Message[]> {
    return apiService.get<Message[]>("/messages");
  },

  async getMessageById(
    id: string,
  ): Promise<Message> {
    return apiService.get<Message>(
      `/messages/${id}`,
    );
  },

  async getMessagesByConversation(
    conversationId: string,
  ): Promise<Message[]> {
    return apiService.get<Message[]>(
      `/messages/conversation/${conversationId}`,
    );
  },

  async getMessagesByFilters(
    filters: MessageFilters,
  ): Promise<Message[]> {
    const params = new URLSearchParams();

    if (filters.conversationId) {
      params.set(
        "conversationId",
        filters.conversationId,
      );
    }

    if (filters.senderId) {
      params.set(
        "sender",
        filters.senderId,
      );
    }

    if (filters.recipientId) {
      params.set(
        "recipient",
        filters.recipientId,
      );
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<Message[]>(
      `/messages${query ? `?${query}` : ""}`,
    );
  },

  async sendMessage(
    data: CreateMessageData,
  ): Promise<Message> {
    return apiService.post<Message>(
      "/messages",
      data,
    );
  },

  async updateMessage(
    id: string,
    data: UpdateMessageData,
  ): Promise<Message> {
    return apiService.patch<Message>(
      `/messages/${id}`,
      data,
    );
  },

  async markMessageAsRead(
    id: string,
  ): Promise<Message> {
    return apiService.patch<Message>(
      `/messages/${id}/read`,
    );
  },

  async deleteMessage(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/messages/${id}`,
    );
  },
};