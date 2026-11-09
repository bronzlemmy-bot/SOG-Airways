
import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

export const NEWSLETTER_STATUSES = [
  "pending",
  "subscribed",
  "unsubscribed",
] as const;

export const NEWSLETTER_SOURCES = [
  "website",
  "booking",
  "admin",
  "other",
] as const;

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    status: {
      type: String,
      enum: NEWSLETTER_STATUSES,
      default: "pending",
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: NEWSLETTER_SOURCES,
      default: "website",
      required: true,
    },
    consentGiven: {
      type: Boolean,
      default: false,
      required: true,
    },
    consentAt: {
      type: Date,
      default: null,
    },
    subscribedAt: {
      type: Date,
      default: null,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
    confirmationTokenHash: {
      type: String,
      select: false,
      default: null,
    },
    confirmationTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    unsubscribeTokenHash: {
      type: String,
      select: false,
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

newsletterSchema.index({ email: 1 }, { unique: true });
newsletterSchema.index({ status: 1, createdAt: -1 });
newsletterSchema.index({ subscribedAt: -1 });

newsletterSchema.pre("validate", function () {
  if (this.status === "subscribed") {
    if (!this.consentGiven) {
      this.invalidate(
        "consentGiven",
        "Consent is required for an active newsletter subscription.",
      );
    }

    if (!this.subscribedAt) {
      this.subscribedAt = new Date();
    }

    this.unsubscribedAt = null;
  }

  if (this.status === "unsubscribed" && !this.unsubscribedAt) {
    this.unsubscribedAt = new Date();
  }

  if (this.status === "pending") {
    this.subscribedAt = null;
    this.unsubscribedAt = null;
  }

  if (this.consentGiven && !this.consentAt) {
    this.consentAt = new Date();
  }
});

export type NewsletterRecord = InferSchemaType<
  typeof newsletterSchema
>;

export const Newsletter =
  mongoose.models.Newsletter ||
  model("Newsletter", newsletterSchema);
