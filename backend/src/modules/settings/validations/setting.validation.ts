
import { z } from "zod";
import { SETTING_CATEGORIES } from "../models/setting.model.js";

const settingKeySchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Setting key must contain at least 2 characters.")
  .max(150, "Setting key cannot exceed 150 characters.")
  .regex(
    /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
    "Setting key may contain lowercase letters, numbers, dots, underscores, and hyphens.",
  );

const settingValueSchema = z.unknown();

const settingDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "Description cannot exceed 1000 characters.")
  .nullable()
  .optional();

const settingCategorySchema = z.enum(SETTING_CATEGORIES);

export const createSettingSchema = z.object({
  key: settingKeySchema,
  value: settingValueSchema,
  description: settingDescriptionSchema,
  category: settingCategorySchema.optional(),
  isPublic: z.boolean().optional(),
});

export const updateSettingSchema = z
  .object({
    value: z.unknown().optional(),
    description: settingDescriptionSchema,
    category: settingCategorySchema.optional(),
    isPublic: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one setting field must be provided.",
  );

export const settingIdParamsSchema = z.object({
  settingId: z.string().trim().regex(
    /^[a-f\d]{24}$/i,
    "A valid setting ID is required.",
  ),
});

export const settingKeyParamsSchema = z.object({
  key: settingKeySchema,
});

export const listSettingsQuerySchema = z.object({
  category: settingCategorySchema.optional(),
  isPublic: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  search: z.string().trim().max(150).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const settingCountQuerySchema = z.object({
  category: settingCategorySchema.optional(),
});

export const publicSettingsQuerySchema = z.object({
  category: settingCategorySchema.optional(),
});

export type CreateSettingValidatedInput = z.infer<
  typeof createSettingSchema
>;

export type UpdateSettingValidatedInput = z.infer<
  typeof updateSettingSchema
>;

export type SettingIdParams = z.infer<typeof settingIdParamsSchema>;

export type SettingKeyParams = z.infer<typeof settingKeyParamsSchema>;

export type ListSettingsValidatedQuery = z.infer<
  typeof listSettingsQuerySchema
>;

export type SettingCountValidatedQuery = z.infer<
  typeof settingCountQuerySchema
>;

export type PublicSettingsValidatedQuery = z.infer<
  typeof publicSettingsQuerySchema
>;
