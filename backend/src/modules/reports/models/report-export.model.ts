
import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

export const REPORT_TYPES = [
  "booking_summary",
  "revenue",
  "flight_performance",
  "passenger_manifest",
  "payment_transactions",
  "customer_activity",
  "staff_activity",
  "operational",
] as const;

export const REPORT_FORMATS = [
  "json",
  "csv",
  "xlsx",
  "pdf",
] as const;

export const REPORT_STATUSES = [
  "queued",
  "processing",
  "completed",
  "failed",
  "expired",
] as const;

const reportSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    type: {
      type: String,
      enum: REPORT_TYPES,
      required: true,
      index: true,
    },

    format: {
      type: String,
      enum: REPORT_FORMATS,
      required: true,
      default: "csv",
    },

    status: {
      type: String,
      enum: REPORT_STATUSES,
      required: true,
      default: "queued",
      index: true,
    },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    filters: {
      type: Schema.Types.Mixed,
      default: {},
    },

    fileUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: null,
    },

    fileName: {
      type: String,
      trim: true,
      maxlength: 255,
      default: null,
    },

    fileSizeBytes: {
      type: Number,
      min: 0,
      default: null,
    },

    recordCount: {
      type: Number,
      min: 0,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    errorMessage: {
      type: String,
      trim: true,
      maxlength: 2000,
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

reportSchema.index({
  requestedBy: 1,
  createdAt: -1,
});

reportSchema.index({
  type: 1,
  status: 1,
  createdAt: -1,
});

reportSchema.pre("validate", function () {
  if (this.status === "processing" && !this.startedAt) {
    this.startedAt = new Date();
  }

  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  }

  if (this.status === "failed" && !this.errorMessage) {
    this.errorMessage = "Report generation failed.";
  }

  if (this.status !== "failed") {
    this.errorMessage = null;
  }
});

export type ReportRecord = InferSchemaType<typeof reportSchema>;

export const Report =
  mongoose.models.Report || model("Report", reportSchema);
