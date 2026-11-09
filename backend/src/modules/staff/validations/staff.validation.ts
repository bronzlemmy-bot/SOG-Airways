
import { z } from "zod";

import {
  STAFF_DEPARTMENTS,
  STAFF_EMPLOYMENT_STATUSES,
} from "../models/staff-profile.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "ID must be a valid MongoDB ObjectId.");

const employeeNumberSchema = z
  .string()
  .trim()
  .min(2, "Employee number must contain at least 2 characters.")
  .max(30, "Employee number cannot exceed 30 characters.")
  .transform((value) => value.toUpperCase());

const jobTitleSchema = z
  .string()
  .trim()
  .min(2, "Job title must contain at least 2 characters.")
  .max(100, "Job title cannot exceed 100 characters.");

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Please provide a valid calendar date.");

const notesSchema = z
  .string()
  .trim()
  .max(2000, "Notes cannot exceed 2000 characters.");

export const createStaffSchema = z
  .object({
    userId: objectIdSchema,
    employeeNumber: employeeNumberSchema,
    department: z.enum(STAFF_DEPARTMENTS),
    jobTitle: jobTitleSchema,
    hireDate: dateSchema,
    notes: notesSchema.optional(),
  })
  .strict();

export const updateStaffSchema = z
  .object({
    employeeNumber: employeeNumberSchema.optional(),
    department: z.enum(STAFF_DEPARTMENTS).optional(),
    jobTitle: jobTitleSchema.optional(),
    employmentStatus: z.enum(STAFF_EMPLOYMENT_STATUSES).optional(),
    hireDate: dateSchema.optional(),
    terminationDate: dateSchema.nullable().optional(),
    notes: notesSchema.nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const staffIdParamSchema = z.object({
  staffId: objectIdSchema,
});

export const staffUserIdParamSchema = z.object({
  userId: objectIdSchema,
});

export const staffProfileQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    employeeNumber: employeeNumberSchema.optional(),
    department: z.enum(STAFF_DEPARTMENTS).optional(),
    employmentStatus: z.enum(STAFF_EMPLOYMENT_STATUSES).optional(),
  })
  .strict();

export type CreateStaffRequest = z.infer<typeof createStaffSchema>;
export type UpdateStaffRequest = z.infer<typeof updateStaffSchema>;
export type StaffIdParam = z.infer<typeof staffIdParamSchema>;
export type StaffUserIdParam = z.infer<typeof staffUserIdParamSchema>;
export type StaffProfileQuery = z.infer<typeof staffProfileQuerySchema>;
