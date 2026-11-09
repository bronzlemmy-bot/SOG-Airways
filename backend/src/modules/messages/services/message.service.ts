
import mongoose, { type Types } from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { messageRepository } from "../repositories/message.repository.js";
import { Message } from "../models/message.model.js";
import type {
  CreateMessageInput,
  MessageCountQuery,
  MessageListQuery,
  UpdateMessageInput,
} from "../types/message.types.js";
import { ApiError } from "../../../utils/api-error.js";

type ParticipantId = Types.ObjectId | string;

const includesParticipant = (
  participants: ParticipantId[],
  userId: string,
): boolean =>
  participants.some(
    (participant: ParticipantId) => participant.toString() === userId,
  );

class MessageService {
  async create(
    input: Omit<CreateMessageInput, "sender">,
    senderId: string,
  ) {
    if (!mongoose.isValidObjectId(senderId)) {
      throw new ApiError("A valid sender ID is required.", 400, {
        code: "INVALID_SENDER_ID",
      });
    }

    const conversation = await Conversation.findById(input.conversationId)
      .select("participants status")
      .exec();

    if (!conversation) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    const participants =
      conversation.participants as unknown as ParticipantId[];

    if (!includesParticipant(participants, senderId)) {
      throw new ApiError(
        "You must be a conversation participant to send a message.",
        403,
        { code: "NOT_CONVERSATION_PARTICIPANT" },
      );
    }

    if (
      conversation.status === "closed" ||
      conversation.status === "resolved"
    ) {
      throw new ApiError(
        "Messages cannot be added to a closed or resolved conversation.",
        409,
        { code: "CONVERSATION_NOT_ACTIVE" },
      );
    }

    if (input.recipient && !mongoose.isValidObjectId(input.recipient)) {
      throw new ApiError("A valid recipient ID is required.", 400, {
        code: "INVALID_RECIPIENT_ID",
      });
    }

    if (
      input.recipient &&
      !includesParticipant(participants, input.recipient)
    ) {
      throw new ApiError(
        "The recipient must be a participant in this conversation.",
        400,
        { code: "RECIPIENT_NOT_IN_CONVERSATION" },
      );
    }

    if (input.booking && !mongoose.isValidObjectId(input.booking)) {
      throw new ApiError("A valid booking ID is required.", 400, {
        code: "INVALID_BOOKING_ID",
      });
    }

    const message = await messageRepository.create({
      ...input,
      sender: senderId,
      status: "sent",
    });

    await Conversation.findByIdAndUpdate(
      conversation._id,
      {
        $set: {
          lastMessage: message._id,
          lastMessageAt: message.createdAt,
        },
        $inc: { unreadCount: 1 },
      },
      { runValidators: true },
    ).exec();

    return message;
  }

  async getById(messageId: string, requestingUserId?: string) {
    const message = await messageRepository.findById(messageId);

    if (!message) {
      throw new ApiError("Message not found.", 404, {
        code: "MESSAGE_NOT_FOUND",
      });
    }

    if (requestingUserId) {
      if (!mongoose.isValidObjectId(requestingUserId)) {
        throw new ApiError("A valid user ID is required.", 400, {
          code: "INVALID_USER_ID",
        });
      }

      const sender = message.sender as unknown as {
        _id?: Types.ObjectId | string;
      } | null;

      const recipient = message.recipient as unknown as {
        _id?: Types.ObjectId | string;
      } | null;

      const conversation = message.conversationId as unknown as {
        participants?: ParticipantId[];
      } | null;

      const senderId = sender?._id?.toString();
      const recipientId = recipient?._id?.toString();

      const isParticipant = includesParticipant(
        conversation?.participants ?? [],
        requestingUserId,
      );

      if (
        senderId !== requestingUserId &&
        recipientId !== requestingUserId &&
        !isParticipant
      ) {
        throw new ApiError("You cannot access this message.", 403, {
          code: "MESSAGE_ACCESS_DENIED",
        });
      }
    }

    return message;
  }

  async list(query: MessageListQuery) {
    return messageRepository.findMany(query);
  }

  async listForUser(
    userId: string,
    query: MessageListQuery = {},
  ) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Conversation.find({
      participants: userObjectId,
    })
      .select("_id")
      .lean()
      .exec();

    const conversationIds = conversations.map(
      (conversation) => conversation._id,
    );

    if (conversationIds.length === 0) {
      return {
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const filter: Record<string, unknown> = {
      conversationId: { $in: conversationIds },
    };

    if (query.conversationId) {
      if (!mongoose.isValidObjectId(query.conversationId)) {
        throw new ApiError("A valid conversation ID is required.", 400, {
          code: "INVALID_CONVERSATION_ID",
        });
      }

      const requestedConversationId =
        new mongoose.Types.ObjectId(query.conversationId);

      const isAuthorized = conversationIds.some(
        (id) => id.toString() === requestedConversationId.toString(),
      );

      if (!isAuthorized) {
        throw new ApiError("You cannot access this conversation.", 403, {
          code: "CONVERSATION_ACCESS_DENIED",
        });
      }

      filter.conversationId = requestedConversationId;
    }

    if (query.sender) {
      filter.sender = new mongoose.Types.ObjectId(query.sender);
    }

    if (query.recipient) {
      filter.recipient = new mongoose.Types.ObjectId(query.recipient);
    }

    if (query.booking) {
      filter.booking = new mongoose.Types.ObjectId(query.booking);
    }

    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    if (query.search) {
      const escapedSearch = query.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      filter.$or = [
        { subject: { $regex: escapedSearch, $options: "i" } },
        { body: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (query.fromDate || query.toDate) {
      const createdAt: Record<string, Date> = {};

      if (query.fromDate) createdAt.$gte = query.fromDate;
      if (query.toDate) createdAt.$lte = query.toDate;

      filter.createdAt = createdAt;
    }

    const [items, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender", "firstName lastName email")
        .populate("recipient", "firstName lastName email")
        .populate("booking", "bookingReference")
        .populate("conversationId", "subject status")
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

  async listConversationMessages(
    conversationId: string,
    requestingUserId: string,
    query: Pick<MessageListQuery, "page" | "limit" | "sortOrder"> = {},
  ) {
    if (!mongoose.isValidObjectId(requestingUserId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    if (!mongoose.isValidObjectId(conversationId)) {
      throw new ApiError("A valid conversation ID is required.", 400, {
        code: "INVALID_CONVERSATION_ID",
      });
    }

    const conversation = await Conversation.findById(conversationId)
      .select("participants")
      .exec();

    if (!conversation) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    const participants =
      conversation.participants as unknown as ParticipantId[];

    if (!includesParticipant(participants, requestingUserId)) {
      throw new ApiError("You cannot access this conversation.", 403, {
        code: "CONVERSATION_ACCESS_DENIED",
      });
    }

    return messageRepository.findByConversation(conversationId, query);
  }

  async update(messageId: string, input: UpdateMessageInput) {
    const existingMessage =
      await messageRepository.findByIdForUpdate(messageId);

    if (!existingMessage) {
      throw new ApiError("Message not found.", 404, {
        code: "MESSAGE_NOT_FOUND",
      });
    }

    if (input.status === "failed" && !input.failedReason?.trim()) {
      throw new ApiError(
        "A reason is required when marking a message as failed.",
        400,
        { code: "FAILED_REASON_REQUIRED" },
      );
    }

    const updatedMessage = await messageRepository.update(messageId, input);

    if (!updatedMessage) {
      throw new ApiError("Unable to update message.", 500, {
        code: "MESSAGE_UPDATE_FAILED",
      });
    }

    return updatedMessage;
  }

  async markAsRead(messageId: string, requestingUserId: string) {
    if (!mongoose.isValidObjectId(requestingUserId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    const message =
      await messageRepository.findByIdForUpdate(messageId);

    if (!message) {
      throw new ApiError("Message not found.", 404, {
        code: "MESSAGE_NOT_FOUND",
      });
    }

    if (
      message.recipient &&
      message.recipient.toString() !== requestingUserId
    ) {
      throw new ApiError(
        "Only the recipient can mark this message as read.",
        403,
        { code: "MESSAGE_READ_FORBIDDEN" },
      );
    }

    if (!message.recipient) {
      const conversation = await Conversation.findById(
        message.conversationId,
      )
        .select("participants")
        .exec();

      const participants =
        (conversation?.participants ?? []) as unknown as ParticipantId[];

      if (!includesParticipant(participants, requestingUserId)) {
        throw new ApiError("You cannot access this message.", 403, {
          code: "MESSAGE_ACCESS_DENIED",
        });
      }
    }

    const updatedMessage = await messageRepository.markAsRead(messageId);

    if (!updatedMessage) {
      throw new ApiError("Unable to mark message as read.", 500, {
        code: "MESSAGE_READ_FAILED",
      });
    }

    return updatedMessage;
  }

  async markAsDelivered(messageId: string) {
    const message =
      await messageRepository.findByIdForUpdate(messageId);

    if (!message) {
      throw new ApiError("Message not found.", 404, {
        code: "MESSAGE_NOT_FOUND",
      });
    }

    if (message.status === "failed") {
      throw new ApiError(
        "A failed message cannot be marked as delivered.",
        409,
        { code: "MESSAGE_DELIVERY_CONFLICT" },
      );
    }

    const updatedMessage =
      await messageRepository.markAsDelivered(messageId);

    if (!updatedMessage) {
      throw new ApiError("Unable to mark message as delivered.", 500, {
        code: "MESSAGE_DELIVERY_FAILED",
      });
    }

    return updatedMessage;
  }

  async markAsFailed(messageId: string, reason: string) {
    if (!reason.trim()) {
      throw new ApiError("A failure reason is required.", 400, {
        code: "FAILED_REASON_REQUIRED",
      });
    }

    const message =
      await messageRepository.findByIdForUpdate(messageId);

    if (!message) {
      throw new ApiError("Message not found.", 404, {
        code: "MESSAGE_NOT_FOUND",
      });
    }

    if (message.status === "read") {
      throw new ApiError(
        "A read message cannot be marked as failed.",
        409,
        { code: "MESSAGE_FAILURE_CONFLICT" },
      );
    }

    const updatedMessage = await messageRepository.markAsFailed(
      messageId,
      reason,
    );

    if (!updatedMessage) {
      throw new ApiError("Unable to mark message as failed.", 500, {
        code: "MESSAGE_FAILURE_UPDATE_FAILED",
      });
    }

    return updatedMessage;
  }

  async delete(messageId: string, requestingUserId?: string) {
    const message =
      await messageRepository.findByIdForUpdate(messageId);

    if (!message) {
      throw new ApiError("Message not found.", 404, {
        code: "MESSAGE_NOT_FOUND",
      });
    }

    if (
      requestingUserId &&
      message.sender.toString() !== requestingUserId
    ) {
      throw new ApiError(
        "Only the sender can delete this message.",
        403,
        { code: "MESSAGE_DELETE_FORBIDDEN" },
      );
    }

    const deletedMessage = await messageRepository.delete(messageId);

    if (!deletedMessage) {
      throw new ApiError("Unable to delete message.", 500, {
        code: "MESSAGE_DELETE_FAILED",
      });
    }

    return deletedMessage;
  }

  async count(query: MessageCountQuery = {}) {
    return messageRepository.count(query);
  }

  async getStats(
    query: Pick<
      MessageCountQuery,
      "conversationId" | "sender" | "recipient"
    > = {},
  ) {
    return messageRepository.getStats(query);
  }
}

export const messageService = new MessageService();
