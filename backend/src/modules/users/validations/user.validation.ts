
import { z } from "zod";
import { USER_GENDERS } from "../models/user.model.js";

export const createCustomerUserSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(80, "First name cannot exceed 80 characters."),

    middleName: z
      .string()
      .trim()
      .min(1, "Middle name cannot be empty.")
      .max(80, "Middle name cannot exceed 80 characters.")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(80, "Last name cannot exceed 80 characters."),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email cannot exceed 254 characters.")
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password must not exceed 72 UTF-8 bytes.",
      ),

    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number cannot be empty.")
      .max(25, "Phone number cannot exceed 25 characters.")
      .optional(),

    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date of birth.")
      .refine(
        (value) => {
          const dateOfBirth = new Date(`${value}T00:00:00.000Z`);

          return (
            Number.isFinite(dateOfBirth.getTime()) &&
            dateOfBirth.toISOString().slice(0, 10) === value &&
            dateOfBirth < new Date()
          );
        },
        {
          message: "Date of birth must be a valid date in the past.",
        },
      )
      .transform((value) => new Date(`${value}T00:00:00.000Z`))
      .optional(),

    gender: z.enum(USER_GENDERS).optional(),
  })
  .strict();

export const updateUserProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name cannot be empty.")
      .max(80, "First name cannot exceed 80 characters.")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name cannot be empty.")
      .max(80, "Last name cannot exceed 80 characters.")
      .optional(),

    phoneNumber: z
      .string()
      .trim()
      .max(25, "Phone number cannot exceed 25 characters.")
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.firstName !== undefined ||
      data.lastName !== undefined ||
      data.phoneNumber !== undefined,
    {
      message: "Provide at least one profile field to update.",
    },
  );

export const userIdParamSchema = z
  .object({
    id: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "A valid user ID is required."),
  })
  .strict();

export type CreateCustomerUserData = z.infer<
  typeof createCustomerUserSchema
>;

export type UpdateUserProfileData = z.infer<
  typeof updateUserProfileSchema
>;

export type UserIdParam = z.infer<typeof userIdParamSchema>;
