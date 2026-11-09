
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const AIRCRAFT_STATUSES = [
  "active",
  "maintenance",
  "inactive",
  "retired",
] as const;

export type AircraftStatus = (typeof AIRCRAFT_STATUSES)[number];

export const AIRCRAFT_TYPES = [
  "narrow_body",
  "wide_body",
  "regional",
  "cargo",
  "private",
] as const;

export type AircraftType = (typeof AIRCRAFT_TYPES)[number];

const aircraftCapacitySchema = new Schema(
  {
    economy: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    premiumEconomy: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    business: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    first: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const aircraftSchema = new Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "Aircraft registration number is required."],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 20,
      index: true,
    },

    manufacturer: {
      type: String,
      required: [true, "Aircraft manufacturer is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    model: {
      type: String,
      required: [true, "Aircraft model is required."],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    aircraftType: {
      type: String,
      required: [true, "Aircraft type is required."],
      enum: {
        values: AIRCRAFT_TYPES,
        message: "The selected aircraft type is invalid.",
      },
    },

    serialNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 100,
      sparse: true,
    },

    manufactureYear: {
      type: Number,
      required: [true, "Aircraft manufacture year is required."],
      min: [1900, "Manufacture year cannot be earlier than 1900."],
      max: [
        new Date().getFullYear() + 1,
        "Manufacture year cannot be too far in the future.",
      ],
      validate: {
        validator: Number.isInteger,
        message: "Manufacture year must be a whole number.",
      },
    },

    capacity: {
      type: aircraftCapacitySchema,
      required: [true, "Aircraft seating capacity is required."],
      validate: {
        validator: (value: {
          economy: number;
          premiumEconomy: number;
          business: number;
          first: number;
          total: number;
        }) =>
          value.economy +
            value.premiumEconomy +
            value.business +
            value.first ===
          value.total,
        message:
          "Total aircraft capacity must equal the sum of all cabin capacities.",
      },
    },

    rangeKilometers: {
      type: Number,
      required: [true, "Aircraft range is required."],
      min: [1, "Aircraft range must be greater than zero."],
      validate: {
        validator: Number.isFinite,
        message: "Aircraft range must be a valid number.",
      },
    },

    status: {
      type: String,
      enum: {
        values: AIRCRAFT_STATUSES,
        message: "The selected aircraft status is invalid.",
      },
      default: "active",
      required: true,
      index: true,
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

aircraftSchema.index({ manufacturer: 1, model: 1 });
aircraftSchema.index({ status: 1, aircraftType: 1 });

type AircraftSchemaData = InferSchemaType<typeof aircraftSchema>;

export type AircraftRecord = AircraftSchemaData & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Aircraft: Model<AircraftRecord> =
  (mongoose.models.Aircraft as Model<AircraftRecord> | undefined) ??
  mongoose.model<AircraftRecord>("Aircraft", aircraftSchema);
