
import mongoose, { type Types } from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { conversationRepository } from "../repositories/conversation.repository.js";
import { messageRepository } from "../repositories/message.repository.js";
import { ApiError } from "../../../utils/api-error.js";
import type {
  ConversationCountQuery,
  ConversationListQuery,
  CreateConversationInput,
  UpdateConversationInput,
} from "../types/conversation.types.js";

type ParticipantId = Types.ObjectId | string;

const hasParticipant = (
  participants: ParticipantId[],
  userId: string,
): boolean =>
  participants.some(
    (participant: ParticipantId) => participant.toString() === userId,
  );

class ConversationService {
  async create(
    input: Omit<CreateConversationInput, "createdBy">,
    creatorId: string,
  ) {
    if (!mongoose.isValidObjectId(creatorId)) {
      throw new ApiError("A valid creator ID is required.", 400, {
        code: "INVALID_CREATOR_ID",
      });
    }

    const uniqueParticipants = [...new Set(input.participants)];

    if (!uniqueParticipants.includes(creatorId)) {
      uniqueParticipants.push(creatorId);
    }

    for (const participantId of uniqueParticipants) {
      if (!mongoose.isValidObjectId(participantId)) {
        throw new ApiError("A participant ID is invalid.", 400, {
          code: "INVALID_PARTICIPANT_ID",
        });
      }
    }

    if (uniqueParticipants.length > 50) {
      throw new ApiError(
        "A conversation cannot have more than 50 participants.",
        400,
        { code: "TOO_MANY_PARTICIPANTS" },
      );
    }

    if (
      input.assignedTo &&
      !mongoose.isValidObjectId(input.assignedTo)
    ) {
      throw new ApiError("The assigned user ID is invalid.", 400, {
        code: "INVALID_ASSIGNED_USER_ID",
      });
    }

    if (input.booking && !mongoose.isValidObjectId(input.booking)) {
      throw new ApiError("The booking ID is invalid.", 400, {
        code: "INVALID_BOOKING_ID",
      });
    }

    return conversationRepository.create({
      ...input,
      participants: uniqueParticipants,
      createdBy: creatorId,
    });
  }

  async getById(conversationId: string, requestingUserId?: string) {
    const conversation =
      await conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    if (requestingUserId) {
      const rawConversation = await Conversation.findById(conversationId)
        .select("participants")
        .lean()
        .exec();

      const participants = (rawConversation?.participants ??
        []) as unknown as ParticipantId[];

      if (!hasParticipant(participants, requestingUserId)) {
        throw new ApiError("You cannot access this conversation.", 403, {
          code: "CONVERSATION_ACCESS_DENIED",
        });
      }
    }

    return conversation;
  }

  async list(query: ConversationListQuery) {
    return conversationRepository.findMany(query);
  }

  async listForParticipant(
    userId: string,
    query: ConversationListQuery = {},
  ) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    return conversationRepository.findMany({
      ...query,
      participant: userId,
    });
  }

  async update(
    conversationId: string,
    input: UpdateConversationInput,
    requestingUserId?: string,
  ) {
    const existing = await conversationRepository.findByIdForUpdate(
      conversationId,
    );

    if (!existing) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    if (requestingUserId) {
      const participants = existing.participants as unknown as ParticipantId[];

      if (!hasParticipant(participants, requestingUserId)) {
        throw new ApiError("You cannot update this conversation.", 403, {
          code: "CONVERSATION_UPDATE_FORBIDDEN",
        });
      }
    }

    if (input.participants) {
      const uniqueParticipants = [...new Set(input.participants)];

      if (uniqueParticipants.length !== input.participants.length) {
        throw new ApiError(
          "Participants must not contain duplicate IDs.",
          400,
          { code: "DUPLICATE_PARTICIPANTS" },
        );
      }

      if (
        requestingUserId &&
        !uniqueParticipants.includes(requestingUserId)
      ) {
        throw new ApiError(
          "You cannot remove yourself from the conversation using this operation.",
          400,
          { code: "CANNOT_REMOVE_SELF" },
        );
      }

      if (
        uniqueParticipants.length < 1 ||
        uniqueParticipants.length > 50
      ) {
        throw new ApiError(
          "A conversation must have between 1 and 50 participants.",
          400,
          { code: "INVALID_PARTICIPANT_COUNT" },
        );
      }

      for (const participantId of uniqueParticipants) {
        if (!mongoose.isValidObjectId(participantId)) {
          throw new ApiError("A participant ID is invalid.", 400, {
            code: "INVALID_PARTICIPANT_ID",
          });
        }
      }

      input = { ...input, participants: uniqueParticipants };
    }

    if (
      input.assignedTo &&
      !mongoose.isValidObjectId(input.assignedTo)
    ) {
      throw new ApiError("The assigned user ID is invalid.", 400, {
        code: "INVALID_ASSIGNED_USER_ID",
      });
    }

    if (input.booking && !mongoose.isValidObjectId(input.booking)) {
      throw new ApiError("The booking ID is invalid.", 400, {
        code: "INVALID_BOOKING_ID",
      });
    }

    if (
      (existing.status === "closed" || existing.status === "resolved") &&
      input.status === "open"
    ) {
      // Reopening is allowed through this explicit status update.
      // The model clears the previous resolution timestamps.
    }

    const updated = await conversationRepository.update(
      conversationId,
      input,
    );

    if (!updated) {
      throw new ApiError("Unable to update conversation.", 500, {
        code: "CONVERSATION_UPDATE_FAILED",
      });
    }

    return updated;
  }

  async updateStatus(
    conversationId: string,
    status: "open" | "pending" | "resolved" | "closed",
    requestingUserId?: string,
  ) {
    const existing = await conversationRepository.findByIdForUpdate(
      conversationId,
    );

    if (!existing) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    if (requestingUserId) {
      const participants = existing.participants as unknown as ParticipantId[];

      if (!hasParticipant(participants, requestingUserId)) {
        throw new ApiError("You cannot change this conversation.", 403, {
          code: "CONVERSATION_STATUS_FORBIDDEN",
        });
      }
    }

    if (existing.status === "closed" && status !== "closed") {
      throw new ApiError(
        "A closed conversation cannot be reopened.",
        409,
        { code: "CONVERSATION_ALREADY_CLOSED" },
      );
    }

    const updated = await conversationRepository.updateStatus(
      conversationId,
      status,
    );

    if (!updated) {
      throw new ApiError("Unable to update conversation status.", 500, {
        code: "CONVERSATION_STATUS_UPDATE_FAILED",
      });
    }

    return updated;
  }

  async assign(
    conversationId: string,
    assignedTo: string | null,
  ) {
    if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
      throw new ApiError("The assigned user ID is invalid.", 400, {
        code: "INVALID_ASSIGNED_USER_ID",
      });
    }

    const updated = await conversationRepository.update(
      conversationId,
      { assignedTo },
    );

    if (!updated) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    return updated;
  }

  async markAsRead(conversationId: string, requestingUserId: string) {
    if (!mongoose.isValidObjectId(requestingUserId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_USER_ID",
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

    const participants = conversation.participants as unknown as ParticipantId[];

    if (!hasParticipant(participants, requestingUserId)) {
      throw new ApiError("You cannot access this conversation.", 403, {
        code: "CONVERSATION_ACCESS_DENIED",
      });
    }

    await Message.updateMany(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        recipient: new mongoose.Types.ObjectId(requestingUserId),
        status: { $in: ["sent", "delivered"] },
      },
      {
        $set: { status: "read", readAt: new Date() },
        $setOnInsert: {},
      },
      { runValidators: true },
    ).exec();

    return conversationRepository.resetUnreadCount(conversationId);
  }

  async delete(conversationId: string, requestingUserId?: string) {
    const existing = await conversationRepository.findByIdForUpdate(
      conversationId,
    );

    if (!existing) {
      throw new ApiError("Conversation not found.", 404, {
        code: "CONVERSATION_NOT_FOUND",
      });
    }

    if (requestingUserId) {
      const participants = existing.participants as unknown as ParticipantId[];

      if (!hasParticipant(participants, requestingUserId)) {
        throw new ApiError("You cannot delete this conversation.", 403, {
          code: "CONVERSATION_DELETE_FORBIDDEN",
        });
      }
    }

    const deleted = await conversationRepository.deleteWithMessages(
      conversationId,
    );

    if (!deleted) {
      throw new ApiError("Unable to delete conversation.", 500, {
        code: "CONVERSATION_DELETE_FAILED",
      });
    }

    return deleted;
  }

  async count(query: ConversationCountQuery = {}) {
    return conversationRepository.count(query);
  }

  async getStats(
    query: Pick<
      ConversationCountQuery,
      "participant" | "createdBy" | "assignedTo"
    > = {},
  ) {
    return conversationRepository.getStats(query);
  }

  async getUnreadCount(userId: string) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    const result = await Conversation.aggregate<{ total: number }>([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
          status: { $in: ["open", "pending"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$unreadCount" },
        },
      },
    ]).exec();

    return result[0]?.total ?? 0;
  }
}

export const conversationService = new ConversationService();
