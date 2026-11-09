
import { z } from "zod";
import {
  CONTENT_CATEGORIES,
  CONTENT_STATUSES,
  CONTENT_TYPES,
} from "../models/content-page.model.js";

const objectIdSchema = z.string().regex(
  /^[a-f\d]{24}$/i,
  "A valid MongoDB ID is required.",
);

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(220)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may contain lowercase letters, numbers, and single hyphens.",
  );

const seoSchema = z
  .object({
    metaTitle: z.string().trim().max(70).nullable().optional(),
    metaDescription: z.string().trim().max(170).nullable().optional(),
    keywords: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  })
  .strict();

const tagsSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(30)
  .optional();

const dateSchema = z.coerce.date();

export const createContentSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: slugSchema,
    type: z.enum(CONTENT_TYPES).optional(),
    category: z.enum(CONTENT_CATEGORIES).optional(),
    excerpt: z.string().trim().max(500).nullable().optional(),
    body: z.string().trim().min(1).max(100000),
    imageUrl: z.string().trim().max(2048).url().nullable().optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
    tags: tagsSchema,
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    scheduledAt: dateSchema.nullable().optional(),
    expiresAt: dateSchema.nullable().optional(),
    seo: seoSchema.optional(),
  })
  .strict()
  .superRefine((data, context) => {
    if (
      data.scheduledAt &&
      data.expiresAt &&
      data.expiresAt <= data.scheduledAt
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Expiration date must be later than the scheduled date.",
      });
    }
  });

export const updateContentSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    slug: slugSchema.optional(),
    type: z.enum(CONTENT_TYPES).optional(),
    category: z.enum(CONTENT_CATEGORIES).optional(),
    excerpt: z.string().trim().max(500).nullable().optional(),
    body: z.string().trim().min(1).max(100000).optional(),
    imageUrl: z.string().trim().max(2048).url().nullable().optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
    tags: tagsSchema,
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    scheduledAt: dateSchema.nullable().optional(),
    expiresAt: dateSchema.nullable().optional(),
    seo: seoSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  })
  .superRefine((data, context) => {
    if (
      data.scheduledAt instanceof Date &&
      data.expiresAt instanceof Date &&
      data.expiresAt <= data.scheduledAt
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Expiration date must be later than the scheduled date.",
      });
    }
  });

const paginationSchema = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
  type: z.enum(CONTENT_TYPES).optional(),
  category: z.enum(CONTENT_CATEGORIES).optional(),
  isFeatured: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  tag: z.string().trim().min(1).max(50).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "publishedAt", "title", "sortOrder"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
};

export const contentListQuerySchema = z
  .object({
    ...paginationSchema,
    status: z.enum(CONTENT_STATUSES).optional(),
  })
  .strict();

export const publicContentQuerySchema = z
  .object({
    ...paginationSchema,
    sortBy: z.enum(["publishedAt", "title", "sortOrder"]).optional(),
  })
  .strict();

export const contentIdParamsSchema = z
  .object({
    contentId: objectIdSchema,
  })
  .strict();

export const contentSlugParamsSchema = z
  .object({
    slug: slugSchema,
  })
  .strict();

export const contentCountQuerySchema = z
  .object({
    type: z.enum(CONTENT_TYPES).optional(),
    category: z.enum(CONTENT_CATEGORIES).optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
    isFeatured: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  })
  .strict();

export type CreateContentValidatedInput = z.infer<
  typeof createContentSchema
>;

export type UpdateContentValidatedInput = z.infer<
  typeof updateContentSchema
>;

export type ContentListValidatedQuery = z.infer<
  typeof contentListQuerySchema
>;

export type PublicContentValidatedQuery = z.infer<
  typeof publicContentQuerySchema
>;

export type ContentIdValidatedParams = z.infer<
  typeof contentIdParamsSchema
>;

export type ContentSlugValidatedParams = z.infer<
  typeof contentSlugParamsSchema
>;

export type ContentCountValidatedQuery = z.infer<
  typeof contentCountQuerySchema
>;
