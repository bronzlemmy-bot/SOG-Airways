
import mongoose, {
  model,
  Schema,
  Types,
  type HydratedDocument,
  type Model,
} from "mongoose";

export const SUPPORT_CASE_CATEGORIES = [
  "booking",
  "payment",
  "cancellation",
  "refund",
  "check_in",
  "baggage",
  "flight",
  "account",
  "technical",
  "other",
] as const;

export const SUPPORT_CASE_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const SUPPORT_CASE_STATUSES = [
  "open",
  "in_progress",
  "waiting_for_customer",
  "resolved",
  "closed",
] as const;

export type SupportCaseCategory =
  (typeof SUPPORT_CASE_CATEGORIES)[number];

export type SupportCasePriority =
  (typeof SUPPORT_CASE_PRIORITIES)[number];

export type SupportCaseStatus =
  (typeof SUPPORT_CASE_STATUSES)[number];

export interface ISupportMessage {
  senderId?: Types.ObjectId | null;
  senderRole: "customer" | "staff" | "admin" | "system";
  message: string;
  attachments: string[];
  createdAt: Date;
}

export interface ISupportCase {
  caseNumber: string;
  customerId?: Types.ObjectId | null;
  assignedTo?: Types.ObjectId | null;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: SupportCaseCategory;
  priority: SupportCasePriority;
  status: SupportCaseStatus;
  messages: ISupportMessage[];
  resolution?: string | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SupportCaseDocument = HydratedDocument<ISupportCase>;

type SupportCaseModelType = Model<ISupportCase>;

const supportMessageSchema = new Schema<ISupportMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    senderRole: {
      type: String,
      enum: ["customer", "staff", "admin", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true,
  },
);

const supportCaseSchema = new Schema<
  ISupportCase,
  SupportCaseModelType
>(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 10000,
    },
    category: {
      type: String,
      enum: SUPPORT_CASE_CATEGORIES,
      required: true,
      default: "other",
    },
    priority: {
      type: String,
      enum: SUPPORT_CASE_PRIORITIES,
      required: true,
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: SUPPORT_CASE_STATUSES,
      required: true,
      default: "open",
      index: true,
    },
    messages: {
      type: [supportMessageSchema],
      default: [],
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

supportCaseSchema.index({ customerId: 1, createdAt: -1 });
supportCaseSchema.index({
  status: 1,
  priority: -1,
  createdAt: -1,
});
supportCaseSchema.index({ customerEmail: 1, createdAt: -1 });

export const SupportCase =
  (mongoose.models.SupportCase as
    | SupportCaseModelType
    | undefined) ??
  model<ISupportCase, SupportCaseModelType>(
    "SupportCase",
    supportCaseSchema,
  );
