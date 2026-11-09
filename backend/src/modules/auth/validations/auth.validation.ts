
import { z } from "zod";

import {
  createCustomerUserSchema,
} from "../../users/validations/user.validation.js";

/**
 * Customer registration uses the existing user validation schema.
 * This avoids duplicating registration rules.
 */
export const registerSchema = createCustomerUserSchema;

/**
 * Login request validation.
 */
export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email cannot exceed 254 characters.")
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(1, "Password is required.")
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password must not exceed 72 UTF-8 bytes.",
      ),
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email cannot exceed 254 characters.")
      .transform((value) => value.toLowerCase()),
    code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
  })
  .strict();

export const resendVerificationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email cannot exceed 254 characters.")
      .transform((value) => value.toLowerCase()),
  })
  .strict();

/**
 * TypeScript types inferred directly from the schemas.
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>;
