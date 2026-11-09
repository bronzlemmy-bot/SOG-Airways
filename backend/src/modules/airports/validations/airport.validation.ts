
import { z } from "zod";

import {
  AIRPORT_STATUSES,
} from "../models/airport.model.js";

const airportCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Airport IATA code must contain exactly three letters.");

const icaoCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{4}$/, "Airport ICAO code must contain exactly four letters.");

const airportNameSchema = z
  .string()
  .trim()
  .min(2, "Airport name must contain at least 2 characters.")
  .max(150, "Airport name cannot exceed 150 characters.");

const citySchema = z
  .string()
  .trim()
  .min(2, "City must contain at least 2 characters.")
  .max(100, "City cannot exceed 100 characters.");

const countrySchema = z
  .string()
  .trim()
  .min(2, "Country must contain at least 2 characters.")
  .max(100, "Country cannot exceed 100 characters.");

const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, "Country code must contain exactly two letters.");

const timezoneSchema = z
  .string()
  .trim()
  .min(1, "Timezone is required.")
  .max(100, "Timezone cannot exceed 100 characters.")
  .refine(
    (timezone) => {
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: timezone });
        return true;
      } catch {
        return false;
      }
    },
    { message: "A valid IANA timezone is required." },
  );

const coordinatesSchema = z
  .object({
    latitude: z
      .number()
      .min(-90, "Latitude cannot be less than -90.")
      .max(90, "Latitude cannot exceed 90."),
    longitude: z
      .number()
      .min(-180, "Longitude cannot be less than -180.")
      .max(180, "Longitude cannot exceed 180."),
  })
  .strict();

const airportStatusSchema = z.enum(AIRPORT_STATUSES);

export const createAirportSchema = z
  .object({
    airportCode: airportCodeSchema,
    icaoCode: icaoCodeSchema,
    name: airportNameSchema,
    city: citySchema,
    state: z
      .string()
      .trim()
      .min(1, "State cannot be empty.")
      .max(100, "State cannot exceed 100 characters.")
      .optional(),
    country: countrySchema,
    countryCode: countryCodeSchema,
    timezone: timezoneSchema,
    coordinates: coordinatesSchema,
    status: airportStatusSchema.optional(),
  })
  .strict();

export const updateAirportSchema = z
  .object({
    airportCode: airportCodeSchema.optional(),
    icaoCode: icaoCodeSchema.optional(),
    name: airportNameSchema.optional(),
    city: citySchema.optional(),
    state: z
      .string()
      .trim()
      .min(1, "State cannot be empty.")
      .max(100, "State cannot exceed 100 characters.")
      .nullable()
      .optional(),
    country: countrySchema.optional(),
    countryCode: countryCodeSchema.optional(),
    timezone: timezoneSchema.optional(),
    coordinates: coordinatesSchema.optional(),
    status: airportStatusSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update an airport.",
  });

export const airportIdParamSchema = z
  .object({
    airportId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "A valid airport ID is required."),
  })
  .strict();

export const airportCodeParamSchema = z
  .object({
    airportCode: airportCodeSchema,
  })
  .strict();

export const airportProfileQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    airportCode: airportCodeSchema.optional(),
    icaoCode: icaoCodeSchema.optional(),
    name: z.string().trim().min(1).max(150).optional(),
    city: z.string().trim().min(1).max(100).optional(),
    country: z.string().trim().min(1).max(100).optional(),
    countryCode: countryCodeSchema.optional(),
    status: airportStatusSchema.optional(),
  })
  .strict();

export type CreateAirportRequest = z.infer<typeof createAirportSchema>;
export type UpdateAirportRequest = z.infer<typeof updateAirportSchema>;
export type AirportIdParam = z.infer<typeof airportIdParamSchema>;
export type AirportCodeParam = z.infer<typeof airportCodeParamSchema>;
export type AirportProfileQuery = z.infer<
  typeof airportProfileQuerySchema
>;
