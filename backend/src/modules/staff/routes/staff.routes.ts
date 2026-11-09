
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  createStaffProfile,
  getStaffProfileById,
  getStaffProfileByUserId,
  updateStaffProfile,
  listStaffProfiles,
  deleteStaffProfile,
  countStaffProfiles,
} from "../controllers/staff.controller.js";

import {
  createStaffSchema,
  updateStaffSchema,
  staffIdParamSchema,
  staffUserIdParamSchema,
  staffProfileQuerySchema,
} from "../validations/staff.validation.js";

const staffRouter = Router();

// All staff management endpoints require an authenticated administrator.
staffRouter.use(authenticate, authorize("admin", "super_admin"));

// GET /api/v1/staff/count
staffRouter.get("/count", countStaffProfiles);

// GET /api/v1/staff
staffRouter.get(
  "/",
  validateRequest({ query: staffProfileQuerySchema }),
  listStaffProfiles,
);

// POST /api/v1/staff
staffRouter.post(
  "/",
  validateRequest({ body: createStaffSchema }),
  createStaffProfile,
);

// GET /api/v1/staff/user/:userId
staffRouter.get(
  "/user/:userId",
  validateRequest({ params: staffUserIdParamSchema }),
  getStaffProfileByUserId,
);

// GET /api/v1/staff/:staffId
staffRouter.get(
  "/:staffId",
  validateRequest({ params: staffIdParamSchema }),
  getStaffProfileById,
);

// PATCH /api/v1/staff/:staffId
staffRouter.patch(
  "/:staffId",
  validateRequest({
    params: staffIdParamSchema,
    body: updateStaffSchema,
  }),
  updateStaffProfile,
);

// DELETE /api/v1/staff/:staffId
staffRouter.delete(
  "/:staffId",
  validateRequest({ params: staffIdParamSchema }),
  deleteStaffProfile,
);

export default staffRouter;
