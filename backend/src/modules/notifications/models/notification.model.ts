
import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

export const NOTIFICATION_TYPES = [
  "booking",
  "payment",
  "flight",
  "check_in",
  "ticket",
  "trip",
  "message",
  "support",
  "security",
  "system",
  "promotion",
] as const;

export const NOTIFICATION_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

export const NOTIFICATION_STATUSES = [
  "unread",
  "read",
  "archived",
] as const;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      default: "system",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      required: true,
      default: "normal",
      index: true,
    },
    status: {
      type: String,
      enum: NOTIFICATION_STATUSES,
      required: true,
      default: "unread",
      index: true,
    },
    actionUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: null,
    },
    relatedEntity: {
      entityType: {
        type: String,
        trim: true,
        maxlength: 100,
        default: null,
      },
      entityId: {
        type: Schema.Types.ObjectId,
        default: null,
      },
    },
    readAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
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

notificationSchema.index({
  recipient: 1,
  status: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  type: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

notificationSchema.pre("validate", function () {
  if (this.status === "unread") {
    this.readAt = null;
    this.archivedAt = null;
  }

  if (this.status === "read") {
    if (!this.readAt) {
      this.readAt = new Date();
    }

    this.archivedAt = null;
  }

  if (this.status === "archived" && !this.archivedAt) {
    this.archivedAt = new Date();
  }
});

export type NotificationRecord = InferSchemaType<
  typeof notificationSchema
>;

export const Notification =
  mongoose.models.Notification ||
  model("Notification", notificationSchema);
