
import { ApiError } from "../../../utils/api-error.js";

import { notificationRepository } from "../repositories/notification.repository.js";

import type {
  CreateNotificationInput,
  MarkNotificationsReadInput,
  NotificationCountQuery,
  NotificationListQuery,
  UpdateNotificationInput,
} from "../types/notification.types.js";

class NotificationService {
  async create(input: CreateNotificationInput) {
    if (!input.recipient) {
      throw new ApiError("A notification recipient is required.", 400, {
        code: "NOTIFICATION_RECIPIENT_REQUIRED",
      });
    }

    return notificationRepository.create(input);
  }

  async findById(notificationId: string) {
    const notification =
      await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new ApiError("Notification not found.", 404, {
        code: "NOTIFICATION_NOT_FOUND",
      });
    }

    return notification;
  }

  async list(query: NotificationListQuery = {}) {
    return notificationRepository.findMany(query);
  }

  async listForRecipient(
    recipientId: string,
    query: Omit<NotificationListQuery, "recipient"> = {},
  ) {
    if (!recipientId) {
      throw new ApiError("A recipient ID is required.", 400, {
        code: "NOTIFICATION_RECIPIENT_REQUIRED",
      });
    }

    return notificationRepository.findForRecipient(
      recipientId,
      query,
    );
  }

  async update(
    notificationId: string,
    input: UpdateNotificationInput,
  ) {
    const notification = await notificationRepository.update(
      notificationId,
      input,
    );

    if (!notification) {
      throw new ApiError("Notification not found.", 404, {
        code: "NOTIFICATION_NOT_FOUND",
      });
    }

    return notification;
  }

  async markAsRead(notificationId: string) {
    const notification =
      await notificationRepository.markAsRead(notificationId);

    if (!notification) {
      const existing =
        await notificationRepository.findById(notificationId);

      if (!existing) {
        throw new ApiError("Notification not found.", 404, {
          code: "NOTIFICATION_NOT_FOUND",
        });
      }

      return existing;
    }

    return notification;
  }

  async markManyAsRead(
    recipientId: string,
    input: MarkNotificationsReadInput = {},
  ) {
    if (!recipientId) {
      throw new ApiError("A recipient ID is required.", 400, {
        code: "NOTIFICATION_RECIPIENT_REQUIRED",
      });
    }

    if (
      input.notificationIds?.some(
        (id) => !/^[a-f\d]{24}$/i.test(id),
      )
    ) {
      throw new ApiError(
        "One or more notification IDs are invalid.",
        400,
        { code: "INVALID_NOTIFICATION_ID" },
      );
    }

    return notificationRepository.markManyAsRead(
      recipientId,
      input,
    );
  }

  async archive(
    notificationId: string,
    recipientId: string,
  ) {
    if (!recipientId) {
      throw new ApiError("A recipient ID is required.", 400, {
        code: "NOTIFICATION_RECIPIENT_REQUIRED",
      });
    }

    const notification = await notificationRepository.archive(
      notificationId,
      recipientId,
    );

    if (!notification) {
      throw new ApiError(
        "Notification not found or already archived.",
        404,
        { code: "NOTIFICATION_NOT_FOUND_OR_ARCHIVED" },
      );
    }

    return notification;
  }

  async delete(notificationId: string) {
    const notification =
      await notificationRepository.delete(notificationId);

    if (!notification) {
      throw new ApiError("Notification not found.", 404, {
        code: "NOTIFICATION_NOT_FOUND",
      });
    }

    return notification;
  }

  async deleteForRecipient(
    notificationId: string,
    recipientId: string,
  ) {
    if (!recipientId) {
      throw new ApiError("A recipient ID is required.", 400, {
        code: "NOTIFICATION_RECIPIENT_REQUIRED",
      });
    }

    const notification =
      await notificationRepository.deleteForRecipient(
        notificationId,
        recipientId,
      );

    if (!notification) {
      throw new ApiError("Notification not found.", 404, {
        code: "NOTIFICATION_NOT_FOUND",
      });
    }

    return notification;
  }

  async deleteExpired(now: Date = new Date()) {
    return notificationRepository.deleteExpired(now);
  }

  async count(query: NotificationCountQuery = {}) {
    return notificationRepository.count(query);
  }

  async countUnread(recipientId: string) {
    if (!recipientId) {
      throw new ApiError("A recipient ID is required.", 400, {
        code: "NOTIFICATION_RECIPIENT_REQUIRED",
      });
    }

    return notificationRepository.countUnread(recipientId);
  }

  async getStats(recipientId?: string) {
    return notificationRepository.getStats(recipientId);
  }
}

export const notificationService = new NotificationService();
