
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  addSupportMessage,
  createSupportCase,
  deleteSupportCase,
  getSupportCaseById,
  getSupportCaseByNumber,
  getSupportCaseCounts,
  listSupportCases,
  updateSupportCase,
} from "../controllers/support.controller.js";

import {
  addSupportMessageSchema,
  createSupportCaseSchema,
  listSupportCasesQuerySchema,
  supportCaseCountQuerySchema,
  supportCaseIdParamsSchema,
  supportCaseNumberParamsSchema,
  updateSupportCaseSchema,
} from "../validations/support.validation.js";

const router = Router();

const supportStaffRoles = ["staff", "admin", "super_admin"] as const;

// All support endpoints require an authenticated user.
router.use(authenticate);

// Create a support case.
router.post(
  "/",
  validateRequest({
    body: createSupportCaseSchema.shape.body,
  }),
  createSupportCase,
);

// List support cases.
router.get(
  "/",
  validateRequest({
    query: listSupportCasesQuerySchema.shape.query,
  }),
  listSupportCases,
);

// Retrieve support case statistics.
router.get(
  "/counts",
  validateRequest({
    query: supportCaseCountQuerySchema.shape.query,
  }),
  getSupportCaseCounts,
);

// Retrieve a support case by its public case number.
router.get(
  "/case-number/:caseNumber",
  validateRequest({
    params: supportCaseNumberParamsSchema.shape.params,
  }),
  getSupportCaseByNumber,
);

// Retrieve a support case by MongoDB ID.
router.get(
  "/:caseId",
  validateRequest({
    params: supportCaseIdParamsSchema.shape.params,
  }),
  getSupportCaseById,
);

// Add a message to a support case.
router.post(
  "/:caseId/messages",
  validateRequest({
    params: addSupportMessageSchema.shape.params,
    body: addSupportMessageSchema.shape.body,
  }),
  addSupportMessage,
);

// Update a support case; restricted to support staff and administrators.
router.patch(
  "/:caseId",
  authorize(...supportStaffRoles),
  validateRequest({
    params: updateSupportCaseSchema.shape.params,
    body: updateSupportCaseSchema.shape.body,
  }),
  updateSupportCase,
);

// Delete a support case; restricted to support staff and administrators.
router.delete(
  "/:caseId",
  authorize(...supportStaffRoles),
  validateRequest({
    params: supportCaseIdParamsSchema.shape.params,
  }),
  deleteSupportCase,
);

export default router;
