
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "expired",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_CLASSES = [
  "economy",
  "premium_economy",
  "business",
  "first",
] as const;

export type BookingClass = (typeof BOOKING_CLASSES)[number];

export const BOOKING_PAYMENT_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "partially_refunded",
  "refunded",
  "failed",
] as const;

export type BookingPaymentStatus =
  (typeof BOOKING_PAYMENT_STATUSES)[number];

const bookingSchema = new Schema(
  {
    bookingReference: {
      type: String,
      required: [true, "Booking reference is required."],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 5,
      maxlength: 30,
      index: true,
    },
    idempotencyKey: {
      type: String,
      trim: true,
      maxlength: 200,
      default: undefined,
    },
    requestHash: {
      type: String,
      trim: true,
      maxlength: 64,
      default: undefined,
    },
    trackingReference: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 8,
      maxlength: 40,
      default: undefined,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      required: [true, "Customer is required."],
      index: true,
    },
    flight: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: [true, "Flight is required."],
      index: true,
    },
    passengers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Passenger",
      },
    ],
    passengerCount: {
      type: Number,
      required: [true, "Passenger count is required."],
      min: [1, "A booking must have at least one passenger."],
      max: [9, "A booking cannot exceed nine passengers."],
      validate: {
        validator: Number.isInteger,
        message: "Passenger count must be a whole number.",
      },
    },
    bookingClass: {
      type: String,
      enum: {
        values: BOOKING_CLASSES,
        message: "The selected booking class is invalid.",
      },
      required: true,
      default: "economy",
    },
    status: {
      type: String,
      enum: {
        values: BOOKING_STATUSES,
        message: "The selected booking status is invalid.",
      },
      required: true,
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: BOOKING_PAYMENT_STATUSES,
        message: "The selected payment status is invalid.",
      },
      required: true,
      default: "unpaid",
      index: true,
    },
    currency: {
      type: String,
      required: [true, "Booking currency is required."],
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: "USD",
    },
    baseFare: {
      type: Number,
      required: [true, "Base fare is required."],
      min: [0, "Base fare cannot be negative."],
      default: 0,
    },
    taxes: {
      type: Number,
      required: [true, "Taxes are required."],
      min: [0, "Taxes cannot be negative."],
      default: 0,
    },
    fees: {
      type: Number,
      required: [true, "Booking fees are required."],
      min: [0, "Booking fees cannot be negative."],
      default: 0,
    },
    discount: {
      type: Number,
      required: [true, "Discount is required."],
      min: [0, "Discount cannot be negative."],
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total booking amount is required."],
      min: [0, "Total booking amount cannot be negative."],
      default: 0,
    },
    bookedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

bookingSchema.index({ customer: 1, bookedAt: -1 });
bookingSchema.index({ flight: 1, status: 1 });
bookingSchema.index({ status: 1, bookedAt: -1 });
bookingSchema.index({ paymentStatus: 1, bookedAt: -1 });
bookingSchema.index(
  { customer: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: "string" } },
  },
);
bookingSchema.index(
  { trackingReference: 1 },
  {
    unique: true,
    partialFilterExpression: { trackingReference: { $type: "string" } },
  },
);

bookingSchema.pre("validate", function () {
  if (this.passengers.length > this.passengerCount) {
    this.invalidate(
      "passengers",
      "Passenger records cannot exceed the booking passenger count.",
    );
  }

  const expectedTotal =
    this.baseFare + this.taxes + this.fees - this.discount;

  if (expectedTotal < 0) {
    this.invalidate(
      "discount",
      "Discount cannot exceed the base fare, taxes, and fees combined.",
    );
  }

  if (Math.abs(this.totalAmount - expectedTotal) > 0.01) {
    this.invalidate(
      "totalAmount",
      "Total amount must equal base fare plus taxes and fees, minus discount.",
    );
  }

  if (this.status === "cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
});

type BookingSchemaData = InferSchemaType<typeof bookingSchema>;

export type BookingRecord = BookingSchemaData & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Booking: Model<BookingRecord> =
  (mongoose.models.Booking as Model<BookingRecord> | undefined) ??
  mongoose.model<BookingRecord>("Booking", bookingSchema);
