
import mongoose, { type Document, type Model } from "mongoose";

export const AIRPORT_STATUSES = [
  "active",
  "inactive",
] as const;

export type AirportStatus = (typeof AIRPORT_STATUSES)[number];

export interface AirportCoordinates {
  latitude: number;
  longitude: number;
}

export interface AirportRecord extends Document {
  airportCode: string;
  icaoCode: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  timezone: string;
  coordinates: AirportCoordinates;
  status: AirportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const airportSchema = new mongoose.Schema<AirportRecord>(
  {
    airportCode: {
      type: String,
      required: [true, "Airport IATA code is required."],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      match: [
        /^[A-Z]{3}$/,
        "Airport IATA code must contain exactly three letters.",
      ],
    },

    icaoCode: {
      type: String,
      required: [true, "Airport ICAO code is required."],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 4,
      maxlength: 4,
      match: [
        /^[A-Z]{4}$/,
        "Airport ICAO code must contain exactly four letters.",
      ],
    },

    name: {
      type: String,
      required: [true, "Airport name is required."],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    city: {
      type: String,
      required: [true, "Airport city is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    state: {
      type: String,
      trim: true,
      maxlength: 100,
      default: undefined,
    },

    country: {
      type: String,
      required: [true, "Airport country is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    countryCode: {
      type: String,
      required: [true, "Country ISO code is required."],
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 2,
      match: [
        /^[A-Z]{2}$/,
        "Country code must contain two letters.",
      ],
    },

    timezone: {
      type: String,
      required: [true, "Airport timezone is required."],
      trim: true,
      maxlength: 100,
    },

    coordinates: {
      type: {
        latitude: {
          type: Number,
          required: true,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          required: true,
          min: -180,
          max: 180,
        },
      },
      required: [true, "Airport coordinates are required."],
      _id: false,
    },

    status: {
      type: String,
      enum: {
        values: [...AIRPORT_STATUSES],
        message: "Invalid airport status.",
      },
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

airportSchema.index({ country: 1, city: 1 });
airportSchema.index({ status: 1, name: 1 });

export const Airport: Model<AirportRecord> =
  (mongoose.models.Airport as Model<AirportRecord> | undefined) ??
  mongoose.model<AirportRecord>("Airport", airportSchema);
