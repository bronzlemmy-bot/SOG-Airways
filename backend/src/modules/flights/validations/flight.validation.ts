
import { z } from "zod";

import { FLIGHT_STATUSES } from "../models/flight.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const flightNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(2, "Flight number must contain at least 2 characters.")
  .max(20, "Flight number cannot exceed 20 characters.");

const optionalTextSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Cannot exceed ${maxLength} characters.`)
    .optional();

const nullableTextSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Cannot exceed ${maxLength} characters.`)
    .nullable()
    .optional();

const dateSchema = z.coerce.date({
  error: "A valid date is required.",
});

const nullableDateSchema = z
  .union([dateSchema, z.null()])
  .optional();

const positiveIntegerSchema = z
  .number()
  .int("Must be a whole number.")
  .positive("Must be greater than zero.");

const fareAmountSchema = z
  .number()
  .finite()
  .min(0)
  .refine(
    (value) => Math.round(value * 100) / 100 === value,
    "Fare amounts must have at most two decimal places.",
  );

const fareOptionSchema = z
  .object({
    baseFare: fareAmountSchema,
    taxes: fareAmountSchema.default(0),
    fees: fareAmountSchema.default(0),
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{3}$/, "Currency must be a three-letter code.")
      .default("USD"),
  })
  .strict();

const fareScheduleSchema = z
  .object({
    economy: fareOptionSchema.optional(),
    premium_economy: fareOptionSchema.optional(),
    business: fareOptionSchema.optional(),
    first: fareOptionSchema.optional(),
  })
  .strict()
  .refine(
    (schedule) => Object.values(schedule).some((fare) => fare !== undefined),
    "At least one cabin fare must be configured.",
  );

const flightDateRules = {
  scheduledArrival: z.coerce.date().optional(),
  scheduledDeparture: z.coerce.date().optional(),
};

export const createFlightSchema = z
  .object({
    flightNumber: flightNumberSchema,
    aircraft: objectIdSchema,
    departureAirport: objectIdSchema,
    arrivalAirport: objectIdSchema,
    scheduledDeparture: dateSchema,
    scheduledArrival: dateSchema,
    estimatedDeparture: nullableDateSchema,
    estimatedArrival: nullableDateSchema,
    actualDeparture: nullableDateSchema,
    actualArrival: nullableDateSchema,
    status: z.enum(FLIGHT_STATUSES).optional(),
    departureTerminal: optionalTextSchema(50),
    departureGate: optionalTextSchema(20).transform((value) =>
      value?.toUpperCase(),
    ),
    arrivalTerminal: optionalTextSchema(50),
    arrivalGate: optionalTextSchema(20).transform((value) =>
      value?.toUpperCase(),
    ),
    durationMinutes: positiveIntegerSchema,
    distanceKilometers: z.number().positive().optional(),
    fareSchedule: fareScheduleSchema.optional(),
    notes: optionalTextSchema(2000),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.departureAirport === data.arrivalAirport) {
      context.addIssue({
        code: "custom",
        path: ["arrivalAirport"],
        message: "Departure and arrival airports must be different.",
      });
    }

    if (data.scheduledArrival <= data.scheduledDeparture) {
      context.addIssue({
        code: "custom",
        path: ["scheduledArrival"],
        message: "Scheduled arrival must be later than scheduled departure.",
      });
    }

    if (
      data.actualDeparture &&
      data.actualArrival &&
      data.actualArrival < data.actualDeparture
    ) {
      context.addIssue({
        code: "custom",
        path: ["actualArrival"],
        message: "Actual arrival cannot be earlier than actual departure.",
      });
    }
  });

export const updateFlightSchema = z
  .object({
    flightNumber: flightNumberSchema.optional(),
    aircraft: objectIdSchema.optional(),
    departureAirport: objectIdSchema.optional(),
    arrivalAirport: objectIdSchema.optional(),
    scheduledDeparture: dateSchema.optional(),
    scheduledArrival: dateSchema.optional(),
    estimatedDeparture: nullableDateSchema,
    estimatedArrival: nullableDateSchema,
    actualDeparture: nullableDateSchema,
    actualArrival: nullableDateSchema,
    status: z.enum(FLIGHT_STATUSES).optional(),
    departureTerminal: nullableTextSchema(50),
    departureGate: nullableTextSchema(20).transform((value) =>
      value == null ? value : value.toUpperCase(),
    ),
    arrivalTerminal: nullableTextSchema(50),
    arrivalGate: nullableTextSchema(20).transform((value) =>
      value == null ? value : value.toUpperCase(),
    ),
    durationMinutes: positiveIntegerSchema.optional(),
    distanceKilometers: z.number().positive().nullable().optional(),
    fareSchedule: z.union([fareScheduleSchema, z.null()]).optional(),
    notes: nullableTextSchema(2000),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided for an update." },
  );

export const flightIdParamSchema = z.object({
  id: objectIdSchema,
});

export const flightNumberParamSchema = z.object({
  flightNumber: flightNumberSchema,
});

const optionalDateFilter = z
  .union([dateSchema, z.undefined()])
  .optional();

export const flightProfileQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    flightNumber: z.string().trim().optional(),
    aircraft: objectIdSchema.optional(),
    departureAirport: objectIdSchema.optional(),
    arrivalAirport: objectIdSchema.optional(),
    status: z.enum(FLIGHT_STATUSES).optional(),
    departureFrom: optionalDateFilter,
    departureTo: optionalDateFilter,
    arrivalFrom: optionalDateFilter,
    arrivalTo: optionalDateFilter,
    sortBy: z
      .enum([
        "flightNumber",
        "scheduledDeparture",
        "scheduledArrival",
        "status",
        "createdAt",
      ])
      .default("scheduledDeparture"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  })
  .strict()
  .superRefine((data, context) => {
    if (
      data.departureFrom &&
      data.departureTo &&
      data.departureFrom > data.departureTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["departureTo"],
        message: "Departure end date must be on or after the start date.",
      });
    }

    if (
      data.arrivalFrom &&
      data.arrivalTo &&
      data.arrivalFrom > data.arrivalTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["arrivalTo"],
        message: "Arrival end date must be on or after the start date.",
      });
    }
  });

export const flightCountQuerySchema = z
  .object({
    status: z.enum(FLIGHT_STATUSES).optional(),
    departureFrom: optionalDateFilter,
    departureTo: optionalDateFilter,
  })
  .strict();

export type CreateFlightValidationInput = z.infer<
  typeof createFlightSchema
>;

export type UpdateFlightValidationInput = z.infer<
  typeof updateFlightSchema
>;

export type FlightIdParams = z.infer<typeof flightIdParamSchema>;

export type FlightNumberParams = z.infer<
  typeof flightNumberParamSchema
>;

export type FlightProfileQuery = z.infer<
  typeof flightProfileQuerySchema
>;

export type FlightCountQuery = z.infer<
  typeof flightCountQuerySchema
>;
