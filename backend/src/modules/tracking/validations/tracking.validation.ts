
import { z } from "zod";

import {
  FLIGHT_POSITION_SOURCES,
  FLIGHT_TRACKING_STATUSES,
} from "../models/flight-position.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const flightNumberSchema = z
  .string()
  .trim()
  .min(2, "Flight number is required.")
  .max(20, "Flight number cannot exceed 20 characters.")
  .transform((value) => value.toUpperCase());

const airportCodeSchema = z
  .string()
  .trim()
  .min(2, "Airport code must contain at least 2 characters.")
  .max(10, "Airport code cannot exceed 10 characters.")
  .transform((value) => value.toUpperCase());

const dateSchema = z.coerce.date();

const latitudeSchema = z.coerce
  .number()
  .min(-90, "Latitude cannot be below -90.")
  .max(90, "Latitude cannot exceed 90.");

const longitudeSchema = z.coerce
  .number()
  .min(-180, "Longitude cannot be below -180.")
  .max(180, "Longitude cannot exceed 180.");

const nullableNonNegativeNumberSchema = z.coerce
  .number()
  .min(0, "Value cannot be negative.")
  .nullable();

const headingSchema = z.coerce
  .number()
  .min(0, "Heading cannot be below 0.")
  .max(360, "Heading cannot exceed 360.")
  .nullable();

export const trackingFlightLookupSchema = z
  .object({
    params: z
      .object({
        flightId: objectIdSchema.optional(),
        flightNumber: flightNumberSchema.optional(),
      })
      .refine(
        (value) => Boolean(value.flightId || value.flightNumber),
        "Provide a flight ID or flight number.",
      ),
  })
  .strict();

export const createFlightTrackingSchema = z
  .object({
    body: z
      .object({
        flightId: objectIdSchema,
        flightNumber: flightNumberSchema,
        departureAirport: airportCodeSchema,
        arrivalAirport: airportCodeSchema,
        scheduledDeparture: dateSchema,
        scheduledArrival: dateSchema,
      })
      .strict()
      .refine(
        (value) =>
          value.scheduledArrival > value.scheduledDeparture,
        {
          message:
            "Scheduled arrival must be after scheduled departure.",
          path: ["scheduledArrival"],
        },
      ),
  })
  .strict();

export const updateFlightPositionSchema = z
  .object({
    params: z.object({
      flightId: objectIdSchema,
    }),
    body: z
      .object({
        latitude: latitudeSchema,
        longitude: longitudeSchema,
        altitude: nullableNonNegativeNumberSchema.optional(),
        speed: nullableNonNegativeNumberSchema.optional(),
        heading: headingSchema.optional(),
        source: z.enum(FLIGHT_POSITION_SOURCES).optional(),
        recordedAt: dateSchema.optional(),
      })
      .strict(),
  })
  .strict();

export const updateFlightTrackingStatusSchema = z
  .object({
    params: z.object({
      flightId: objectIdSchema,
    }),
    body: z
      .object({
        status: z.enum(FLIGHT_TRACKING_STATUSES),
        description: z
          .string()
          .trim()
          .min(1, "Event description is required.")
          .max(500),
        location: z.string().trim().max(200).nullable().optional(),
        timestamp: dateSchema.optional(),
        estimatedDeparture: dateSchema.nullable().optional(),
        estimatedArrival: dateSchema.nullable().optional(),
        actualDeparture: dateSchema.nullable().optional(),
        actualArrival: dateSchema.nullable().optional(),
      })
      .strict(),
  })
  .strict();

export const trackingListQuerySchema = z
  .object({
    query: z
      .object({
        status: z.enum(FLIGHT_TRACKING_STATUSES).optional(),
        flightNumber: flightNumberSchema.optional(),
        departureAirport: airportCodeSchema.optional(),
        arrivalAirport: airportCodeSchema.optional(),
        departureFrom: dateSchema.optional(),
        departureTo: dateSchema.optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
      })
      .strict()
      .refine(
        (value) =>
          !value.departureFrom ||
          !value.departureTo ||
          value.departureFrom <= value.departureTo,
        {
          message:
            "departureFrom must be before or equal to departureTo.",
          path: ["departureTo"],
        },
      ),
  })
  .strict();

export const trackingHistoryParamsSchema = z
  .object({
    params: z.object({
      flightId: objectIdSchema,
    }),
  })
  .strict();

export type TrackingFlightLookupValidated = z.infer<
  typeof trackingFlightLookupSchema
>;

export type CreateFlightTrackingValidated = z.infer<
  typeof createFlightTrackingSchema
>;

export type UpdateFlightPositionValidated = z.infer<
  typeof updateFlightPositionSchema
>;

export type UpdateFlightTrackingStatusValidated = z.infer<
  typeof updateFlightTrackingStatusSchema
>;

export type TrackingListQueryValidated = z.infer<
  typeof trackingListQuerySchema
>;

export type TrackingHistoryParamsValidated = z.infer<
  typeof trackingHistoryParamsSchema
>;
