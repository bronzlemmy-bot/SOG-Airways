
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_METHODS = [
  "credit_card",
  "debit_card",
  "bank_transfer",
  "mobile_money",
  "digital_wallet",
  "cash",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_PROVIDERS = [
  "paystack",
  "flutterwave",
  "stripe",
  "paypal",
  "bank",
  "manual",
  "other",
] as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const REFUND_STATUSES = [
  "not_requested",
  "pending",
  "processing",
  "completed",
  "failed",
] as const;

export type RefundStatus = (typeof REFUND_STATUSES)[number];

const paymentSchema = new Schema(
  {
    paymentReference: {
      type: String,
      required: [true, "Payment reference is required."],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 5,
      maxlength: 50,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required."],
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      required: [true, "Customer is required."],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required."],
      min: [0.01, "Payment amount must be greater than zero."],
      validate: {
        validator: (value: number) =>
          Number.isFinite(value) &&
          Math.round(value * 100) / 100 === value,
        message: "Payment amount must have at most two decimal places.",
      },
    },
    currency: {
      type: String,
      required: [true, "Payment currency is required."],
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: "USD",
    },
    method: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: "The selected payment method is invalid.",
      },
      required: true,
    },
    provider: {
      type: String,
      enum: {
        values: PAYMENT_PROVIDERS,
        message: "The selected payment provider is invalid.",
      },
      required: true,
      default: "other",
    },
    status: {
      type: String,
      enum: {
        values: PAYMENT_STATUSES,
        message: "The selected payment status is invalid.",
      },
      required: true,
      default: "pending",
      index: true,
    },
    providerTransactionId: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    idempotencyKey: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
    failureCode: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    failureReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    refundedAmount: {
      type: Number,
      min: [0, "Refunded amount cannot be negative."],
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: {
        values: REFUND_STATUSES,
        message: "The selected refund status is invalid.",
      },
      required: true,
      default: "not_requested",
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundReference: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

paymentSchema.index({ booking: 1, createdAt: -1 });
paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ provider: 1, providerTransactionId: 1 });
paymentSchema.index(
  { idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: "string" },
    },
  },
);

paymentSchema.pre("validate", function () {
  if (this.refundedAmount > this.amount) {
    this.invalidate(
      "refundedAmount",
      "Refunded amount cannot exceed the original payment amount.",
    );
  }

  if (
    this.status === "refunded" &&
    this.refundedAmount < this.amount
  ) {
    this.invalidate(
      "refundedAmount",
      "A fully refunded payment must have its full amount refunded.",
    );
  }

  if (
    this.status === "partially_refunded" &&
    (this.refundedAmount <= 0 ||
      this.refundedAmount >= this.amount)
  ) {
    this.invalidate(
      "refundedAmount",
      "A partially refunded payment must have a refund greater than zero and less than the original amount.",
    );
  }

  if (
    this.refundedAmount > 0 &&
    this.refundStatus === "not_requested"
  ) {
    this.invalidate(
      "refundStatus",
      "A payment with a refund must have a refund status.",
    );
  }

  if (
    this.status === "completed" &&
    !this.paidAt
  ) {
    this.paidAt = new Date();
  }

  if (
    this.refundStatus === "completed" &&
    !this.refundedAt
  ) {
    this.refundedAt = new Date();
  }
});

type PaymentSchemaData = InferSchemaType<typeof paymentSchema>;

export type PaymentRecord = PaymentSchemaData & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Payment: Model<PaymentRecord> =
  (mongoose.models.Payment as Model<PaymentRecord> | undefined) ??
  mongoose.model<PaymentRecord>("Payment", paymentSchema);
