
import { z } from "zod";

import {
  CUSTOMER_CABIN_CLASSES,
} from "../models/customer-profile.model.js";

/**
 * Optional loyalty number supplied when creating a profile.
 * The database remains responsible for enforcing uniqueness.
 */
const loyaltyNumberSchema = z
  .string()
  .trim()
  .min(1, "Loyalty number cannot be empty.")
  .max(40, "Loyalty number cannot exceed 40 characters.")
  .transform((value) => value.toUpperCase());

/**
 * Validates customer profile creation data.
 *
 * userId is intentionally excluded. The service must obtain
 * the authenticated user's ID rather than trust the request body.
 */
export const createCustomerProfileSchema = z
  .object({
    loyaltyNumber: loyaltyNumberSchema.optional(),

    preferredCabinClass: z
      .enum(CUSTOMER_CABIN_CLASSES)
      .optional(),

    preferredCurrency: z
      .string()
      .trim()
      .regex(
        /^[A-Za-z]{3}$/,
        "Currency must be a three-letter currency code.",
      )
      .transform((value) => value.toUpperCase())
      .optional(),

    marketingConsent: z.boolean().optional(),
  })
  .strict();

/**
 * Validates customer-editable profile preferences.
 *
 * Loyalty tier, miles balance and loyalty number are deliberately
 * excluded from this ordinary profile-update operation.
 */
export const updateCustomerProfileSchema = z
  .object({
    preferredCabinClass: z
      .enum(CUSTOMER_CABIN_CLASSES)
      .optional(),

    preferredCurrency: z
      .string()
      .trim()
      .regex(
        /^[A-Za-z]{3}$/,
        "Currency must be a three-letter currency code.",
      )
      .transform((value) => value.toUpperCase())
      .optional(),

    marketingConsent: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one field to update.",
    },
  );

/**
 * Validates the customer profile ID route parameter.
 * Accepts MongoDB ObjectId values only.
 */
export const customerIdParamSchema = z
  .object({
    customerId: z
      .string()
      .regex(
        /^[a-f\d]{24}$/i,
        "Customer ID must be a valid MongoDB ObjectId.",
      ),
  });

/**
 * Validates query parameters for customer profile listings.
 */
export const customerProfileQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    loyaltyTier: z
      .enum(["standard", "silver", "gold", "platinum"])
      .optional(),

    loyaltyNumber: z
      .string()
      .trim()
      .min(1)
      .max(40)
      .transform((value) => value.toUpperCase())
      .optional(),
  })
  .strict();

/**
 * Inferred request types for use by the service and controller.
 */
export type CreateCustomerProfileRequest = z.infer<
  typeof createCustomerProfileSchema
>;

export type UpdateCustomerProfileRequest = z.infer<
  typeof updateCustomerProfileSchema
>;

export type CustomerIdParam = z.infer<
  typeof customerIdParamSchema
>;

export type CustomerProfileQuery = z.infer<
  typeof customerProfileQuerySchema
>;
