
import { Router } from "express";
import { z } from "zod";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { messageController } from "../controllers/message.controller.js";

import {
  createMessageSchema,
  messageIdParamsSchema,
  messageListQuerySchema,
  updateMessageSchema,
} from "../validations/message.validation.js";

const messageRouter = Router();

const conversationIdParamsSchema = z
  .object({
    conversationId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "A valid conversation ID is required."),
  })
  .strict();

const markMessageFailedSchema = z
  .object({
    reason: z.string().trim().min(1).max(500),
  })
  .strict();

messageRouter.use(authenticate);

// Send a message within a conversation.
messageRouter.post(
  "/",
  validateRequest({ body: createMessageSchema }),
  messageController.create,
);

// List messages accessible to the authenticated user.
messageRouter.get(
  "/",
  validateRequest({ query: messageListQuerySchema }),
  messageController.list,
);

// Message statistics for the authenticated user's received messages.
messageRouter.get("/stats", messageController.getStats);

// List messages in a conversation the authenticated user participates in.
messageRouter.get(
  "/conversation/:conversationId",
  validateRequest({
    params: conversationIdParamsSchema,
    query: messageListQuerySchema,
  }),
  messageController.listByConversation,
);

// Mark a message as read.
messageRouter.patch(
  "/:messageId/read",
  validateRequest({ params: messageIdParamsSchema }),
  messageController.markAsRead,
);

// Record successful message delivery.
// Restrict this operation to trusted staff/admin roles.
messageRouter.patch(
  "/:messageId/delivered",
  authorize("staff", "admin", "super_admin"),
  validateRequest({ params: messageIdParamsSchema }),
  messageController.markAsDelivered,
);

// Record a delivery failure.
messageRouter.patch(
  "/:messageId/failed",
  authorize("staff", "admin", "super_admin"),
  validateRequest({
    params: messageIdParamsSchema,
    body: markMessageFailedSchema,
  }),
  messageController.markAsFailed,
);

// Update message content or supported fields.
// Restrict general updates to staff/admin roles.
messageRouter.patch(
  "/:messageId",
  authorize("staff", "admin", "super_admin"),
  validateRequest({
    params: messageIdParamsSchema,
    body: updateMessageSchema,
  }),
  messageController.update,
);

// Retrieve a specific message after service-level access checks.
messageRouter.get(
  "/:messageId",
  validateRequest({ params: messageIdParamsSchema }),
  messageController.getById,
);

// Delete a message; the service checks sender ownership.
messageRouter.delete(
  "/:messageId",
  validateRequest({ params: messageIdParamsSchema }),
  messageController.delete,
);

export default messageRouter;
