
import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

export const CONTACT_STATUSES = [
  "new",
  "in_progress",
  "resolved",
  "closed",
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_CATEGORIES = [
  "general_inquiry",
  "booking",
  "payment",
  "refund",
  "flight",
  "baggage",
  "complaint",
  "compliment",
  "technical_support",
  "other",
] as const;

export type ContactCategory =
  (typeof CONTACT_CATEGORIES)[number];

const contactSchema = new Schema(
  {
    reference: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      maxlength: 254,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },
    subject: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      trim: true,
      required: true,
      maxlength: 10000,
    },
    category: {
      type: String,
      enum: CONTACT_CATEGORIES,
      default: "general_inquiry",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: CONTACT_STATUSES,
      default: "new",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      default: null,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
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
    strict: true,
  },
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1, createdAt: -1 });
contactSchema.index({ customer: 1, createdAt: -1 });

contactSchema.pre("validate", function () {
  if (this.status === "resolved" && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }

  if (this.status === "closed" && !this.closedAt) {
    this.closedAt = new Date();
  }
});

export type ContactRecord = InferSchemaType<typeof contactSchema>;

export const Contact =
  mongoose.models.Contact || model("Contact", contactSchema);
