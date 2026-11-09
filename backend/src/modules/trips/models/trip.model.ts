
import mongoose, {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

export const TRIP_STATUSES = [
  "planned",
  "booked",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type TripStatus = (typeof TRIP_STATUSES)[number];

export const TRIP_TYPES = [
  "one_way",
  "round_trip",
  "multi_city",
] as const;

export type TripType = (typeof TRIP_TYPES)[number];

const tripSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      required: true,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },
    tripReference: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },
    tripType: {
      type: String,
      enum: TRIP_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: TRIP_STATUSES,
      default: "planned",
      required: true,
      index: true,
    },
    originAirport: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },
    destinationAirport: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    passengerCount: {
      type: Number,
      required: true,
      min: 1,
      max: 9,
      default: 1,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: "USD",
    },
    estimatedBudget: {
      type: Number,
      min: 0,
      default: null,
    },
    actualCost: {
      type: Number,
      min: 0,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: null,
    },
    completedAt: {
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
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

tripSchema.index({ customer: 1, departureDate: -1 });
tripSchema.index({ customer: 1, status: 1 });
tripSchema.index({ booking: 1, customer: 1 });

tripSchema.pre("validate", function () {
  if (
    this.returnDate &&
    this.returnDate.getTime() < this.departureDate.getTime()
  ) {
    this.invalidate(
      "returnDate",
      "Return date cannot be earlier than departure date.",
    );
  }

  if (this.tripType === "round_trip" && !this.returnDate) {
    this.invalidate(
      "returnDate",
      "A return date is required for a round-trip.",
    );
  }

  if (this.tripType === "one_way" && this.returnDate) {
    this.invalidate(
      "returnDate",
      "A one-way trip cannot have a return date.",
    );
  }

  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  }

  if (this.status === "cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
});

export type TripRecord = InferSchemaType<typeof tripSchema>;

export const Trip =
  mongoose.models.Trip || model("Trip", tripSchema);
