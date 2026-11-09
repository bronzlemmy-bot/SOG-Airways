
import { z } from "zod";
import {
  TRIP_STATUSES,
  TRIP_TYPES,
} from "../models/trip.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "A valid MongoDB ObjectId is required.");

const tripReferenceSchema = z
  .string()
  .trim()
  .min(3, "Trip reference must contain at least 3 characters.")
  .max(40, "Trip reference cannot exceed 40 characters.")
  .transform((value) => value.toUpperCase());

const dateSchema = z.coerce.date();

const nullableDateSchema = z.union([
  z.null(),
  z.coerce.date(),
]);

const optionalNullableDateSchema = nullableDateSchema.optional();

const nonNegativeAmountSchema = z
  .number()
  .finite("Amount must be a finite number.")
  .min(0, "Amount cannot be negative.");

const currencySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, "Currency must be a three-letter currency code.")
  .transform((value) => value.toUpperCase());

const tripStatusSchema = z.enum(TRIP_STATUSES);
const tripTypeSchema = z.enum(TRIP_TYPES);

const createTripObjectSchema = z
  .object({
    customer: objectIdSchema,
    booking: objectIdSchema.nullable().optional(),
    tripReference: tripReferenceSchema.optional(),
    title: z.string().trim().max(150).nullable().optional(),
    tripType: tripTypeSchema,
    status: tripStatusSchema.optional(),
    originAirport: objectIdSchema,
    destinationAirport: objectIdSchema,
    departureDate: dateSchema,
    returnDate: optionalNullableDateSchema,
    passengerCount: z.coerce.number().int().min(1).max(9).optional(),
    currency: currencySchema.optional(),
    estimatedBudget: nonNegativeAmountSchema.nullable().optional(),
    actualCost: nonNegativeAmountSchema.nullable().optional(),
    notes: z.string().trim().max(3000).nullable().optional(),
    completedAt: optionalNullableDateSchema,
    cancelledAt: optionalNullableDateSchema,
    cancellationReason: z.string().trim().max(500).nullable().optional(),
  })
  .strict()
  .superRefine((data, context) => {
    if (
      data.returnDate instanceof Date &&
      data.returnDate.getTime() < data.departureDate.getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["returnDate"],
        message: "Return date cannot be earlier than departure date.",
      });
    }

    if (data.tripType === "round_trip" && !data.returnDate) {
      context.addIssue({
        code: "custom",
        path: ["returnDate"],
        message: "A return date is required for a round-trip.",
      });
    }

    if (data.tripType === "one_way" && data.returnDate) {
      context.addIssue({
        code: "custom",
        path: ["returnDate"],
        message: "A one-way trip cannot have a return date.",
      });
    }

    if (
      data.status === "completed" &&
      data.cancelledAt
    ) {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "A cancelled trip cannot be marked as completed.",
      });
    }

    if (
      data.status === "cancelled" &&
      data.completedAt
    ) {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "A completed trip cannot be marked as cancelled.",
      });
    }

    if (
      data.estimatedBudget != null &&
      data.actualCost != null &&
      !Number.isFinite(data.estimatedBudget + data.actualCost)
    ) {
      context.addIssue({
        code: "custom",
        path: ["actualCost"],
        message: "The supplied cost values are invalid.",
      });
    }
  });

export const createTripSchema = createTripObjectSchema;

const updateTripObjectSchema = z
  .object({
    booking: objectIdSchema.nullable().optional(),
    title: z.string().trim().max(150).nullable().optional(),
    tripType: tripTypeSchema.optional(),
    status: tripStatusSchema.optional(),
    originAirport: objectIdSchema.optional(),
    destinationAirport: objectIdSchema.optional(),
    departureDate: dateSchema.optional(),
    returnDate: optionalNullableDateSchema,
    passengerCount: z.coerce.number().int().min(1).max(9).optional(),
    currency: currencySchema.optional(),
    estimatedBudget: nonNegativeAmountSchema.nullable().optional(),
    actualCost: nonNegativeAmountSchema.nullable().optional(),
    notes: z.string().trim().max(3000).nullable().optional(),
    completedAt: optionalNullableDateSchema,
    cancelledAt: optionalNullableDateSchema,
    cancellationReason: z.string().trim().max(500).nullable().optional(),
  })
  .strict()
  .superRefine((data, context) => {
    if (Object.keys(data).length === 0) {
      context.addIssue({
        code: "custom",
        message: "At least one field must be supplied for an update.",
      });
    }

    if (
      data.departureDate instanceof Date &&
      data.returnDate instanceof Date &&
      data.returnDate.getTime() < data.departureDate.getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["returnDate"],
        message: "Return date cannot be earlier than departure date.",
      });
    }

    if (data.tripType === "round_trip" && data.returnDate === null) {
      context.addIssue({
        code: "custom",
        path: ["returnDate"],
        message: "A round-trip must have a return date.",
      });
    }

    if (data.tripType === "one_way" && data.returnDate instanceof Date) {
      context.addIssue({
        code: "custom",
        path: ["returnDate"],
        message: "A one-way trip cannot have a return date.",
      });
    }

    if (data.status === "completed" && data.cancelledAt instanceof Date) {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "A cancelled trip cannot be marked as completed.",
      });
    }

    if (data.status === "cancelled" && data.completedAt instanceof Date) {
      context.addIssue({
        code: "custom",
        path: ["status"],
        message: "A completed trip cannot be marked as cancelled.",
      });
    }
  });

export const updateTripSchema = updateTripObjectSchema;

export const tripIdParamsSchema = z
  .object({
    tripId: objectIdSchema,
  })
  .strict();

export const tripReferenceParamsSchema = z
  .object({
    tripReference: tripReferenceSchema,
  })
  .strict();

export const tripBookingParamsSchema = z
  .object({
    bookingId: objectIdSchema,
  })
  .strict();

const tripFilterFields = {
  customer: objectIdSchema.optional(),
  booking: objectIdSchema.optional(),
  tripReference: tripReferenceSchema.optional(),
  tripType: tripTypeSchema.optional(),
  status: tripStatusSchema.optional(),
  originAirport: objectIdSchema.optional(),
  destinationAirport: objectIdSchema.optional(),
  departureFrom: dateSchema.optional(),
  departureTo: dateSchema.optional(),
  returnFrom: dateSchema.optional(),
  returnTo: dateSchema.optional(),
  search: z.string().trim().max(200).optional(),
  minBudget: z.coerce.number().finite().min(0).optional(),
  maxBudget: z.coerce.number().finite().min(0).optional(),
};

const tripDateRangeRefinement = <
  T extends {
    departureFrom?: Date;
    departureTo?: Date;
    returnFrom?: Date;
    returnTo?: Date;
    minBudget?: number;
    maxBudget?: number;
  },
>(
  data: T,
  context: z.RefinementCtx,
) => {
  if (
    data.departureFrom &&
    data.departureTo &&
    data.departureFrom.getTime() > data.departureTo.getTime()
  ) {
    context.addIssue({
      code: "custom",
      path: ["departureTo"],
      message: "Departure end date must not be earlier than the start date.",
    });
  }

  if (
    data.returnFrom &&
    data.returnTo &&
    data.returnFrom.getTime() > data.returnTo.getTime()
  ) {
    context.addIssue({
      code: "custom",
      path: ["returnTo"],
      message: "Return end date must not be earlier than the start date.",
    });
  }

  if (
    data.minBudget !== undefined &&
    data.maxBudget !== undefined &&
    data.minBudget > data.maxBudget
  ) {
    context.addIssue({
      code: "custom",
      path: ["maxBudget"],
      message: "Maximum budget must be greater than or equal to minimum budget.",
    });
  }
};

export const tripListQuerySchema = z
  .object({
    ...tripFilterFields,
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum([
        "tripReference",
        "departureDate",
        "returnDate",
        "status",
        "tripType",
        "passengerCount",
        "estimatedBudget",
        "actualCost",
        "createdAt",
        "updatedAt",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
  .superRefine(tripDateRangeRefinement);

export const tripCountQuerySchema = z
  .object({
    ...tripFilterFields,
  })
  .strict()
  .superRefine(tripDateRangeRefinement);

export const cancelTripSchema = z
  .object({
    reason: z
      .string()
      .trim()
      .min(1, "A cancellation reason is required.")
      .max(500, "Cancellation reason cannot exceed 500 characters."),
  })
  .strict();

export type CreateTripValidatedInput = z.infer<typeof createTripSchema>;
export type UpdateTripValidatedInput = z.infer<typeof updateTripSchema>;
export type TripIdParams = z.infer<typeof tripIdParamsSchema>;
export type TripReferenceParams = z.infer<typeof tripReferenceParamsSchema>;
export type TripBookingParams = z.infer<typeof tripBookingParamsSchema>;
export type TripListValidatedQuery = z.infer<typeof tripListQuerySchema>;
export type TripCountValidatedQuery = z.infer<typeof tripCountQuerySchema>;
export type CancelTripValidatedInput = z.infer<typeof cancelTripSchema>;
