
import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

export const CHECK_IN_STATUSES = [
  "pending",
  "checked_in",
  "cancelled",
] as const;

export type CheckInStatus = (typeof CHECK_IN_STATUSES)[number];

export const BOARDING_PASS_STATUSES = [
  "not_issued",
  "issued",
  "used",
  "voided",
] as const;

export type BoardingPassStatus =
  (typeof BOARDING_PASS_STATUSES)[number];

const checkInSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    passenger: {
      type: Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
      index: true,
    },
    flight: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: CHECK_IN_STATUSES,
      default: "pending",
      required: true,
    },
    boardingPassStatus: {
      type: String,
      enum: BOARDING_PASS_STATUSES,
      default: "not_issued",
      required: true,
    },
    checkInReference: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    seatNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 10,
      default: null,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    boardingPassIssuedAt: {
      type: Date,
      default: null,
    },
    boardingPassUsedAt: {
      type: Date,
      default: null,
    },
    baggageCount: {
      type: Number,
      min: 0,
      max: 20,
      default: 0,
      required: true,
    },
    baggageWeightKg: {
      type: Number,
      min: 0,
      max: 200,
      default: 0,
      required: true,
    },
    specialAssistanceRequired: {
      type: Boolean,
      default: false,
      required: true,
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

checkInSchema.index(
  { booking: 1, passenger: 1, flight: 1 },
  { unique: true },
);

checkInSchema.index({ customer: 1, createdAt: -1 });
checkInSchema.index({ flight: 1, status: 1 });
checkInSchema.index({ ticket: 1 }, { unique: true });

checkInSchema.pre("validate", function () {
  if (this.status === "checked_in" && !this.checkedInAt) {
    this.checkedInAt = new Date();
  }

  if (this.status === "cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }

  if (
    this.boardingPassStatus === "issued" &&
    !this.boardingPassIssuedAt
  ) {
    this.boardingPassIssuedAt = new Date();
  }

  if (
    this.boardingPassStatus === "used" &&
    !this.boardingPassUsedAt
  ) {
    this.boardingPassUsedAt = new Date();
  }

  if (
    this.boardingPassStatus === "used" &&
    !this.boardingPassIssuedAt
  ) {
    this.invalidate(
      "boardingPassStatus",
      "A boarding pass must be issued before it can be used.",
    );
  }

  if (
    this.status === "cancelled" &&
    this.boardingPassStatus === "used"
  ) {
    this.invalidate(
      "status",
      "A check-in record with a used boarding pass cannot be cancelled.",
    );
  }
});

export type CheckInRecord = InferSchemaType<typeof checkInSchema>;

export const CheckIn =
  mongoose.models.CheckIn || model("CheckIn", checkInSchema);
