
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const FLIGHT_STATUSES = [
  "scheduled",
  "boarding",
  "departed",
  "in_flight",
  "landed",
  "delayed",
  "cancelled",
] as const;

export type FlightStatus = (typeof FLIGHT_STATUSES)[number];

export interface FlightFare {
  baseFare: number;
  taxes: number;
  fees: number;
  currency: string;
}

export type FlightFareSchedule = Partial<
  Record<
    "economy" | "premium_economy" | "business" | "first",
    FlightFare
  >
>;

const flightFareSchema = new Schema<FlightFare>(
  {
    baseFare: { type: Number, required: true, min: 0 },
    taxes: { type: Number, required: true, min: 0, default: 0 },
    fees: { type: Number, required: true, min: 0, default: 0 },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: "USD",
    },
  },
  { _id: false },
);

const flightFareScheduleSchema = new Schema(
  {
    economy: flightFareSchema,
    premium_economy: flightFareSchema,
    business: flightFareSchema,
    first: flightFareSchema,
  },
  { _id: false },
);

const flightSchema = new Schema(
  {
    flightNumber: {
      type: String,
      required: [true, "Flight number is required."],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 20,
      index: true,
    },

    aircraft: {
      type: Schema.Types.ObjectId,
      ref: "Aircraft",
      required: [true, "Aircraft is required for a flight."],
      index: true,
    },

    departureAirport: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: [true, "Departure airport is required."],
      index: true,
    },

    arrivalAirport: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: [true, "Arrival airport is required."],
      index: true,
    },

    scheduledDeparture: {
      type: Date,
      required: [true, "Scheduled departure time is required."],
      index: true,
    },

    scheduledArrival: {
      type: Date,
      required: [true, "Scheduled arrival time is required."],
      index: true,
    },

    estimatedDeparture: {
      type: Date,
      default: null,
    },

    estimatedArrival: {
      type: Date,
      default: null,
    },

    actualDeparture: {
      type: Date,
      default: null,
    },

    actualArrival: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: FLIGHT_STATUSES,
        message: "The selected flight status is invalid.",
      },
      default: "scheduled",
      required: true,
      index: true,
    },

    departureTerminal: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    departureGate: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },

    arrivalTerminal: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    arrivalGate: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },

    durationMinutes: {
      type: Number,
      required: [true, "Flight duration is required."],
      min: [1, "Flight duration must be greater than zero."],
      validate: {
        validator: Number.isInteger,
        message: "Flight duration must be a whole number of minutes.",
      },
    },

    fareSchedule: {
      type: flightFareScheduleSchema,
      default: undefined,
    },

    bookingRevision: {
      type: Number,
      min: 0,
      default: 0,
      select: false,
    },

    distanceKilometers: {
      type: Number,
      min: [1, "Flight distance must be greater than zero."],
      validate: {
        validator: (value: number | null | undefined) =>
          value == null || Number.isFinite(value),
        message: "Flight distance must be a valid number.",
      },
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

flightSchema.index({
  flightNumber: 1,
  scheduledDeparture: 1,
});

flightSchema.index({
  departureAirport: 1,
  arrivalAirport: 1,
  scheduledDeparture: 1,
});

flightSchema.index({
  status: 1,
  scheduledDeparture: 1,
});

flightSchema.pre("validate", function () {
  if (
    this.departureAirport &&
    this.arrivalAirport &&
    this.departureAirport.equals(this.arrivalAirport)
  ) {
    this.invalidate(
      "arrivalAirport",
      "Departure and arrival airports must be different.",
    );
  }

  if (
    this.scheduledDeparture &&
    this.scheduledArrival &&
    this.scheduledArrival <= this.scheduledDeparture
  ) {
    this.invalidate(
      "scheduledArrival",
      "Scheduled arrival must be later than scheduled departure.",
    );
  }

  if (
    this.actualDeparture &&
    this.actualArrival &&
    this.actualArrival < this.actualDeparture
  ) {
    this.invalidate(
      "actualArrival",
      "Actual arrival cannot be earlier than actual departure.",
    );
  }
});

type FlightSchemaData = InferSchemaType<typeof flightSchema>;

export type FlightRecord = FlightSchemaData & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Flight: Model<FlightRecord> =
  (mongoose.models.Flight as Model<FlightRecord> | undefined) ??
  mongoose.model<FlightRecord>("Flight", flightSchema);
