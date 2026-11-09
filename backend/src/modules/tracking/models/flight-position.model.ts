
import mongoose, {
  model,
  Schema,
  Types,
  type HydratedDocument,
  type Model,
} from "mongoose";

export const FLIGHT_POSITION_SOURCES = [
  "manual",
  "automatic",
  "provider",
] as const;

export type FlightPositionSource =
  (typeof FLIGHT_POSITION_SOURCES)[number];

export const FLIGHT_TRACKING_STATUSES = [
  "scheduled",
  "boarding",
  "departed",
  "in_flight",
  "landed",
  "delayed",
  "cancelled",
  "diverted",
] as const;

export type FlightTrackingStatus =
  (typeof FLIGHT_TRACKING_STATUSES)[number];

export interface FlightPositionCoordinates {
  latitude: number;
  longitude: number;
}

export interface FlightTrackingEvent {
  status: FlightTrackingStatus;
  description: string;
  location?: string | null;
  timestamp: Date;
}

export interface FlightPosition {
  flightId: Types.ObjectId;
  flightNumber: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  source: FlightPositionSource;
  recordedAt: Date;
  status: FlightTrackingStatus;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  estimatedDeparture: Date | null;
  estimatedArrival: Date | null;
  actualDeparture: Date | null;
  actualArrival: Date | null;
  events: FlightTrackingEvent[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type FlightPositionDocument =
  HydratedDocument<FlightPosition>;

const trackingEventSchema = new Schema<FlightTrackingEvent>(
  {
    status: {
      type: String,
      enum: FLIGHT_TRACKING_STATUSES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

const flightPositionSchema = new Schema<FlightPosition>(
  {
    flightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },
    altitude: {
      type: Number,
      min: 0,
      default: null,
    },
    speed: {
      type: Number,
      min: 0,
      default: null,
    },
    heading: {
      type: Number,
      min: 0,
      max: 360,
      default: null,
    },
    source: {
      type: String,
      enum: FLIGHT_POSITION_SOURCES,
      required: true,
      default: "automatic",
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: FLIGHT_TRACKING_STATUSES,
      required: true,
      default: "scheduled",
      index: true,
    },
    departureAirport: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 10,
    },
    arrivalAirport: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 10,
    },
    scheduledDeparture: {
      type: Date,
      required: true,
    },
    scheduledArrival: {
      type: Date,
      required: true,
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
    events: {
      type: [trackingEventSchema],
      default: [],
    },
    lastUpdated: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "flight_positions",
  },
);

flightPositionSchema.index({
  flightId: 1,
  recordedAt: -1,
});

flightPositionSchema.index({
  flightNumber: 1,
  recordedAt: -1,
});

flightPositionSchema.index({
  status: 1,
  scheduledDeparture: 1,
});

flightPositionSchema.index(
  { flightId: 1 },
  { unique: true },
);

export const FlightPositionModel: Model<FlightPosition> =
  (mongoose.models.FlightPosition as
    | Model<FlightPosition>
    | undefined) ??
  model<FlightPosition>(
    "FlightPosition",
    flightPositionSchema,
  );
