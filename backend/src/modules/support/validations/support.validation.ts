
import { z } from "zod";

import {
  SUPPORT_CASE_CATEGORIES,
  SUPPORT_CASE_PRIORITIES,
  SUPPORT_CASE_STATUSES,
} from "../models/support-case.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid MongoDB ObjectId.");

const emailSchema = z
  .string()
  .trim()
  .email("A valid email address is required.")
  .max(254)
  .transform((value) => value.toLowerCase());

const attachmentSchema = z
  .array(z.string().trim().min(1).max(2048))
  .max(10)
  .optional()
  .default([]);

export const createSupportCaseSchema = z.object({
  body: z
    .object({
      customerName: z.string().trim().min(2).max(150),
      customerEmail: emailSchema,
      subject: z.string().trim().min(5).max(200),
      description: z.string().trim().min(10).max(10000),
      category: z.enum(SUPPORT_CASE_CATEGORIES).optional(),
      priority: z.enum(SUPPORT_CASE_PRIORITIES).optional(),
      attachments: attachmentSchema,
    })
    .strict(),
});

export const supportCaseIdParamsSchema = z.object({
  params: z.object({
    caseId: objectIdSchema,
  }),
});

export const supportCaseNumberParamsSchema = z.object({
  params: z.object({
    caseNumber: z.string().trim().min(1).max(50),
  }),
});

export const listSupportCasesQuerySchema = z.object({
  query: z
    .object({
      customerId: objectIdSchema.optional(),
      customerEmail: emailSchema.optional(),
      assignedTo: objectIdSchema.optional(),
      category: z.enum(SUPPORT_CASE_CATEGORIES).optional(),
      priority: z.enum(SUPPORT_CASE_PRIORITIES).optional(),
      status: z.enum(SUPPORT_CASE_STATUSES).optional(),
      search: z.string().trim().max(200).optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      sortBy: z
        .enum(["createdAt", "updatedAt", "priority", "status"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    })
    .strict(),
});

export const updateSupportCaseSchema = z.object({
  params: z.object({
    caseId: objectIdSchema,
  }),
  body: z
    .object({
      subject: z.string().trim().min(5).max(200).optional(),
      description: z.string().trim().min(10).max(10000).optional(),
      category: z.enum(SUPPORT_CASE_CATEGORIES).optional(),
      priority: z.enum(SUPPORT_CASE_PRIORITIES).optional(),
      status: z.enum(SUPPORT_CASE_STATUSES).optional(),
      assignedTo: objectIdSchema.nullable().optional(),
      resolution: z.string().trim().max(10000).nullable().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided for an update.",
    }),
});

export const addSupportMessageSchema = z.object({
  params: z.object({
    caseId: objectIdSchema,
  }),
  body: z
    .object({
      message: z.string().trim().min(1).max(5000),
      attachments: attachmentSchema,
    })
    .strict(),
});

export const supportCaseCountQuerySchema = z.object({
  query: z
    .object({
      customerId: objectIdSchema.optional(),
      customerEmail: emailSchema.optional(),
      assignedTo: objectIdSchema.optional(),
      category: z.enum(SUPPORT_CASE_CATEGORIES).optional(),
      priority: z.enum(SUPPORT_CASE_PRIORITIES).optional(),
      status: z.enum(SUPPORT_CASE_STATUSES).optional(),
    })
    .strict(),
});

export type CreateSupportCaseValidatedInput = z.infer<
  typeof createSupportCaseSchema
>["body"];

export type SupportCaseIdValidatedParams = z.infer<
  typeof supportCaseIdParamsSchema
>["params"];

export type SupportCaseNumberValidatedParams = z.infer<
  typeof supportCaseNumberParamsSchema
>["params"];

export type ListSupportCasesValidatedQuery = z.infer<
  typeof listSupportCasesQuerySchema
>["query"];

export type UpdateSupportCaseValidatedInput = z.infer<
  typeof updateSupportCaseSchema
>["body"];

export type AddSupportMessageValidatedInput = z.infer<
  typeof addSupportMessageSchema
>["body"];

export type SupportCaseCountValidatedQuery = z.infer<
  typeof supportCaseCountQuerySchema
>["query"];
