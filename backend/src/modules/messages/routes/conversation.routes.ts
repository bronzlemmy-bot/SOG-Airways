
import { Router } from "express";
import { z } from "zod";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { conversationController } from "../controllers/conversation.controller.js";

import {
  conversationIdParamsSchema,
  conversationListQuerySchema,
  createConversationSchema,
  updateConversationSchema,
  updateConversationStatusSchema,
} from "../validations/conversation.validation.js";

const conversationRouter = Router();

const assignmentSchema = z
  .object({
    assignedTo: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "A valid MongoDB ID is required.")
      .nullable(),
  })
  .strict();

conversationRouter.use(authenticate);

// Create a conversation.
conversationRouter.post(
  "/",
  validateRequest({ body: createConversationSchema }),
  conversationController.create,
);

// List all conversations for authorized staff.
conversationRouter.get(
  "/",
  authorize("staff", "admin", "super_admin"),
  validateRequest({ query: conversationListQuerySchema }),
  conversationController.list,
);

// List conversations belonging to the authenticated user.
conversationRouter.get(
  "/mine",
  validateRequest({ query: conversationListQuerySchema }),
  conversationController.listMine,
);

// Get the authenticated user's unread conversation count.
conversationRouter.get(
  "/mine/unread-count",
  conversationController.getUnreadCount,
);

// Conversation statistics for authorized staff.
conversationRouter.get(
  "/stats",
  authorize("staff", "admin", "super_admin"),
  conversationController.getStats,
);

// Total conversation count for authorized staff.
conversationRouter.get(
  "/count",
  authorize("staff", "admin", "super_admin"),
  conversationController.count,
);

// Update conversation status.
conversationRouter.patch(
  "/:conversationId/status",
  authorize("staff", "admin", "super_admin"),
  validateRequest({
    params: conversationIdParamsSchema,
    body: updateConversationStatusSchema,
  }),
  conversationController.updateStatus,
);

// Assign or unassign a conversation.
conversationRouter.patch(
  "/:conversationId/assign",
  authorize("admin", "super_admin"),
  validateRequest({
    params: conversationIdParamsSchema,
    body: assignmentSchema,
  }),
  conversationController.assign,
);

// Mark a conversation's messages as read.
conversationRouter.post(
  "/:conversationId/read",
  validateRequest({ params: conversationIdParamsSchema }),
  conversationController.markAsRead,
);

// Retrieve one conversation.
conversationRouter.get(
  "/:conversationId",
  validateRequest({ params: conversationIdParamsSchema }),
  conversationController.getById,
);

// Update conversation details.
conversationRouter.patch(
  "/:conversationId",
  validateRequest({
    params: conversationIdParamsSchema,
    body: updateConversationSchema,
  }),
  conversationController.update,
);

// Delete a conversation and its associated messages.
conversationRouter.delete(
  "/:conversationId",
  authorize("admin", "super_admin"),
  validateRequest({ params: conversationIdParamsSchema }),
  conversationController.delete,
);

export default conversationRouter;
