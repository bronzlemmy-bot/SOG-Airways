
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const TICKET_STATUSES = [
  "issued",
  "checked_in",
  "used",
  "cancelled",
  "voided",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_CLASSES = [
  "economy",
  "premium_economy",
  "business",
  "first",
] as const;

export type TicketClass = (typeof TICKET_CLASSES)[number];

const ticketSchema = new Schema(
  {
    ticketNumber: {
      type: String,
      required: [true, "Ticket number is required."],
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

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment is required."],
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      required: [true, "Customer is required."],
      index: true,
    },

    passenger: {
      type: Schema.Types.ObjectId,
      ref: "Passenger",
      required: [true, "Passenger is required."],
      index: true,
    },

    flight: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: [true, "Flight is required."],
      index: true,
    },
    trackingReference: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 40,
      default: undefined,
      index: true,
    },

    ticketClass: {
      type: String,
      enum: {
        values: TICKET_CLASSES,
        message: "The selected ticket class is invalid.",
      },
      required: [true, "Ticket class is required."],
    },

    status: {
      type: String,
      enum: {
        values: TICKET_STATUSES,
        message: "The selected ticket status is invalid.",
      },
      default: "issued",
      required: true,
      index: true,
    },

    issuedAt: {
      type: Date,
      required: [true, "Ticket issue date is required."],
      default: Date.now,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    seatNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 10,
      default: null,
    },

    fareAmount: {
      type: Number,
      required: [true, "Ticket fare is required."],
      min: [0, "Ticket fare cannot be negative."],
      validate: {
        validator: (value: number) =>
          Number.isFinite(value) &&
          Math.round(value * 100) / 100 === value,
        message: "Ticket fare must have at most two decimal places.",
      },
    },

    currency: {
      type: String,
      required: [true, "Ticket currency is required."],
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: "USD",
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

ticketSchema.index(
  { booking: 1, passenger: 1, flight: 1 },
  { unique: true },
);
ticketSchema.index({ customer: 1, issuedAt: -1 });
ticketSchema.index({ flight: 1, status: 1 });
ticketSchema.index({ payment: 1, status: 1 });

ticketSchema.pre("validate", function () {
  if (this.status === "cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }

  if (this.status === "checked_in" && !this.checkedInAt) {
    this.checkedInAt = new Date();
  }

  if (this.status === "used" && !this.usedAt) {
    this.usedAt = new Date();
  }

  if (this.status !== "cancelled" && this.cancelledAt) {
    this.invalidate(
      "cancelledAt",
      "Only cancelled tickets can have a cancellation date.",
    );
  }

  if (this.status !== "checked_in" && this.checkedInAt) {
    this.invalidate(
      "checkedInAt",
      "Only checked-in tickets can have a check-in date.",
    );
  }

  if (this.status !== "used" && this.usedAt) {
    this.invalidate(
      "usedAt",
      "Only used tickets can have a usage date.",
    );
  }
});

type TicketSchemaData = InferSchemaType<typeof ticketSchema>;

export type TicketRecord = TicketSchemaData & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Ticket: Model<TicketRecord> =
  (mongoose.models.Ticket as Model<TicketRecord> | undefined) ??
  mongoose.model<TicketRecord>("Ticket", ticketSchema);
