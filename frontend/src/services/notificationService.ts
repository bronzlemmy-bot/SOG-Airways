import { apiService } from "./api";

import type { Notification } from "@/types";

export interface NotificationFilters {
  type?: Notification["type"];
  read?: boolean;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateNotificationData {
  userId: string;
  type: Notification["type"];
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export type UpdateNotificationData = Partial<
  Pick<
    CreateNotificationData,
    | "title"
    | "message"
    | "actionLabel"
    | "actionHref"
  >
>;

export const notificationService = {
  async getNotifications(): Promise<
    Notification[]
  > {
    return apiService.get<Notification[]>(
      "/notifications",
    );
  },

  async getNotificationById(
    id: string,
  ): Promise<Notification> {
    return apiService.get<Notification>(
      `/notifications/${id}`,
    );
  },

  async getNotificationsByUser(
    userId: string,
  ): Promise<Notification[]> {
    return apiService.get<Notification[]>(
      `/users/${userId}/notifications`,
    );
  },

  async getNotificationsByFilters(
    filters: NotificationFilters,
  ): Promise<Notification[]> {
    const params = new URLSearchParams();

    if (filters.type) {
      params.set("type", filters.type);
    }

    if (filters.read !== undefined) {
      params.set("read", String(filters.read));
    }

    if (filters.userId) {
      params.set("userId", filters.userId);
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

    return apiService.get<Notification[]>(
      `/notifications${query ? `?${query}` : ""}`,
    );
  },

  async createNotification(
    data: CreateNotificationData,
  ): Promise<Notification> {
    return apiService.post<Notification>(
      "/notifications",
      data,
    );
  },

  async markAsRead(
    id: string,
  ): Promise<Notification> {
    return apiService.patch<Notification>(
      `/notifications/${id}/read`,
    );
  },

  async markAllAsRead(
    userId: string,
  ): Promise<void> {
    await apiService.patch(
      `/users/${userId}/notifications/read-all`,
    );
  },

  async deleteNotification(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/notifications/${id}`,
    );
  },

  async deleteAllNotifications(
    userId: string,
  ): Promise<void> {
    await apiService.delete(
      `/users/${userId}/notifications`,
    );
  },
};