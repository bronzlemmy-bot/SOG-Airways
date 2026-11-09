
import { z } from "zod";

import {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_TYPES,
} from "../models/notification.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.");

const notificationTypeSchema = z.enum(NOTIFICATION_TYPES);
const notificationPrioritySchema = z.enum(
  NOTIFICATION_PRIORITIES,
);
const notificationStatusSchema = z.enum(
  NOTIFICATION_STATUSES,
);

const metadataSchema = z.record(z.string(), z.unknown());

const relatedEntitySchema = z
  .object({
    entityType: z.string().trim().min(1).max(100).nullable().optional(),
    entityId: objectIdSchema.nullable().optional(),
  })
  .strict();

const actionUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) =>
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.includes("\\"),
    "Action URL must be a relative application path.",
  )
  .nullable();

export const createNotificationSchema = z
  .object({
    recipient: objectIdSchema,
    type: notificationTypeSchema.optional().default("system"),
    title: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(5000),
    priority: notificationPrioritySchema.optional().default("normal"),
    actionUrl: actionUrlSchema.optional(),
    relatedEntity: relatedEntitySchema.optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    metadata: metadataSchema.optional(),
  })
  .strict();

export const updateNotificationSchema = z
  .object({
    type: notificationTypeSchema.optional(),
    title: z.string().trim().min(1).max(200).optional(),
    message: z.string().trim().min(1).max(5000).optional(),
    priority: notificationPrioritySchema.optional(),
    status: notificationStatusSchema.optional(),
    actionUrl: actionUrlSchema.optional(),
    relatedEntity: relatedEntitySchema.optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    metadata: metadataSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

export const notificationListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    recipient: objectIdSchema.optional(),
    type: notificationTypeSchema.optional(),
    priority: notificationPrioritySchema.optional(),
    status: notificationStatusSchema.optional(),
    search: z.string().trim().max(200).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
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

export const notificationIdParamsSchema = z
  .object({
    notificationId: objectIdSchema,
  })
  .strict();

export const markNotificationsReadSchema = z
  .object({
    notificationIds: z
      .array(objectIdSchema)
      .min(1)
      .max(100)
      .optional(),
  })
  .strict();

export const notificationCountQuerySchema = z
  .object({
    recipient: objectIdSchema.optional(),
    type: notificationTypeSchema.optional(),
    priority: notificationPrioritySchema.optional(),
    status: notificationStatusSchema.optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
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

export type CreateNotificationValidatedInput = z.infer<
  typeof createNotificationSchema
>;

export type UpdateNotificationValidatedInput = z.infer<
  typeof updateNotificationSchema
>;

export type NotificationListValidatedQuery = z.infer<
  typeof notificationListQuerySchema
>;

export type NotificationIdValidatedParams = z.infer<
  typeof notificationIdParamsSchema
>;

export type MarkNotificationsReadValidatedInput = z.infer<
  typeof markNotificationsReadSchema
>;

export type NotificationCountValidatedQuery = z.infer<
  typeof notificationCountQuerySchema
>;
