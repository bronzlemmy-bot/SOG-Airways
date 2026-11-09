
import { z } from "zod";

import {
  AIRCRAFT_STATUSES,
  AIRCRAFT_TYPES,
} from "../models/aircraft.model.js";

const currentYear = new Date().getFullYear();

const registrationNumberSchema = z
  .string()
  .trim()
  .min(2, "Registration number must contain at least 2 characters.")
  .max(20, "Registration number cannot exceed 20 characters.")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "Registration number may contain only letters, numbers, and hyphens.",
  )
  .transform((value) => value.toUpperCase());

const aircraftCapacitySchema = z
  .object({
    economy: z.number().int().min(0),
    premiumEconomy: z.number().int().min(0),
    business: z.number().int().min(0),
    first: z.number().int().min(0),
    total: z.number().int().min(1),
  })
  .strict()
  .superRefine((capacity, context) => {
    const cabinTotal =
      capacity.economy +
      capacity.premiumEconomy +
      capacity.business +
      capacity.first;

    if (cabinTotal !== capacity.total) {
      context.addIssue({
        code: "custom",
        path: ["total"],
        message:
          "Total aircraft capacity must equal the sum of all cabin capacities.",
      });
    }
  });

const aircraftTypeSchema = z.enum(AIRCRAFT_TYPES);
const aircraftStatusSchema = z.enum(AIRCRAFT_STATUSES);

const manufactureYearSchema = z
  .number()
  .int("Manufacture year must be a whole number.")
  .min(1900, "Manufacture year cannot be earlier than 1900.")
  .max(
    currentYear + 1,
    `Manufacture year cannot be later than ${currentYear + 1}.`,
  );

export const createAircraftSchema = z
  .object({
    registrationNumber: registrationNumberSchema,
    manufacturer: z
      .string()
      .trim()
      .min(2, "Manufacturer must contain at least 2 characters.")
      .max(100, "Manufacturer cannot exceed 100 characters."),
    model: z
      .string()
      .trim()
      .min(1, "Aircraft model is required.")
      .max(100, "Aircraft model cannot exceed 100 characters."),
    aircraftType: aircraftTypeSchema,
    serialNumber: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .transform((value) => value.toUpperCase())
      .optional(),
    manufactureYear: manufactureYearSchema,
    capacity: aircraftCapacitySchema,
    rangeKilometers: z
      .number()
      .finite()
      .positive("Aircraft range must be greater than zero."),
    status: aircraftStatusSchema.optional(),
    notes: z
      .string()
      .trim()
      .max(2000, "Notes cannot exceed 2000 characters.")
      .optional(),
  })
  .strict();

export const updateAircraftSchema = z
  .object({
    registrationNumber: registrationNumberSchema.optional(),
    manufacturer: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),
    model: z.string().trim().min(1).max(100).optional(),
    aircraftType: aircraftTypeSchema.optional(),
    serialNumber: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .transform((value) => value.toUpperCase())
      .nullable()
      .optional(),
    manufactureYear: manufactureYearSchema.optional(),
    capacity: aircraftCapacitySchema.optional(),
    rangeKilometers: z.number().finite().positive().optional(),
    status: aircraftStatusSchema.optional(),
    notes: z.string().trim().max(2000).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

export const aircraftIdParamSchema = z
  .object({
    id: z
      .string()
      .trim()
      .regex(/^[a-f\d]{24}$/i, "A valid aircraft ID is required."),
  })
  .strict();

export const aircraftRegistrationParamSchema = z
  .object({
    registrationNumber: registrationNumberSchema,
  })
  .strict();

export const aircraftProfileQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(100).optional(),
    manufacturer: z.string().trim().max(100).optional(),
    aircraftType: aircraftTypeSchema.optional(),
    status: aircraftStatusSchema.optional(),
    manufactureYear: z.coerce
      .number()
      .int()
      .min(1900)
      .max(currentYear + 1)
      .optional(),
    minRangeKilometers: z.coerce.number().positive().optional(),
    maxRangeKilometers: z.coerce.number().positive().optional(),
    sortBy: z
      .enum([
        "registrationNumber",
        "manufacturer",
        "model",
        "manufactureYear",
        "createdAt",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
  .refine(
    (data) =>
      data.minRangeKilometers === undefined ||
      data.maxRangeKilometers === undefined ||
      data.minRangeKilometers <= data.maxRangeKilometers,
    {
      path: ["maxRangeKilometers"],
      message:
        "Maximum range must be greater than or equal to minimum range.",
    },
  );

export const aircraftCountQuerySchema = z
  .object({
    status: aircraftStatusSchema.optional(),
    aircraftType: aircraftTypeSchema.optional(),
    manufacturer: z.string().trim().max(100).optional(),
  })
  .strict();

export type CreateAircraftValidationInput = z.infer<
  typeof createAircraftSchema
>;

export type UpdateAircraftValidationInput = z.infer<
  typeof updateAircraftSchema
>;

export type AircraftIdParamInput = z.infer<
  typeof aircraftIdParamSchema
>;

export type AircraftRegistrationParamInput = z.infer<
  typeof aircraftRegistrationParamSchema
>;

export type AircraftProfileQueryInput = z.infer<
  typeof aircraftProfileQuerySchema
>;

export type AircraftCountQueryInput = z.infer<
  typeof aircraftCountQuerySchema
>;
