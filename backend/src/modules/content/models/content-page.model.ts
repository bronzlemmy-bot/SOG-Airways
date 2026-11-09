
import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

export const CONTENT_TYPES = [
  "page",
  "banner",
  "announcement",
  "faq",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CONTENT_CATEGORIES = [
  "general",
  "travel",
  "booking",
  "baggage",
  "destinations",
  "offers",
  "policies",
  "support",
] as const;

export type ContentCategory =
  (typeof CONTENT_CATEGORIES)[number];

const contentSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      maxlength: 220,
    },
    type: {
      type: String,
      enum: CONTENT_TYPES,
      required: true,
      default: "page",
      index: true,
    },
    category: {
      type: String,
      enum: CONTENT_CATEGORIES,
      required: true,
      default: "general",
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    body: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100000,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
      maxlength: 2048,
    },
    status: {
      type: String,
      enum: CONTENT_STATUSES,
      required: true,
      default: "draft",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) =>
          tags.length <= 30 &&
          tags.every((tag) => tag.trim().length > 0 && tag.length <= 50),
        message: "Content can have at most 30 valid tags.",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: 70,
        default: null,
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: 170,
        default: null,
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

contentSchema.index({ status: 1, publishedAt: -1 });
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ category: 1, status: 1 });
contentSchema.index({ isFeatured: 1, status: 1, sortOrder: 1 });
contentSchema.index({ title: "text", excerpt: "text", body: "text" });

contentSchema.pre("validate", function () {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (this.status !== "published") {
    this.publishedAt = null;
  }

  if (this.expiresAt && this.scheduledAt) {
    if (this.expiresAt <= this.scheduledAt) {
      this.invalidate(
        "expiresAt",
        "Expiration date must be later than the scheduled publication date.",
      );
    }
  }

  if (this.expiresAt && this.publishedAt) {
    if (this.expiresAt <= this.publishedAt) {
      this.invalidate(
        "expiresAt",
        "Expiration date must be later than the publication date.",
      );
    }
  }
});

export type ContentRecord = InferSchemaType<typeof contentSchema>;

export const Content =
  mongoose.models.Content || model("Content", contentSchema);
