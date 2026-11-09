
import { z } from "zod";
import {
  CONVERSATION_CHANNELS,
  CONVERSATION_PRIORITIES,
  CONVERSATION_STATUSES,
} from "../models/conversation.model.js";

const objectIdSchema = z.string().regex(
  /^[a-f\d]{24}$/i,
  "A valid MongoDB ID is required.",
);

const metadataSchema = z.record(z.string(), z.unknown()).optional();

export const createConversationSchema = z
  .object({
    subject: z.string().trim().min(1).max(200),
    participants: z.array(objectIdSchema).min(1).max(50),
    assignedTo: objectIdSchema.nullable().optional(),
    booking: objectIdSchema.nullable().optional(),
    priority: z.enum(CONVERSATION_PRIORITIES).optional(),
    channel: z.enum(CONVERSATION_CHANNELS).optional(),
    tags: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
    metadata: metadataSchema,
  })
  .strict()
  .superRefine((data, context) => {
    if (new Set(data.participants).size !== data.participants.length) {
      context.addIssue({
        code: "custom",
        path: ["participants"],
        message: "Participants must not contain duplicate IDs.",
      });
    }
  });

export const updateConversationSchema = z
  .object({
    subject: z.string().trim().min(1).max(200).optional(),
    participants: z.array(objectIdSchema).min(1).max(50).optional(),
    assignedTo: objectIdSchema.nullable().optional(),
    booking: objectIdSchema.nullable().optional(),
    status: z.enum(CONVERSATION_STATUSES).optional(),
    priority: z.enum(CONVERSATION_PRIORITIES).optional(),
    channel: z.enum(CONVERSATION_CHANNELS).optional(),
    tags: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
    metadata: metadataSchema,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  })
  .superRefine((data, context) => {
    if (
      data.participants &&
      new Set(data.participants).size !== data.participants.length
    ) {
      context.addIssue({
        code: "custom",
        path: ["participants"],
        message: "Participants must not contain duplicate IDs.",
      });
    }
  });

export const conversationListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    participant: objectIdSchema.optional(),
    createdBy: objectIdSchema.optional(),
    assignedTo: objectIdSchema.optional(),
    booking: objectIdSchema.optional(),
    status: z.enum(CONVERSATION_STATUSES).optional(),
    priority: z.enum(CONVERSATION_PRIORITIES).optional(),
    channel: z.enum(CONVERSATION_CHANNELS).optional(),
    tag: z.string().trim().min(1).max(50).optional(),
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

export const conversationIdParamsSchema = z
  .object({
    conversationId: objectIdSchema,
  })
  .strict();

export const updateConversationStatusSchema = z
  .object({
    status: z.enum(CONVERSATION_STATUSES),
  })
  .strict();

export type CreateConversationValidatedInput = z.infer<
  typeof createConversationSchema
>;

export type UpdateConversationValidatedInput = z.infer<
  typeof updateConversationSchema
>;

export type ConversationListValidatedQuery = z.infer<
  typeof conversationListQuerySchema
>;

export type ConversationIdValidatedParams = z.infer<
  typeof conversationIdParamsSchema
>;

export type UpdateConversationStatusValidatedInput = z.infer<
  typeof updateConversationStatusSchema
>;
