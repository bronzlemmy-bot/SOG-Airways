
import { z } from "zod";

import {
  BOOKING_CLASSES,
  BOOKING_PAYMENT_STATUSES,
  BOOKING_STATUSES,
} from "../models/booking.model.js";
import { bookingPassengerSchema } from "../../passengers/validations/passenger.validation.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const bookingReferenceSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(5, "Booking reference must contain at least 5 characters.")
  .max(30, "Booking reference cannot exceed 30 characters.")
  .regex(
    /^[A-Z0-9-]+$/,
    "Booking reference may contain only letters, numbers, and hyphens.",
  );

const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(3, "Currency must be a three-letter currency code.")
  .regex(/^[A-Z]{3}$/, "Currency must contain three letters.");

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

const nonNegativeAmountSchema = z
  .number()
  .finite("Amount must be a finite number.")
  .min(0, "Amount cannot be negative.");

const passengerCountSchema = z
  .number()
  .int("Passenger count must be a whole number.")
  .min(1, "A booking must have at least one passenger.")
  .max(9, "A booking cannot exceed nine passengers.");

const passengerIdsSchema = z
  .array(objectIdSchema)
  .max(9, "A booking cannot contain more than nine passenger records.")
  .refine(
    (passengerIds) => new Set(passengerIds).size === passengerIds.length,
    "Duplicate passenger IDs are not allowed.",
  );

export const createBookingSchema = z
  .object({
    bookingReference: bookingReferenceSchema.optional(),
    customer: objectIdSchema,
    flight: objectIdSchema,
    passengers: passengerIdsSchema.optional(),
    passengerCount: passengerCountSchema,
    bookingClass: z.enum(BOOKING_CLASSES).optional(),
    status: z.enum(BOOKING_STATUSES).optional(),
    paymentStatus: z.enum(BOOKING_PAYMENT_STATUSES).optional(),
    currency: currencySchema.optional(),
    baseFare: nonNegativeAmountSchema,
    taxes: nonNegativeAmountSchema.optional(),
    fees: nonNegativeAmountSchema.optional(),
    discount: nonNegativeAmountSchema.optional(),
    totalAmount: nonNegativeAmountSchema.optional(),
    expiresAt: nullableDateSchema,
    notes: optionalTextSchema(2000),
  })
  .strict()
  .superRefine((data, context) => {
    if (
      data.passengers &&
      data.passengers.length > data.passengerCount
    ) {
      context.addIssue({
        code: "custom",
        path: ["passengers"],
        message:
          "Passenger records cannot exceed the booking passenger count.",
      });
    }

    const taxes = data.taxes ?? 0;
    const fees = data.fees ?? 0;
    const discount = data.discount ?? 0;
    const expectedTotal = data.baseFare + taxes + fees - discount;

    if (expectedTotal < 0) {
      context.addIssue({
        code: "custom",
        path: ["discount"],
        message:
          "Discount cannot exceed the base fare, taxes, and fees combined.",
      });
    }

    if (
      data.totalAmount !== undefined &&
      Math.abs(data.totalAmount - expectedTotal) > 0.01
    ) {
      context.addIssue({
        code: "custom",
        path: ["totalAmount"],
        message:
          "Total amount must equal base fare plus taxes and fees, minus discount.",
      });
    }
  });

export const createCustomerBookingSchema = z
  .object({
    flightId: objectIdSchema,
    bookingClass: z.enum(BOOKING_CLASSES),
    passengers: z
      .array(bookingPassengerSchema)
      .min(1, "At least one passenger is required.")
      .max(9, "A booking cannot exceed nine passengers."),
    idempotencyKey: z
      .string()
      .trim()
      .min(16)
      .max(200)
      .regex(
        /^[A-Za-z0-9._:-]+$/,
        "The idempotency key contains invalid characters.",
      ),
  })
  .strict();

export const updateBookingSchema = z
  .object({
    customer: objectIdSchema.optional(),
    flight: objectIdSchema.optional(),
    passengers: passengerIdsSchema.optional(),
    passengerCount: passengerCountSchema.optional(),
    bookingClass: z.enum(BOOKING_CLASSES).optional(),
    status: z.enum(BOOKING_STATUSES).optional(),
    paymentStatus: z.enum(BOOKING_PAYMENT_STATUSES).optional(),
    currency: currencySchema.optional(),
    baseFare: nonNegativeAmountSchema.optional(),
    taxes: nonNegativeAmountSchema.optional(),
    fees: nonNegativeAmountSchema.optional(),
    discount: nonNegativeAmountSchema.optional(),
    totalAmount: nonNegativeAmountSchema.optional(),
    expiresAt: nullableDateSchema,
    cancellationReason: nullableTextSchema(1000),
    notes: nullableTextSchema(2000),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be provided for an update.",
    },
  )
  .superRefine((data, context) => {
    if (
      data.passengers &&
      data.passengerCount !== undefined &&
      data.passengers.length > data.passengerCount
    ) {
      context.addIssue({
        code: "custom",
        path: ["passengers"],
        message:
          "Passenger records cannot exceed the booking passenger count.",
      });
    }

    if (
      data.baseFare !== undefined &&
      data.taxes !== undefined &&
      data.fees !== undefined &&
      data.discount !== undefined
    ) {
      const expectedTotal =
        data.baseFare + data.taxes + data.fees - data.discount;

      if (expectedTotal < 0) {
        context.addIssue({
          code: "custom",
          path: ["discount"],
          message:
            "Discount cannot exceed the base fare, taxes, and fees combined.",
        });
      }

      if (
        data.totalAmount !== undefined &&
        Math.abs(data.totalAmount - expectedTotal) > 0.01
      ) {
        context.addIssue({
          code: "custom",
          path: ["totalAmount"],
          message:
            "Total amount must equal base fare plus taxes and fees, minus discount.",
        });
      }
    }
  });

export const cancelBookingSchema = z
  .object({
    cancellationReason: optionalTextSchema(1000),
  })
  .strict();

export const bookingIdParamSchema = z.object({
  id: objectIdSchema,
});

export const bookingReferenceParamSchema = z.object({
  bookingReference: bookingReferenceSchema,
});

const optionalDateFilter = z
  .union([dateSchema, z.undefined()])
  .optional();

export const bookingProfileQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    bookingReference: bookingReferenceSchema.optional(),
    customer: objectIdSchema.optional(),
    flight: objectIdSchema.optional(),
    status: z.enum(BOOKING_STATUSES).optional(),
    paymentStatus: z.enum(BOOKING_PAYMENT_STATUSES).optional(),
    bookingClass: z.enum(BOOKING_CLASSES).optional(),
    currency: currencySchema.optional(),
    bookedFrom: optionalDateFilter,
    bookedTo: optionalDateFilter,
    minAmount: z.coerce.number().finite().min(0).optional(),
    maxAmount: z.coerce.number().finite().min(0).optional(),
    sortBy: z
      .enum([
        "bookingReference",
        "bookedAt",
        "totalAmount",
        "status",
        "createdAt",
      ])
      .default("bookedAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
  .superRefine((data, context) => {
    if (
      data.bookedFrom &&
      data.bookedTo &&
      data.bookedFrom > data.bookedTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["bookedTo"],
        message: "Booking end date must be on or after the start date.",
      });
    }

    if (
      data.minAmount !== undefined &&
      data.maxAmount !== undefined &&
      data.minAmount > data.maxAmount
    ) {
      context.addIssue({
        code: "custom",
        path: ["maxAmount"],
        message: "Maximum amount must be greater than or equal to minimum.",
      });
    }
  });

export const bookingCountQuerySchema = z
  .object({
    status: z.enum(BOOKING_STATUSES).optional(),
    paymentStatus: z.enum(BOOKING_PAYMENT_STATUSES).optional(),
    bookedFrom: optionalDateFilter,
    bookedTo: optionalDateFilter,
  })
  .strict()
  .superRefine((data, context) => {
    if (
      data.bookedFrom &&
      data.bookedTo &&
      data.bookedFrom > data.bookedTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["bookedTo"],
        message: "Booking end date must be on or after the start date.",
      });
    }
  });

export type CreateBookingValidationInput = z.infer<
  typeof createBookingSchema
>;

export type UpdateBookingValidationInput = z.infer<
  typeof updateBookingSchema
>;

export type CancelBookingValidationInput = z.infer<
  typeof cancelBookingSchema
>;

export type BookingIdParams = z.infer<typeof bookingIdParamSchema>;

export type BookingReferenceParams = z.infer<
  typeof bookingReferenceParamSchema
>;

export type BookingProfileQuery = z.infer<
  typeof bookingProfileQuerySchema
>;

export type BookingCountQuery = z.infer<
  typeof bookingCountQuerySchema
>;
