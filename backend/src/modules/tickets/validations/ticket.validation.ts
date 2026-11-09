
import { z } from "zod";

import {
  TICKET_CLASSES,
  TICKET_STATUSES,
} from "../models/ticket.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "A valid MongoDB ID is required.");

const ticketNumberSchema = z
  .string()
  .trim()
  .min(3, "Ticket number must contain at least 3 characters.")
  .max(40, "Ticket number cannot exceed 40 characters.")
  .transform((value) => value.toUpperCase());

const currencySchema = z
  .string()
  .trim()
  .length(3, "Currency must be a three-letter currency code.")
  .regex(/^[a-zA-Z]{3}$/, "Currency must contain only letters.")
  .transform((value) => value.toUpperCase());

const optionalTextSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Text cannot exceed ${maxLength} characters.`)
    .nullable()
    .optional();

const optionalDateSchema = z.coerce.date().nullable().optional();

const ticketClassSchema = z.enum(TICKET_CLASSES);
const ticketStatusSchema = z.enum(TICKET_STATUSES);

const fareAmountSchema = z
  .number()
  .finite("Fare amount must be finite.")
  .min(0, "Fare amount cannot be negative.");

const dateRangeRefinement = (
  data: { issuedFrom?: Date; issuedTo?: Date },
  context: z.RefinementCtx,
) => {
  if (
    data.issuedFrom &&
    data.issuedTo &&
    data.issuedFrom.getTime() > data.issuedTo.getTime()
  ) {
    context.addIssue({
      code: "custom",
      path: ["issuedTo"],
      message: "End date cannot be earlier than start date.",
    });
  }
};

const fareRangeRefinement = (
  data: { minFare?: number; maxFare?: number },
  context: z.RefinementCtx,
) => {
  if (
    data.minFare !== undefined &&
    data.maxFare !== undefined &&
    data.minFare > data.maxFare
  ) {
    context.addIssue({
      code: "custom",
      path: ["maxFare"],
      message: "Maximum fare cannot be less than minimum fare.",
    });
  }
};

/**
 * Create ticket
 */
export const createTicketSchema = z
  .object({
    ticketNumber: ticketNumberSchema.optional(),
    booking: objectIdSchema,
    payment: objectIdSchema,
    customer: objectIdSchema,
    passenger: objectIdSchema,
    flight: objectIdSchema,
    ticketClass: ticketClassSchema,
    status: ticketStatusSchema.optional(),
    issuedAt: z.coerce.date().optional(),
    cancelledAt: optionalDateSchema,
    cancellationReason: optionalTextSchema(500),
    checkedInAt: optionalDateSchema,
    usedAt: optionalDateSchema,
    seatNumber: optionalTextSchema(10),
    fareAmount: fareAmountSchema,
    currency: currencySchema.optional(),
    notes: optionalTextSchema(2000),
  })
  .strict();

/**
 * Update ticket
 */
export const updateTicketSchema = z
  .object({
    status: ticketStatusSchema.optional(),
    cancelledAt: optionalDateSchema,
    cancellationReason: optionalTextSchema(500),
    checkedInAt: optionalDateSchema,
    usedAt: optionalDateSchema,
    seatNumber: optionalTextSchema(10),
    notes: optionalTextSchema(2000),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided to update a ticket.",
  });

/**
 * Ticket route parameters
 */
export const ticketIdParamsSchema = z
  .object({
    ticketId: objectIdSchema,
  })
  .strict();

export const ticketNumberParamsSchema = z
  .object({
    ticketNumber: ticketNumberSchema,
  })
  .strict();

export const ticketBookingParamsSchema = z
  .object({
    bookingId: objectIdSchema,
  })
  .strict();

export const ticketPaymentParamsSchema = z
  .object({
    paymentId: objectIdSchema,
  })
  .strict();

export const ticketFlightParamsSchema = z
  .object({
    flightId: objectIdSchema,
  })
  .strict();

/**
 * Ticket list query
 */
export const ticketListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum([
        "ticketNumber",
        "fareAmount",
        "status",
        "issuedAt",
        "createdAt",
        "updatedAt",
      ])
      .default("issuedAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().trim().max(100).optional(),
    ticketNumber: ticketNumberSchema.optional(),
    booking: objectIdSchema.optional(),
    payment: objectIdSchema.optional(),
    customer: objectIdSchema.optional(),
    passenger: objectIdSchema.optional(),
    flight: objectIdSchema.optional(),
    ticketClass: ticketClassSchema.optional(),
    status: ticketStatusSchema.optional(),
    currency: currencySchema.optional(),
    issuedFrom: z.coerce.date().optional(),
    issuedTo: z.coerce.date().optional(),
    minFare: z.coerce.number().finite().min(0).optional(),
    maxFare: z.coerce.number().finite().min(0).optional(),
  })
  .strict()
  .superRefine((data, context) => {
    dateRangeRefinement(data, context);
    fareRangeRefinement(data, context);
  });

/**
 * Ticket count query
 */
export const ticketCountQuerySchema = z
  .object({
    booking: objectIdSchema.optional(),
    payment: objectIdSchema.optional(),
    customer: objectIdSchema.optional(),
    passenger: objectIdSchema.optional(),
    flight: objectIdSchema.optional(),
    ticketClass: ticketClassSchema.optional(),
    status: ticketStatusSchema.optional(),
    currency: currencySchema.optional(),
    issuedFrom: z.coerce.date().optional(),
    issuedTo: z.coerce.date().optional(),
    minFare: z.coerce.number().finite().min(0).optional(),
    maxFare: z.coerce.number().finite().min(0).optional(),
  })
  .strict()
  .superRefine((data, context) => {
    dateRangeRefinement(data, context);
    fareRangeRefinement(data, context);
  });

/**
 * Ticket cancellation
 */
export const cancelTicketSchema = z
  .object({
    reason: z
      .string()
      .trim()
      .min(3, "Cancellation reason must contain at least 3 characters.")
      .max(500, "Cancellation reason cannot exceed 500 characters."),
  })
  .strict();

/**
 * Inferred validated input types
 */
export type CreateTicketValidatedInput = z.infer<
  typeof createTicketSchema
>;

export type UpdateTicketValidatedInput = z.infer<
  typeof updateTicketSchema
>;

export type TicketIdParamsValidated = z.infer<
  typeof ticketIdParamsSchema
>;

export type TicketNumberParamsValidated = z.infer<
  typeof ticketNumberParamsSchema
>;

export type TicketBookingParamsValidated = z.infer<
  typeof ticketBookingParamsSchema
>;

export type TicketPaymentParamsValidated = z.infer<
  typeof ticketPaymentParamsSchema
>;

export type TicketFlightParamsValidated = z.infer<
  typeof ticketFlightParamsSchema
>;

export type TicketListValidatedQuery = z.infer<
  typeof ticketListQuerySchema
>;

export type TicketCountValidatedQuery = z.infer<
  typeof ticketCountQuerySchema
>;

export type CancelTicketValidatedInput = z.infer<
  typeof cancelTicketSchema
>;
