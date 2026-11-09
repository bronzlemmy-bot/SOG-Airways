
import mongoose, { type SortOrder } from "mongoose";
import { Message } from "../models/message.model.js";
import type {
  CreateMessageInput,
  MessageCountQuery,
  MessageListQuery,
  MessageStats,
  UpdateMessageInput,
} from "../types/message.types.js";

type MessageFilter = Record<string, unknown>;

const buildMessageFilter = (
  query: MessageListQuery | MessageCountQuery,
): MessageFilter => {
  const filter: MessageFilter = {};

  if (query.conversationId) {
    filter.conversationId = new mongoose.Types.ObjectId(
      query.conversationId,
    );
  }

  if (query.sender) {
    filter.sender = new mongoose.Types.ObjectId(query.sender);
  }

  if (query.recipient) {
    filter.recipient = new mongoose.Types.ObjectId(query.recipient);
  }

  if ("booking" in query && query.booking) {
    filter.booking = new mongoose.Types.ObjectId(query.booking);
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if ("search" in query && query.search) {
    const escapedSearch = query.search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    filter.$or = [
      { subject: { $regex: escapedSearch, $options: "i" } },
      { body: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if ("fromDate" in query && query.fromDate) {
    filter.createdAt = {
      ...(filter.createdAt as Record<string, Date> | undefined),
      $gte: query.fromDate,
    };
  }

  if ("toDate" in query && query.toDate) {
    filter.createdAt = {
      ...(filter.createdAt as Record<string, Date> | undefined),
      $lte: query.toDate,
    };
  }

  return filter;
};

class MessageRepository {
  async create(input: CreateMessageInput) {
    return Message.create({
      ...input,
      conversationId: new mongoose.Types.ObjectId(input.conversationId),
      sender: new mongoose.Types.ObjectId(input.sender),
      recipient: input.recipient
        ? new mongoose.Types.ObjectId(input.recipient)
        : null,
      booking: input.booking
        ? new mongoose.Types.ObjectId(input.booking)
        : null,
    });
  }

  async findById(messageId: string) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findById(messageId)
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("booking", "bookingReference")
      .populate("conversationId", "subject status participants")
      .exec();
  }

  async findByIdForUpdate(messageId: string) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findById(messageId).exec();
  }

  async findMany(query: MessageListQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;
    const filter = buildMessageFilter(query);

    const [items, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender", "firstName lastName email")
        .populate("recipient", "firstName lastName email")
        .populate("booking", "bookingReference")
        .exec(),
      Message.countDocuments(filter).exec(),
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

  async findByConversation(
    conversationId: string,
    query: Pick<MessageListQuery, "page" | "limit" | "sortOrder"> = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;

    if (!mongoose.isValidObjectId(conversationId)) {
      return {
        items: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }

    const filter = {
      conversationId: new mongoose.Types.ObjectId(conversationId),
    };

    const [items, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender", "firstName lastName email")
        .populate("recipient", "firstName lastName email")
        .exec(),
      Message.countDocuments(filter).exec(),
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

  async update(messageId: string, input: UpdateMessageInput) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findByIdAndUpdate(
      messageId,
      { $set: input },
      { new: true, runValidators: true },
    )
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("booking", "bookingReference")
      .exec();
  }

  async delete(messageId: string) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findByIdAndDelete(messageId).exec();
  }

  async count(query: MessageCountQuery = {}) {
    return Message.countDocuments(buildMessageFilter(query)).exec();
  }

  async getStats(
    query: Pick<
      MessageCountQuery,
      "conversationId" | "sender" | "recipient"
    > = {},
  ): Promise<MessageStats> {
    const filter = buildMessageFilter(query);

    const [total, sent, delivered, read, failed, unread] =
      await Promise.all([
        Message.countDocuments(filter).exec(),
        Message.countDocuments({ ...filter, status: "sent" }).exec(),
        Message.countDocuments({ ...filter, status: "delivered" }).exec(),
        Message.countDocuments({ ...filter, status: "read" }).exec(),
        Message.countDocuments({ ...filter, status: "failed" }).exec(),
        Message.countDocuments({
          ...filter,
          status: { $in: ["sent", "delivered"] },
        }).exec(),
      ]);

    return { total, sent, delivered, read, failed, unread };
  }

  async markAsRead(messageId: string) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          status: "read",
          readAt: new Date(),
          deliveredAt: new Date(),
        },
        $unset: { failedReason: 1 },
      },
      { new: true, runValidators: true },
    ).exec();
  }

  async markAsDelivered(messageId: string) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          status: "delivered",
          deliveredAt: new Date(),
        },
        $unset: {
          readAt: 1,
          failedReason: 1,
        },
      },
      { new: true, runValidators: true },
    ).exec();
  }

  async markAsFailed(messageId: string, reason: string) {
    if (!mongoose.isValidObjectId(messageId)) {
      return null;
    }

    return Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          status: "failed",
          failedReason: reason,
        },
        $unset: {
          readAt: 1,
          deliveredAt: 1,
        },
      },
      { new: true, runValidators: true },
    ).exec();
  }

  async deleteByConversation(conversationId: string) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return { deletedCount: 0 };
    }

    return Message.deleteMany({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    }).exec();
  }
}

export const messageRepository = new MessageRepository();
