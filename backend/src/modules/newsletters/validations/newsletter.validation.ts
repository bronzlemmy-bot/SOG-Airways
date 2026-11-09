
import { z } from "zod";

import {
  NEWSLETTER_SOURCES,
  NEWSLETTER_STATUSES,
} from "../models/newsletter-subscriber.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .max(254)
  .transform((value) => value.toLowerCase());

const nameSchema = z
  .string()
  .trim()
  .min(1)
  .max(100);

const metadataSchema = z.record(z.string(), z.unknown());

const dateSchema = z.coerce.date();

const newsletterSourceSchema = z.enum(NEWSLETTER_SOURCES);
const newsletterStatusSchema = z.enum(NEWSLETTER_STATUSES);

export const createNewsletterSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema.nullable().optional(),
    lastName: nameSchema.nullable().optional(),
    source: newsletterSourceSchema.optional().default("website"),
    consentGiven: z.literal(true, {
      error: "Consent is required to subscribe to the newsletter.",
    }),
    metadata: metadataSchema.optional(),
  })
  .strict();

export const updateNewsletterSchema = z
  .object({
    email: emailSchema.optional(),
    firstName: nameSchema.nullable().optional(),
    lastName: nameSchema.nullable().optional(),
    status: newsletterStatusSchema.optional(),
    source: newsletterSourceSchema.optional(),
    consentGiven: z.boolean().optional(),
    metadata: metadataSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  })
  .refine(
    (data) =>
      data.status !== "subscribed" || data.consentGiven === true,
    {
      message:
        "Explicit consent must be provided when changing a subscription to subscribed.",
      path: ["consentGiven"],
    },
  );

export const newsletterListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    status: newsletterStatusSchema.optional(),
    source: newsletterSourceSchema.optional(),
    fromDate: dateSchema.optional(),
    toDate: dateSchema.optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
  .refine(
    (data) =>
      !data.fromDate ||
      !data.toDate ||
      data.fromDate <= data.toDate,
    {
      message: "fromDate cannot be later than toDate.",
      path: ["fromDate"],
    },
  );

export const newsletterIdParamsSchema = z
  .object({
    newsletterId: objectIdSchema,
  })
  .strict();

export const unsubscribeNewsletterSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const newsletterCountQuerySchema = z
  .object({
    status: newsletterStatusSchema.optional(),
    source: newsletterSourceSchema.optional(),
    fromDate: dateSchema.optional(),
    toDate: dateSchema.optional(),
  })
  .strict()
  .refine(
    (data) =>
      !data.fromDate ||
      !data.toDate ||
      data.fromDate <= data.toDate,
    {
      message: "fromDate cannot be later than toDate.",
      path: ["fromDate"],
    },
  );

export type CreateNewsletterValidatedInput = z.infer<
  typeof createNewsletterSchema
>;

export type UpdateNewsletterValidatedInput = z.infer<
  typeof updateNewsletterSchema
>;

export type NewsletterListValidatedQuery = z.infer<
  typeof newsletterListQuerySchema
>;

export type NewsletterIdValidatedParams = z.infer<
  typeof newsletterIdParamsSchema
>;

export type UnsubscribeNewsletterValidatedInput = z.infer<
  typeof unsubscribeNewsletterSchema
>;

export type NewsletterCountValidatedQuery = z.infer<
  typeof newsletterCountQuerySchema
>;
