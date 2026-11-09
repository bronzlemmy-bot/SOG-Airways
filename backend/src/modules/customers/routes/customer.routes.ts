
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  getMyCustomerProfile,
  createMyCustomerProfile,
  updateMyCustomerProfile,
  getCustomerProfileByUserId,
  listCustomerProfiles,
  checkLoyaltyNumberAvailability,
  countCustomerProfiles,
  validateCustomerId,
} from "../controllers/customer.controller.js";

import {
  createCustomerProfileSchema,
  updateCustomerProfileSchema,
  customerProfileQuerySchema,
} from "../validations/customer.validation.js";

const router = Router();

/**
 * Customer profile endpoints
 * Base path: /api/v1/customers
 */

/**
 * GET /
 * List customer profiles.
 * Administrator access only.
 */
router.get(
  "/",
  authenticate,
  authorize("admin"),
  validateRequest({
    query: customerProfileQuerySchema,
  }),
  listCustomerProfiles,
);

/**
 * GET /count
 * Count customer profiles.
 * Administrator access only.
 */
router.get(
  "/count",
  authenticate,
  authorize("admin"),
  countCustomerProfiles,
);

/**
 * GET /loyalty-number/availability
 * Check whether a loyalty number is available.
 * Requires authentication.
 */
router.get(
  "/loyalty-number/availability",
  authenticate,
  checkLoyaltyNumberAvailability,
);

/**
 * GET /me
 * Retrieve the authenticated customer's profile.
 */
router.get(
  "/me",
  authenticate,
  getMyCustomerProfile,
);

/**
 * POST /me
 * Create the authenticated customer's profile.
 */
router.post(
  "/me",
  authenticate,
  validateRequest({
    body: createCustomerProfileSchema,
  }),
  createMyCustomerProfile,
);

/**
 * PATCH /me
 * Update the authenticated customer's preferences.
 */
router.patch(
  "/me",
  authenticate,
  validateRequest({
    body: updateCustomerProfileSchema,
  }),
  updateMyCustomerProfile,
);

/**
 * GET /user/:userId
 * Retrieve a customer's profile by user ID.
 * Administrator access only.
 */
router.get(
  "/user/:userId",
  authenticate,
  authorize("admin"),
  getCustomerProfileByUserId,
);

export default router;
