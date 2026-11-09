
import { z } from "zod";

import {
  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUSES,
  REFUND_STATUSES,
} from "../models/payment.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const currencySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, "Currency must be a three-letter code.")
  .transform((value) => value.toUpperCase());

const positiveAmountSchema = z
  .number()
  .finite()
  .positive("Amount must be greater than zero.")
  .refine(
    (value) => Math.round(value * 100) / 100 === value,
    "Amount must have at most two decimal places.",
  );

const nonNegativeAmountSchema = z
  .number()
  .finite()
  .min(0, "Amount cannot be negative.")
  .refine(
    (value) => Math.round(value * 100) / 100 === value,
    "Amount must have at most two decimal places.",
  );

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Must not exceed ${maxLength} characters.`)
    .nullable()
    .optional();

const dateSchema = z.coerce
  .date()
  .refine(
    (value) => !Number.isNaN(value.getTime()),
    "A valid date is required.",
  );

const metadataSchema = z
  .record(z.string(), z.unknown())
  .optional();

export const createPaymentSchema = z
  .object({
    paymentReference: z
      .string()
      .trim()
      .min(5)
      .max(50)
      .transform((value) => value.toUpperCase())
      .optional(),
    booking: objectIdSchema,
    customer: objectIdSchema,
    amount: positiveAmountSchema,
    currency: currencySchema.optional(),
    method: z.enum(PAYMENT_METHODS),
    provider: z.enum(PAYMENT_PROVIDERS).optional(),
    status: z.enum(PAYMENT_STATUSES).optional(),
    providerTransactionId: optionalText(200),
    idempotencyKey: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .nullable()
      .optional(),
    description: optionalText(1000),
    failureCode: optionalText(100),
    failureReason: optionalText(1000),
    paidAt: dateSchema.nullable().optional(),
    refundedAmount: nonNegativeAmountSchema.optional(),
    refundStatus: z.enum(REFUND_STATUSES).optional(),
    refundedAt: dateSchema.nullable().optional(),
    refundReference: optionalText(200),
    metadata: metadataSchema,
    notes: optionalText(2000),
  })
  .superRefine((data, ctx) => {
    const refundedAmount = data.refundedAmount ?? 0;

    if (refundedAmount > data.amount) {
      ctx.addIssue({
        code: "custom",
        path: ["refundedAmount"],
        message: "Refunded amount cannot exceed payment amount.",
      });
    }

    if (
      data.status === "refunded" &&
      refundedAmount !== data.amount
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["refundedAmount"],
        message: "A fully refunded payment must be refunded in full.",
      });
    }

    if (
      data.status === "partially_refunded" &&
      (refundedAmount <= 0 || refundedAmount >= data.amount)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["refundedAmount"],
        message:
          "A partial refund must be greater than zero and less than the payment amount.",
      });
    }

    if (
      refundedAmount > 0 &&
      (data.refundStatus === undefined ||
        data.refundStatus === "not_requested")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["refundStatus"],
        message: "A refunded payment must have a valid refund status.",
      });
    }
  });

export const updatePaymentSchema = z
  .object({
    status: z.enum(PAYMENT_STATUSES).optional(),
    providerTransactionId: optionalText(200),
    description: optionalText(1000),
    failureCode: optionalText(100),
    failureReason: optionalText(1000),
    paidAt: dateSchema.nullable().optional(),
    refundedAmount: nonNegativeAmountSchema.optional(),
    refundStatus: z.enum(REFUND_STATUSES).optional(),
    refundedAt: dateSchema.nullable().optional(),
    refundReference: optionalText(200),
    metadata: metadataSchema,
    notes: optionalText(2000),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided for an update." },
  );

export const refundPaymentSchema = z.object({
  amount: positiveAmountSchema.optional(),
  reason: z.string().trim().max(1000).optional(),
  refundReference: z.string().trim().min(1).max(200).optional(),
});

export const demoPaymentSchema = z
  .object({
    idempotencyKey: z
      .string()
      .trim()
      .min(16)
      .max(200)
      .regex(
        /^[A-Za-z0-9._:-]+$/,
        "The idempotency key contains invalid characters.",
      ),
    outcome: z.enum(["approved", "declined", "error"]),
    method: z.enum(["demo-wallet", "demo-bank-transfer"]),
  })
  .strict();

export const demoPaymentBookingParamsSchema = z
  .object({ bookingId: objectIdSchema })
  .strict();

export const paymentIdParamSchema = z.object({
  id: objectIdSchema,
});

export const paymentReferenceParamSchema = z.object({
  paymentReference: z
    .string()
    .trim()
    .min(5)
    .max(50)
    .transform((value) => value.toUpperCase()),
});

export const paymentListQuerySchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    paymentReference: z.string().trim().max(50).optional(),
    booking: objectIdSchema.optional(),
    customer: objectIdSchema.optional(),
    method: z.enum(PAYMENT_METHODS).optional(),
    provider: z.enum(PAYMENT_PROVIDERS).optional(),
    status: z.enum(PAYMENT_STATUSES).optional(),
    refundStatus: z.enum(REFUND_STATUSES).optional(),
    currency: currencySchema.optional(),
    createdFrom: dateSchema.optional(),
    createdTo: dateSchema.optional(),
    minAmount: z.coerce.number().finite().min(0).optional(),
    maxAmount: z.coerce.number().finite().min(0).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z
      .enum([
        "paymentReference",
        "amount",
        "status",
        "createdAt",
        "updatedAt",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .superRefine((data, ctx) => {
    if (
      data.createdFrom &&
      data.createdTo &&
      data.createdFrom > data.createdTo
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["createdTo"],
        message: "End date cannot precede start date.",
      });
    }

    if (
      data.minAmount !== undefined &&
      data.maxAmount !== undefined &&
      data.minAmount > data.maxAmount
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxAmount"],
        message: "Maximum amount cannot be less than minimum amount.",
      });
    }
  });

export const paymentCountQuerySchema = z.object({
  status: z.enum(PAYMENT_STATUSES).optional(),
  currency: currencySchema.optional(),
  createdFrom: dateSchema.optional(),
  createdTo: dateSchema.optional(),
});

export type CreatePaymentValidatedInput = z.infer<
  typeof createPaymentSchema
>;

export type UpdatePaymentValidatedInput = z.infer<
  typeof updatePaymentSchema
>;

export type RefundPaymentValidatedInput = z.infer<
  typeof refundPaymentSchema
>;

export type PaymentListValidatedQuery = z.infer<
  typeof paymentListQuerySchema
>;

export type PaymentCountValidatedQuery = z.infer<
  typeof paymentCountQuerySchema
>;
