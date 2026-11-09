
import { z } from "zod";

import {
  PASSENGER_DOCUMENT_TYPES,
  PASSENGER_GENDERS,
  PASSENGER_STATUSES,
} from "../models/passenger.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Must not exceed ${maxLength} characters.`)
    .nullable()
    .optional();

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .max(254, "Email cannot exceed 254 characters.")
  .transform((value) => value.toLowerCase())
  .nullable()
  .optional();

const dateSchema = z.coerce
  .date()
  .refine(
    (value) => !Number.isNaN(value.getTime()),
    "A valid date is required.",
  );

const pastDateSchema = dateSchema.refine(
  (value) => value < new Date(),
  "Date of birth must be in the past.",
);

const futureDateSchema = dateSchema.refine(
  (value) => value > new Date(),
  "Document expiry date must be in the future.",
);

const passengerFields = {
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name cannot exceed 100 characters."),
  middleName: optionalText(100),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name cannot exceed 100 characters."),
  dateOfBirth: pastDateSchema,
  gender: z.enum(PASSENGER_GENDERS).optional(),
  nationality: z
    .string()
    .trim()
    .min(1, "Nationality is required.")
    .max(100, "Nationality cannot exceed 100 characters."),
  email: emailSchema,
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number cannot be empty.")
    .max(30, "Phone number cannot exceed 30 characters.")
    .nullable()
    .optional(),
  documentType: z
    .enum(PASSENGER_DOCUMENT_TYPES)
    .nullable()
    .optional(),
  documentNumber: z
    .string()
    .trim()
    .min(1, "Document number cannot be empty.")
    .max(100, "Document number cannot exceed 100 characters.")
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional(),
  documentIssuingCountry: z
    .string()
    .trim()
    .max(100, "Issuing country cannot exceed 100 characters.")
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional(),
  documentExpiryDate: futureDateSchema.nullable().optional(),
  specialAssistanceRequired: z.boolean().optional(),
  specialAssistanceNotes: optionalText(1000),
  frequentFlyerNumber: z
    .string()
    .trim()
    .max(50, "Frequent flyer number cannot exceed 50 characters.")
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional(),
  status: z.enum(PASSENGER_STATUSES).optional(),
  notes: optionalText(2000),
};


function validatePassengerRelationships<
  T extends {
    documentType?: string | null;
    documentNumber?: string | null;
    documentIssuingCountry?: string | null;
    documentExpiryDate?: Date | null;
    specialAssistanceRequired?: boolean;
    specialAssistanceNotes?: string | null;
  },
>(data: T, ctx: z.RefinementCtx): void {

  const hasDocumentType = Boolean(data.documentType);
  const hasDocumentNumber = Boolean(data.documentNumber);

  if (hasDocumentType !== hasDocumentNumber) {
    ctx.addIssue({
      code: "custom",
      path: ["documentNumber"],
      message:
        "Document type and document number must be provided together.",
    });
  }

  if (
    data.documentIssuingCountry &&
    !hasDocumentType
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["documentIssuingCountry"],
      message: "An issuing country requires document details.",
    });
  }

  if (
    data.documentExpiryDate &&
    !hasDocumentNumber
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["documentExpiryDate"],
      message: "Document expiry date requires document details.",
    });
  }

  if (
    data.specialAssistanceRequired === false &&
    data.specialAssistanceNotes
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["specialAssistanceNotes"],
      message:
        "Enable special assistance before providing assistance notes.",
    });
  }
}

export const createPassengerSchema = z
  .object({
    customer: objectIdSchema.optional(),
    ...passengerFields,
  })
  .superRefine(validatePassengerRelationships);

export const bookingPassengerSchema = z
  .object({
    firstName: passengerFields.firstName,
    middleName: passengerFields.middleName,
    lastName: passengerFields.lastName,
    dateOfBirth: passengerFields.dateOfBirth,
    gender: passengerFields.gender,
    nationality: passengerFields.nationality,
    email: passengerFields.email,
    phoneNumber: passengerFields.phoneNumber,
    documentType: passengerFields.documentType,
    documentNumber: passengerFields.documentNumber,
    documentIssuingCountry:
      passengerFields.documentIssuingCountry,
    documentExpiryDate: passengerFields.documentExpiryDate,
  })
  .strict()
  .superRefine(validatePassengerRelationships);

export const updatePassengerSchema = z
  .object({
    customer: objectIdSchema.optional(),
    firstName: passengerFields.firstName.optional(),
    middleName: passengerFields.middleName,
    lastName: passengerFields.lastName.optional(),
    dateOfBirth: pastDateSchema.optional(),
    gender: passengerFields.gender,
    nationality: passengerFields.nationality.optional(),
    email: passengerFields.email,
    phoneNumber: passengerFields.phoneNumber,
    documentType: passengerFields.documentType,
    documentNumber: passengerFields.documentNumber,
    documentIssuingCountry:
      passengerFields.documentIssuingCountry,
    documentExpiryDate: passengerFields.documentExpiryDate,
    specialAssistanceRequired:
      passengerFields.specialAssistanceRequired,
    specialAssistanceNotes:
      passengerFields.specialAssistanceNotes,
    frequentFlyerNumber: passengerFields.frequentFlyerNumber,
    status: passengerFields.status,
    notes: passengerFields.notes,
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided for an update." },
  )
  .superRefine(validatePassengerRelationships);

export const passengerIdParamSchema = z.object({
  id: objectIdSchema,
});

export const passengerCustomerParamSchema = z.object({
  customerId: objectIdSchema,
});

export const passengerListQuerySchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    customer: objectIdSchema.optional(),
    firstName: z.string().trim().max(100).optional(),
    lastName: z.string().trim().max(100).optional(),
    email: z.string().trim().max(254).optional(),
    nationality: z.string().trim().max(100).optional(),
    gender: z.enum(PASSENGER_GENDERS).optional(),
    status: z.enum(PASSENGER_STATUSES).optional(),
    documentType: z.enum(PASSENGER_DOCUMENT_TYPES).optional(),
    specialAssistanceRequired: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    dateOfBirthFrom: dateSchema.optional(),
    dateOfBirthTo: dateSchema.optional(),
    createdFrom: dateSchema.optional(),
    createdTo: dateSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z
      .enum([
        "firstName",
        "lastName",
        "dateOfBirth",
        "nationality",
        "status",
        "createdAt",
        "updatedAt",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .superRefine((data, ctx) => {
    if (
      data.dateOfBirthFrom &&
      data.dateOfBirthTo &&
      data.dateOfBirthFrom > data.dateOfBirthTo
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirthTo"],
        message:
          "Date-of-birth end date cannot precede the start date.",
      });
    }

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
  });

export const passengerCountQuerySchema = z.object({
  customer: objectIdSchema.optional(),
  status: z.enum(PASSENGER_STATUSES).optional(),
});

export type CreatePassengerValidatedInput = z.infer<
  typeof createPassengerSchema
>;

export type UpdatePassengerValidatedInput = z.infer<
  typeof updatePassengerSchema
>;

export type PassengerListValidatedQuery = z.infer<
  typeof passengerListQuerySchema
>;

export type PassengerCountValidatedQuery = z.infer<
  typeof passengerCountQuerySchema
>;
