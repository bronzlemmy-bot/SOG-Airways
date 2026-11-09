
import mongoose, { type SortOrder } from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import type {
  ConversationCountQuery,
  ConversationListQuery,
  ConversationStats,
  CreateConversationInput,
  UpdateConversationInput,
} from "../types/conversation.types.js";

type ConversationFilter = Record<string, unknown>;

const buildConversationFilter = (
  query: ConversationListQuery | ConversationCountQuery,
): ConversationFilter => {
  const filter: ConversationFilter = {};

  if ("participant" in query && query.participant) {
    filter.participants = new mongoose.Types.ObjectId(query.participant);
  }

  if ("createdBy" in query && query.createdBy) {
    filter.createdBy = new mongoose.Types.ObjectId(query.createdBy);
  }

  if ("assignedTo" in query && query.assignedTo) {
    filter.assignedTo = new mongoose.Types.ObjectId(query.assignedTo);
  }

  if ("booking" in query && query.booking) {
    filter.booking = new mongoose.Types.ObjectId(query.booking);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.channel) {
    filter.channel = query.channel;
  }

  if ("tag" in query && query.tag) {
    filter.tags = query.tag;
  }

  if ("search" in query && query.search) {
    const escapedSearch = query.search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    filter.$or = [
      { subject: { $regex: escapedSearch, $options: "i" } },
      { tags: { $regex: escapedSearch, $options: "i" } },
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

class ConversationRepository {
  async create(input: CreateConversationInput) {
    const conversation = await Conversation.create({
      ...input,
      participants: input.participants.map(
        (participantId) => new mongoose.Types.ObjectId(participantId),
      ),
      createdBy: new mongoose.Types.ObjectId(input.createdBy),
      assignedTo: input.assignedTo
        ? new mongoose.Types.ObjectId(input.assignedTo)
        : null,
      booking: input.booking
        ? new mongoose.Types.ObjectId(input.booking)
        : null,
    });

    return conversation;
  }

  async findById(conversationId: string) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    return Conversation.findById(conversationId)
      .populate("participants", "firstName lastName email role")
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("booking", "bookingReference")
      .populate("lastMessage")
      .exec();
  }

  async findByIdForUpdate(conversationId: string) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    return Conversation.findById(conversationId).exec();
  }

  async findMany(query: ConversationListQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;
    const filter = buildConversationFilter(query);

    const [items, total] = await Promise.all([
      Conversation.find(filter)
        .sort({ updatedAt: sortOrder, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("participants", "firstName lastName email role")
        .populate("createdBy", "firstName lastName email")
        .populate("assignedTo", "firstName lastName email")
        .populate("booking", "bookingReference")
        .populate("lastMessage")
        .exec(),
      Conversation.countDocuments(filter).exec(),
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

  async update(
    conversationId: string,
    input: UpdateConversationInput,
  ) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    const update: Record<string, unknown> = { ...input };

    if (input.participants) {
      update.participants = input.participants.map(
        (participantId) => new mongoose.Types.ObjectId(participantId),
      );
    }

    if (input.assignedTo !== undefined) {
      update.assignedTo = input.assignedTo
        ? new mongoose.Types.ObjectId(input.assignedTo)
        : null;
    }

    if (input.booking !== undefined) {
      update.booking = input.booking
        ? new mongoose.Types.ObjectId(input.booking)
        : null;
    }

    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("participants", "firstName lastName email role")
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("booking", "bookingReference")
      .populate("lastMessage")
      .exec();
  }

  async updateStatus(
    conversationId: string,
    status: "open" | "pending" | "resolved" | "closed",
  ) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async delete(conversationId: string) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    return Conversation.findByIdAndDelete(conversationId).exec();
  }

  async count(query: ConversationCountQuery = {}) {
    return Conversation.countDocuments(
      buildConversationFilter(query),
    ).exec();
  }

  async getStats(
    query: Pick<
      ConversationCountQuery,
      "participant" | "createdBy" | "assignedTo"
    > = {},
  ): Promise<ConversationStats> {
    const filter = buildConversationFilter(query);

    const [
      total,
      open,
      pending,
      resolved,
      closed,
      urgent,
      unassigned,
    ] = await Promise.all([
      Conversation.countDocuments(filter).exec(),
      Conversation.countDocuments({ ...filter, status: "open" }).exec(),
      Conversation.countDocuments({ ...filter, status: "pending" }).exec(),
      Conversation.countDocuments({ ...filter, status: "resolved" }).exec(),
      Conversation.countDocuments({ ...filter, status: "closed" }).exec(),
      Conversation.countDocuments({ ...filter, priority: "urgent" }).exec(),
      Conversation.countDocuments({
        ...filter,
        assignedTo: null,
        status: { $in: ["open", "pending"] },
      }).exec(),
    ]);

    return {
      total,
      open,
      pending,
      resolved,
      closed,
      urgent,
      unassigned,
    };
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string,
    messageDate: Date = new Date(),
  ) {
    if (
      !mongoose.isValidObjectId(conversationId) ||
      !mongoose.isValidObjectId(messageId)
    ) {
      return null;
    }

    return Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          lastMessage: new mongoose.Types.ObjectId(messageId),
          lastMessageAt: messageDate,
        },
      },
      { new: true, runValidators: true },
    ).exec();
  }

  async incrementUnreadCount(conversationId: string, amount = 1) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    return Conversation.findByIdAndUpdate(
      conversationId,
      { $inc: { unreadCount: Math.max(0, amount) } },
      { new: true, runValidators: true },
    ).exec();
  }

  async resetUnreadCount(conversationId: string) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { unreadCount: 0 } },
      { new: true, runValidators: true },
    ).exec();
  }

  async deleteWithMessages(conversationId: string) {
    if (!mongoose.isValidObjectId(conversationId)) {
      return null;
    }

    const conversation = await Conversation.findByIdAndDelete(
      conversationId,
    ).exec();

    if (!conversation) {
      return null;
    }

    await Message.deleteMany({
      conversationId: conversation._id,
    }).exec();

    return conversation;
  }
}

export const conversationRepository = new ConversationRepository();
