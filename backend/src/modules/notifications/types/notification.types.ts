
import type {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_TYPES,
} from "../models/notification.model.js";

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[number];

export type NotificationPriority =
  (typeof NOTIFICATION_PRIORITIES)[number];

export type NotificationStatus =
  (typeof NOTIFICATION_STATUSES)[number];

export interface CreateNotificationInput {
  recipient: string;
  type?: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  actionUrl?: string | null;
  relatedEntity?: {
    entityType?: string | null;
    entityId?: string | null;
  };
  expiresAt?: Date | null;
  metadata?: Record<string, unknown>;
}

export interface UpdateNotificationInput {
  type?: NotificationType;
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  actionUrl?: string | null;
  relatedEntity?: {
    entityType?: string | null;
    entityId?: string | null;
  };
  expiresAt?: Date | null;
  metadata?: Record<string, unknown>;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  recipient?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  sortOrder?: "asc" | "desc";
}

export interface NotificationIdParams {
  notificationId: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationListResult<T> {
  items: T[];
  pagination: NotificationPagination;
}

export interface NotificationCountQuery {
  recipient?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  fromDate?: Date;
  toDate?: Date;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
}

export interface MarkNotificationsReadInput {
  notificationIds?: string[];
}
