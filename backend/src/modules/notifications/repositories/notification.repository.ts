
import mongoose, { type SortOrder } from "mongoose";

import { Notification } from "../models/notification.model.js";

import type {
  CreateNotificationInput,
  MarkNotificationsReadInput,
  NotificationCountQuery,
  NotificationListQuery,
  NotificationStats,
  UpdateNotificationInput,
} from "../types/notification.types.js";

function buildNotificationFilter(
  query: NotificationListQuery | NotificationCountQuery,
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if ("recipient" in query && query.recipient) {
    filter.recipient = query.recipient;
  }

  if ("type" in query && query.type) {
    filter.type = query.type;
  }

  if ("priority" in query && query.priority) {
    filter.priority = query.priority;
  }

  if ("status" in query && query.status) {
    filter.status = query.status;
  }

  if ("search" in query && query.search) {
    const escapedSearch = query.search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { message: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const dateFilter: Record<string, Date> = {};

  if ("fromDate" in query && query.fromDate) {
    dateFilter.$gte = query.fromDate;
  }

  if ("toDate" in query && query.toDate) {
    dateFilter.$lte = query.toDate;
  }

  if (Object.keys(dateFilter).length > 0) {
    filter.createdAt = dateFilter;
  }

  return filter;
}

class NotificationRepository {
  async create(input: CreateNotificationInput) {
    return Notification.create({
      recipient: new mongoose.Types.ObjectId(input.recipient),
      type: input.type ?? "system",
      title: input.title,
      message: input.message,
      priority: input.priority ?? "normal",
      actionUrl: input.actionUrl ?? null,
      relatedEntity: input.relatedEntity
        ? {
            entityType: input.relatedEntity.entityType ?? null,
            entityId: input.relatedEntity.entityId
              ? new mongoose.Types.ObjectId(
                  input.relatedEntity.entityId,
                )
              : null,
          }
        : undefined,
      expiresAt: input.expiresAt ?? null,
      metadata: input.metadata ?? {},
    });
  }

  async findById(notificationId: string) {
    if (!mongoose.isValidObjectId(notificationId)) {
      return null;
    }

    return Notification.findById(notificationId)
      .populate("recipient", "firstName lastName email")
      .exec();
  }

  async findMany(query: NotificationListQuery = {}) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));

    const sortOrder: SortOrder =
      query.sortOrder === "asc" ? 1 : -1;

    const filter = buildNotificationFilter(query);

    const [items, total] = await Promise.all([
      Notification.find(filter as any)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("recipient", "firstName lastName email")
        .exec(),
      Notification.countDocuments(filter as any).exec(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findForRecipient(
    recipientId: string,
    query: Omit<NotificationListQuery, "recipient"> = {},
  ) {
    return this.findMany({
      ...query,
      recipient: recipientId,
    });
  }

  async update(
    notificationId: string,
    input: UpdateNotificationInput,
  ) {
    if (!mongoose.isValidObjectId(notificationId)) {
      return null;
    }

    const update: Record<string, unknown> = { ...input };

    if (input.relatedEntity) {
      update.relatedEntity = {
        entityType: input.relatedEntity.entityType ?? null,
        entityId: input.relatedEntity.entityId
          ? new mongoose.Types.ObjectId(
              input.relatedEntity.entityId,
            )
          : null,
      };
    }

    return Notification.findByIdAndUpdate(
      notificationId,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("recipient", "firstName lastName email")
      .exec();
  }

  async markAsRead(notificationId: string) {
    if (!mongoose.isValidObjectId(notificationId)) {
      return null;
    }

    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        status: "unread",
      },
      {
        $set: {
          status: "read",
          readAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async markManyAsRead(
    recipientId: string,
    input: MarkNotificationsReadInput = {},
  ) {
    const filter: Record<string, unknown> = {
      recipient: recipientId,
      status: "unread",
    };

    if (input.notificationIds?.length) {
      filter._id = {
        $in: input.notificationIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        ),
      };
    }

    const result = await Notification.updateMany(filter as any, {
      $set: {
        status: "read",
        readAt: new Date(),
      },
    }).exec();

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async archive(notificationId: string, recipientId: string) {
    if (!mongoose.isValidObjectId(notificationId)) {
      return null;
    }

    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: recipientId,
        status: { $ne: "archived" },
      },
      {
        $set: {
          status: "archived",
          archivedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async delete(notificationId: string) {
    if (!mongoose.isValidObjectId(notificationId)) {
      return null;
    }

    return Notification.findByIdAndDelete(notificationId).exec();
  }

  async deleteForRecipient(
    notificationId: string,
    recipientId: string,
  ) {
    if (!mongoose.isValidObjectId(notificationId)) {
      return null;
    }

    return Notification.findOneAndDelete({
      _id: notificationId,
      recipient: recipientId,
    }).exec();
  }

  async deleteExpired(now: Date = new Date()) {
    const result = await Notification.deleteMany({
      expiresAt: { $ne: null, $lte: now },
    }).exec();

    return result.deletedCount;
  }

  async count(query: NotificationCountQuery = {}) {
    const filter = buildNotificationFilter(query);

    return Notification.countDocuments(filter as any).exec();
  }

  async countUnread(recipientId: string) {
    return Notification.countDocuments({
      recipient: recipientId,
      status: "unread",
    }).exec();
  }

  async getStats(
    recipientId?: string,
  ): Promise<NotificationStats> {
    const baseFilter: Record<string, unknown> = {};

    if (recipientId) {
      baseFilter.recipient = recipientId;
    }

    const [total, unread, read, archived] = await Promise.all([
      Notification.countDocuments(baseFilter as any).exec(),
      Notification.countDocuments({
        ...baseFilter,
        status: "unread",
      } as any).exec(),
      Notification.countDocuments({
        ...baseFilter,
        status: "read",
      } as any).exec(),
      Notification.countDocuments({
        ...baseFilter,
        status: "archived",
      } as any).exec(),
    ]);

    return {
      total,
      unread,
      read,
      archived,
    };
  }
}

export const notificationRepository =
  new NotificationRepository();
