
import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

export const MESSAGE_TYPES = ["direct", "support", "system"] as const;
export const MESSAGE_STATUSES = ["sent", "delivered", "read", "failed"] as const;
export const MESSAGE_PRIORITIES = ["low", "normal", "high", "urgent"] as const;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    type: {
      type: String,
      enum: MESSAGE_TYPES,
      default: "direct",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: MESSAGE_STATUSES,
      default: "sent",
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: MESSAGE_PRIORITIES,
      default: "normal",
      required: true,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },
    attachments: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2048,
          },
          fileName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
          },
          mimeType: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
          },
          size: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      default: [],
      validate: {
        validator: (attachments: unknown[]) => attachments.length <= 10,
        message: "A message can have at most 10 attachments.",
      },
    },
    readAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    failedReason: {
      type: String,
      trim: true,
      maxlength: 500,
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

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, status: 1, createdAt: -1 });
messageSchema.index({ booking: 1, createdAt: -1 });

messageSchema.pre("validate", function () {
  if (this.status === "read" && !this.readAt) {
    this.readAt = new Date();
  }

  if (
    (this.status === "delivered" || this.status === "read") &&
    !this.deliveredAt
  ) {
    this.deliveredAt = new Date();
  }

  if (this.status !== "read") {
    this.readAt = null;
  }

  if (this.status !== "delivered" && this.status !== "read") {
    this.deliveredAt = null;
  }
});

export type MessageRecord = InferSchemaType<typeof messageSchema>;

export const Message =
  mongoose.models.Message || model("Message", messageSchema);
