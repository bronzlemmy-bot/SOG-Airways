
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  createCustomerUser,
  getUserById,
  updateUserProfile,
} from "../controllers/user.controller.js";

import {
  createCustomerUserSchema,
  updateUserProfileSchema,
  userIdParamSchema,
} from "../validations/user.validation.js";

const router = Router();

/**
 * POST /
 * Create a customer account.
 */
router.post(
  "/",
  validateRequest({
    body: createCustomerUserSchema,
  }),
  createCustomerUser,
);

/**
 * GET /:id
 * Retrieve a user profile.
 * Requires authentication and profile ownership or administrator access.
 */
router.get(
  "/:id",
  authenticate,
  validateRequest({
    params: userIdParamSchema,
  }),
  getUserById,
);

/**
 * PATCH /:id
 * Update a user profile.
 * Requires authentication and profile ownership or administrator access.
 */
router.patch(
  "/:id",
  authenticate,
  validateRequest({
    params: userIdParamSchema,
    body: updateUserProfileSchema,
  }),
  updateUserProfile,
);

export default router;
