
import { z } from "zod";
import {
  CONTACT_CATEGORIES,
  CONTACT_STATUSES,
} from "../models/contact-inquiry.model.js";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const optionalObjectIdSchema = objectIdSchema.nullable().optional();

const dateSchema = z.coerce.date();

const optionalDateSchema = dateSchema.optional();

const emailSchema = z
  .string()
  .trim()
  .email("A valid email address is required.")
  .max(254)
  .transform((value) => value.toLowerCase());

const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .nullable()
  .optional();

const nameSchema = z.string().trim().min(2).max(120);

const subjectSchema = z.string().trim().min(3).max(200);

const messageSchema = z.string().trim().min(10).max(10000);

export const createContactSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    subject: subjectSchema,
    message: messageSchema,
    category: z.enum(CONTACT_CATEGORIES).optional(),
    customer: optionalObjectIdSchema,
  })
  .strict();

export const updateContactSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema,
    subject: subjectSchema.optional(),
    message: messageSchema.optional(),
    category: z.enum(CONTACT_CATEGORIES).optional(),
    status: z.enum(CONTACT_STATUSES).optional(),
    assignedTo: optionalObjectIdSchema,
    adminNotes: z.string().trim().max(5000).nullable().optional(),
    resolvedAt: dateSchema.nullable().optional(),
    closedAt: dateSchema.nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

export const contactIdParamsSchema = z
  .object({
    contactId: objectIdSchema,
  })
  .strict();

export const contactReferenceParamsSchema = z
  .object({
    reference: z.string().trim().min(1).max(50).transform((value) =>
      value.toUpperCase(),
    ),
  })
  .strict();

export const contactListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum([
        "name",
        "email",
        "subject",
        "category",
        "status",
        "createdAt",
        "updatedAt",
        "resolvedAt",
        "closedAt",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    reference: z.string().trim().min(1).max(50).optional(),
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(254).optional(),
    category: z.enum(CONTACT_CATEGORIES).optional(),
    status: z.enum(CONTACT_STATUSES).optional(),
    customer: objectIdSchema.optional(),
    assignedTo: objectIdSchema.optional(),
    search: z.string().trim().min(1).max(200).optional(),
    createdFrom: optionalDateSchema,
    createdTo: optionalDateSchema,
  })
  .strict()
  .refine(
    (data) =>
      !data.createdFrom ||
      !data.createdTo ||
      data.createdFrom <= data.createdTo,
    {
      message: "createdFrom cannot be later than createdTo.",
      path: ["createdFrom"],
    },
  );

export const contactCountQuerySchema = z
  .object({
    customer: objectIdSchema.optional(),
    assignedTo: objectIdSchema.optional(),
    createdFrom: optionalDateSchema,
    createdTo: optionalDateSchema,
  })
  .strict()
  .refine(
    (data) =>
      !data.createdFrom ||
      !data.createdTo ||
      data.createdFrom <= data.createdTo,
    {
      message: "createdFrom cannot be later than createdTo.",
      path: ["createdFrom"],
    },
  );

export const contactDeleteParamsSchema = contactIdParamsSchema;

export type CreateContactValidatedInput = z.infer<
  typeof createContactSchema
>;

export type UpdateContactValidatedInput = z.infer<
  typeof updateContactSchema
>;

export type ContactIdParams = z.infer<typeof contactIdParamsSchema>;

export type ContactReferenceParams = z.infer<
  typeof contactReferenceParamsSchema
>;

export type ContactListValidatedQuery = z.infer<
  typeof contactListQuerySchema
>;

export type ContactCountValidatedQuery = z.infer<
  typeof contactCountQuerySchema
>;
