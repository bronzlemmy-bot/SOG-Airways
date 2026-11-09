
import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

export const CONVERSATION_STATUSES = [
  "open",
  "pending",
  "resolved",
  "closed",
] as const;

export const CONVERSATION_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

export const CONVERSATION_CHANNELS = [
  "web",
  "email",
  "mobile",
  "admin",
] as const;

const conversationSchema = new Schema(
  {
    subject: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      validate: {
        validator: (participants: unknown[]) =>
          participants.length >= 1 &&
          participants.length <= 50,
        message: "A conversation must have between 1 and 50 participants.",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: CONVERSATION_STATUSES,
      default: "open",
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: CONVERSATION_PRIORITIES,
      default: "normal",
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: CONVERSATION_CHANNELS,
      default: "web",
      required: true,
      index: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) =>
          tags.length <= 30 &&
          tags.every((tag) => tag.trim().length > 0 && tag.length <= 50),
        message: "A conversation can have at most 30 valid tags.",
      },
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ assignedTo: 1, status: 1, updatedAt: -1 });
conversationSchema.index({ status: 1, priority: 1, updatedAt: -1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.pre("validate", function () {
  if (this.status === "resolved") {
    if (!this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    this.closedAt = null;
  } else if (this.status === "closed") {
    if (!this.closedAt) {
      this.closedAt = new Date();
    }
    if (!this.resolvedAt) {
      this.resolvedAt = new Date();
    }
  } else {
    this.resolvedAt = null;
    this.closedAt = null;
  }
});

export type ConversationRecord = InferSchemaType<
  typeof conversationSchema
>;

export const Conversation =
  mongoose.models.Conversation ||
  model("Conversation", conversationSchema);
