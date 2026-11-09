
import { Router } from "express";
import { z } from "zod";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { contactController } from "../controllers/contact.controller.js";

import {
  CONTACT_CATEGORIES,
  CONTACT_STATUSES,
} from "../models/contact-inquiry.model.js";

import {
  contactCountQuerySchema,
  contactIdParamsSchema,
  contactListQuerySchema,
  contactReferenceParamsSchema,
  createContactSchema,
  updateContactSchema,
} from "../validations/contact.validation.js";

const contactRouter = Router();

const adminOnly = [
  authenticate,
  authorize("admin", "super_admin"),
];

const emailQuerySchema = z
  .object({
    email: z.string().trim().email().max(254),
  })
  .strict();

const statusUpdateSchema = z
  .object({
    status: z.enum(CONTACT_STATUSES),
  })
  .strict();

const assignmentSchema = z
  .object({
    staffUserId: z
      .string()
      .trim()
      .regex(/^[a-f\d]{24}$/i, "A valid staff user ID is required."),
  })
  .strict();

const statusCountSchema = z
  .object({
    status: z.enum(CONTACT_STATUSES),
    customer: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    assignedTo: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (query) =>
      !query.createdFrom ||
      !query.createdTo ||
      query.createdFrom <= query.createdTo,
    {
      message: "createdFrom cannot be later than createdTo.",
      path: ["createdFrom"],
    },
  );

const categoryCountSchema = z
  .object({
    category: z.enum(CONTACT_CATEGORIES),
    customer: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    assignedTo: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (query) =>
      !query.createdFrom ||
      !query.createdTo ||
      query.createdFrom <= query.createdTo,
    {
      message: "createdFrom cannot be later than createdTo.",
      path: ["createdFrom"],
    },
  );

// Public: submit a contact form.
contactRouter.post(
  "/",
  validateRequest({ body: createContactSchema }),
  contactController.createContact,
);

// Public: look up a contact submission by its reference.
contactRouter.get(
  "/reference/:reference",
  validateRequest({ params: contactReferenceParamsSchema }),
  contactController.getContactByReference,
);

// Admin: aggregate statistics.
contactRouter.get(
  "/counts",
  ...adminOnly,
  validateRequest({ query: contactCountQuerySchema }),
  contactController.getContactCounts,
);

contactRouter.get(
  "/count",
  ...adminOnly,
  validateRequest({ query: contactCountQuerySchema }),
  contactController.getContactCount,
);

contactRouter.get(
  "/count/status",
  ...adminOnly,
  validateRequest({ query: statusCountSchema }),
  contactController.getCountByStatus,
);

contactRouter.get(
  "/count/category",
  ...adminOnly,
  validateRequest({ query: categoryCountSchema }),
  contactController.getCountByCategory,
);

// Admin: search and manage submissions.
contactRouter.get(
  "/",
  ...adminOnly,
  validateRequest({ query: contactListQuerySchema }),
  contactController.getContacts,
);

contactRouter.get(
  "/by-email",
  ...adminOnly,
  validateRequest({ query: emailQuerySchema }),
  contactController.getContactsByEmail,
);

contactRouter.get(
  "/:contactId",
  ...adminOnly,
  validateRequest({ params: contactIdParamsSchema }),
  contactController.getContactById,
);

contactRouter.patch(
  "/:contactId/status",
  ...adminOnly,
  validateRequest({
    params: contactIdParamsSchema,
    body: statusUpdateSchema,
  }),
  contactController.changeContactStatus,
);

contactRouter.patch(
  "/:contactId/assign",
  ...adminOnly,
  validateRequest({
    params: contactIdParamsSchema,
    body: assignmentSchema,
  }),
  contactController.assignContact,
);

contactRouter.patch(
  "/:contactId/unassign",
  ...adminOnly,
  validateRequest({ params: contactIdParamsSchema }),
  contactController.unassignContact,
);

contactRouter.patch(
  "/:contactId",
  ...adminOnly,
  validateRequest({
    params: contactIdParamsSchema,
    body: updateContactSchema,
  }),
  contactController.updateContact,
);

contactRouter.delete(
  "/:contactId",
  ...adminOnly,
  validateRequest({ params: contactIdParamsSchema }),
  contactController.deleteContact,
);

export default contactRouter;
