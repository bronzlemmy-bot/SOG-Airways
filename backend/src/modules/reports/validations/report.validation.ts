
import { z } from "zod";

import {
  REPORT_FORMATS,
  REPORT_STATUSES,
  REPORT_TYPES,
} from "../models/report-export.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const dateSchema = z.coerce.date();

const filtersSchema = z
  .record(z.string(), z.unknown())
  .optional()
  .default({});

const metadataSchema = z
  .record(z.string(), z.unknown())
  .optional()
  .default({});

export const createReportSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).max(200),
      description: z
        .string()
        .trim()
        .max(2000)
        .nullable()
        .optional(),
      type: z.enum(REPORT_TYPES),
      format: z.enum(REPORT_FORMATS).default("csv"),
      requestedBy: objectIdSchema,
      filters: filtersSchema,
      expiresAt: dateSchema.nullable().optional(),
      metadata: metadataSchema,
    })
    .strict(),
});

export const updateReportSchema = z.object({
  params: z.object({
    reportId: objectIdSchema,
  }),
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      description: z
        .string()
        .trim()
        .max(2000)
        .nullable()
        .optional(),
      format: z.enum(REPORT_FORMATS).optional(),
      filters: z.record(z.string(), z.unknown()).optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for an update.",
    }),
});

export const updateReportStatusSchema = z.object({
  params: z.object({
    reportId: objectIdSchema,
  }),
  body: z
    .object({
      status: z.enum(REPORT_STATUSES),
      fileUrl: z
        .string()
        .trim()
        .url()
        .nullable()
        .optional(),
      fileName: z.string().trim().min(1).max(255).nullable().optional(),
      fileSizeBytes: z.number().min(0).nullable().optional(),
      recordCount: z.number().int().min(0).nullable().optional(),
      errorMessage: z.string().trim().max(2000).nullable().optional(),
      expiresAt: dateSchema.nullable().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .strict(),
});

export const reportListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.enum(REPORT_TYPES).optional(),
    format: z.enum(REPORT_FORMATS).optional(),
    status: z.enum(REPORT_STATUSES).optional(),
    requestedBy: objectIdSchema.optional(),
    search: z.string().trim().max(200).optional(),
    fromDate: dateSchema.optional(),
    toDate: dateSchema.optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
  .refine(
    (query) =>
      !query.fromDate ||
      !query.toDate ||
      query.fromDate <= query.toDate,
    {
      message: "fromDate must be earlier than or equal to toDate.",
      path: ["fromDate"],
    },
  );

export const reportCountQuerySchema = z
  .object({
    type: z.enum(REPORT_TYPES).optional(),
    format: z.enum(REPORT_FORMATS).optional(),
    status: z.enum(REPORT_STATUSES).optional(),
    requestedBy: objectIdSchema.optional(),
    fromDate: dateSchema.optional(),
    toDate: dateSchema.optional(),
  })
  .strict()
  .refine(
    (query) =>
      !query.fromDate ||
      !query.toDate ||
      query.fromDate <= query.toDate,
    {
      message: "fromDate must be earlier than or equal to toDate.",
      path: ["fromDate"],
    },
  );

export const reportIdParamsSchema = z.object({
  params: z.object({
    reportId: objectIdSchema,
  }),
});

export type CreateReportValidatedInput = z.infer<
  typeof createReportSchema
>["body"];

export type UpdateReportValidatedInput = z.infer<
  typeof updateReportSchema
>["body"];

export type UpdateReportStatusValidatedInput = z.infer<
  typeof updateReportStatusSchema
>["body"];

export type ReportListValidatedQuery = z.infer<
  typeof reportListQuerySchema
>;

export type ReportCountValidatedQuery = z.infer<
  typeof reportCountQuerySchema
>;

export type ReportIdValidatedParams = z.infer<
  typeof reportIdParamsSchema
>["params"];
