
import { z } from "zod";
import {
  MESSAGE_PRIORITIES,
  MESSAGE_STATUSES,
  MESSAGE_TYPES,
} from "../models/message.model.js";

const objectIdSchema = z.string().regex(
  /^[a-f\d]{24}$/i,
  "A valid MongoDB ID is required.",
);

const attachmentSchema = z
  .object({
    url: z.string().trim().url().max(2048),
    fileName: z.string().trim().min(1).max(255),
    mimeType: z.string().trim().min(1).max(120),
    size: z.number().int().min(1),
  })
  .strict();

const metadataSchema = z.record(z.string(), z.unknown()).optional();

export const createMessageSchema = z
  .object({
    conversationId: objectIdSchema,
    recipient: objectIdSchema.nullable().optional(),
    subject: z.string().trim().min(1).max(200).nullable().optional(),
    body: z.string().trim().min(1).max(10000),
    type: z.enum(MESSAGE_TYPES).optional(),
    priority: z.enum(MESSAGE_PRIORITIES).optional(),
    booking: objectIdSchema.nullable().optional(),
    attachments: z.array(attachmentSchema).max(10).optional(),
    metadata: metadataSchema,
  })
  .strict();

export const updateMessageSchema = z
  .object({
    subject: z.string().trim().min(1).max(200).nullable().optional(),
    body: z.string().trim().min(1).max(10000).optional(),
    status: z.enum(MESSAGE_STATUSES).optional(),
    priority: z.enum(MESSAGE_PRIORITIES).optional(),
    attachments: z.array(attachmentSchema).max(10).optional(),
    failedReason: z.string().trim().max(500).nullable().optional(),
    metadata: metadataSchema,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

export const messageListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    conversationId: objectIdSchema.optional(),
    sender: objectIdSchema.optional(),
    recipient: objectIdSchema.optional(),
    booking: objectIdSchema.optional(),
    type: z.enum(MESSAGE_TYPES).optional(),
    status: z.enum(MESSAGE_STATUSES).optional(),
    priority: z.enum(MESSAGE_PRIORITIES).optional(),
    search: z.string().trim().max(200).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
  .refine(
    (query) =>
      !query.fromDate ||
      !query.toDate ||
      query.fromDate <= query.toDate,
    {
      path: ["toDate"],
      message: "End date must be on or after the start date.",
    },
  );

export const messageIdParamsSchema = z
  .object({
    messageId: objectIdSchema,
  })
  .strict();

export const markMessageReadSchema = z
  .object({
    status: z.literal("read"),
  })
  .strict();

export type CreateMessageValidatedInput = z.infer<
  typeof createMessageSchema
>;

export type UpdateMessageValidatedInput = z.infer<
  typeof updateMessageSchema
>;

export type MessageListValidatedQuery = z.infer<
  typeof messageListQuerySchema
>;

export type MessageIdValidatedParams = z.infer<
  typeof messageIdParamsSchema
>;
