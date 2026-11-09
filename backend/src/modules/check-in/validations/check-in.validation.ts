
import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "A valid MongoDB ID is required.");

const checkInStatusSchema = z.enum([
  "pending",
  "checked_in",
  "cancelled",
]);

const boardingPassStatusSchema = z.enum([
  "not_issued",
  "issued",
  "used",
  "voided",
]);

const optionalTextSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Text cannot exceed ${maxLength} characters.`)
    .nullable()
    .optional();

const seatNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, "Seat number cannot be empty.")
  .max(10, "Seat number cannot exceed 10 characters.")
  .nullable()
  .optional();

const baggageCountSchema = z.coerce
  .number()
  .int("Baggage count must be a whole number.")
  .min(0, "Baggage count cannot be negative.")
  .max(20, "Baggage count cannot exceed 20.");

const baggageWeightSchema = z.coerce
  .number()
  .finite("Baggage weight must be a finite number.")
  .min(0, "Baggage weight cannot be negative.")
  .max(200, "Baggage weight cannot exceed 200 kg.");

const dateRangeRefinement = (
  data: { createdFrom?: Date; createdTo?: Date },
  context: z.RefinementCtx,
) => {
  if (
    data.createdFrom &&
    data.createdTo &&
    data.createdFrom.getTime() > data.createdTo.getTime()
  ) {
    context.addIssue({
      code: "custom",
      path: ["createdTo"],
      message: "End date cannot be earlier than start date.",
    });
  }
};

export const createCheckInSchema = z
  .object({
    booking: objectIdSchema,
    ticket: objectIdSchema,
    passenger: objectIdSchema,
    flight: objectIdSchema,
    customer: objectIdSchema,
    status: checkInStatusSchema.optional(),
    boardingPassStatus: boardingPassStatusSchema.optional(),
    checkInReference: z
      .string()
      .trim()
      .min(3)
      .max(40)
      .transform((value) => value.toUpperCase())
      .optional(),
    seatNumber: seatNumberSchema,
    checkedInAt: z.coerce.date().nullable().optional(),
    cancelledAt: z.coerce.date().nullable().optional(),
    cancellationReason: optionalTextSchema(500),
    boardingPassIssuedAt: z.coerce.date().nullable().optional(),
    boardingPassUsedAt: z.coerce.date().nullable().optional(),
    baggageCount: baggageCountSchema.optional(),
    baggageWeightKg: baggageWeightSchema.optional(),
    specialAssistanceRequired: z.boolean().optional(),
    notes: optionalTextSchema(2000),
  })
  .strict();

export const updateCheckInSchema = z
  .object({
    status: checkInStatusSchema.optional(),
    boardingPassStatus: boardingPassStatusSchema.optional(),
    seatNumber: seatNumberSchema,
    checkedInAt: z.coerce.date().nullable().optional(),
    cancelledAt: z.coerce.date().nullable().optional(),
    cancellationReason: optionalTextSchema(500),
    boardingPassIssuedAt: z.coerce.date().nullable().optional(),
    boardingPassUsedAt: z.coerce.date().nullable().optional(),
    baggageCount: baggageCountSchema.optional(),
    baggageWeightKg: baggageWeightSchema.optional(),
    specialAssistanceRequired: z.boolean().optional(),
    notes: optionalTextSchema(2000),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be provided to update a check-in.",
    },
  );

export const checkInIdParamsSchema = z
  .object({
    checkInId: objectIdSchema,
  })
  .strict();

export const bookingIdParamsSchema = z
  .object({
    bookingId: objectIdSchema,
  })
  .strict();

export const ticketIdParamsSchema = z
  .object({
    ticketId: objectIdSchema,
  })
  .strict();

export const passengerIdParamsSchema = z
  .object({
    passengerId: objectIdSchema,
  })
  .strict();

export const flightIdParamsSchema = z
  .object({
    flightId: objectIdSchema,
  })
  .strict();

export const checkInReferenceParamsSchema = z
  .object({
    checkInReference: z.string().trim().min(3).max(40),
  })
  .strict();

export const checkInListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum([
        "createdAt",
        "updatedAt",
        "checkedInAt",
        "seatNumber",
        "status",
        "checkInReference",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().trim().max(100).optional(),
    booking: objectIdSchema.optional(),
    ticket: objectIdSchema.optional(),
    passenger: objectIdSchema.optional(),
    flight: objectIdSchema.optional(),
    customer: objectIdSchema.optional(),
    status: checkInStatusSchema.optional(),
    boardingPassStatus: boardingPassStatusSchema.optional(),
    checkInReference: z.string().trim().max(40).optional(),
    seatNumber: z.string().trim().max(10).optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
  })
  .strict()
  .superRefine(dateRangeRefinement);

export const checkInCountQuerySchema = z
  .object({
    booking: objectIdSchema.optional(),
    ticket: objectIdSchema.optional(),
    passenger: objectIdSchema.optional(),
    flight: objectIdSchema.optional(),
    customer: objectIdSchema.optional(),
    status: checkInStatusSchema.optional(),
    boardingPassStatus: boardingPassStatusSchema.optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
  })
  .strict()
  .superRefine(dateRangeRefinement);

export const cancelCheckInSchema = z
  .object({
    reason: z
      .string()
      .trim()
      .min(3, "Cancellation reason must contain at least 3 characters.")
      .max(500, "Cancellation reason cannot exceed 500 characters."),
  })
  .strict();

export type CreateCheckInValidatedInput = z.infer<
  typeof createCheckInSchema
>;

export type UpdateCheckInValidatedInput = z.infer<
  typeof updateCheckInSchema
>;

export type CheckInIdParamsValidated = z.infer<
  typeof checkInIdParamsSchema
>;

export type CheckInListValidatedQuery = z.infer<
  typeof checkInListQuerySchema
>;

export type CheckInCountValidatedQuery = z.infer<
  typeof checkInCountQuerySchema
>;

export type CancelCheckInValidatedInput = z.infer<
  typeof cancelCheckInSchema
>;
