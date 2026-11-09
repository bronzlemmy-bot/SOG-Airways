
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { trackingController } from "../controllers/tracking.controller.js";

import {
  createFlightTrackingSchema,
  trackingFlightLookupSchema,
  trackingHistoryParamsSchema,
  trackingListQuerySchema,
  updateFlightPositionSchema,
  updateFlightTrackingStatusSchema,
} from "../validations/tracking.validation.js";

const router = Router();

const flightIdParamsSchema =
  trackingHistoryParamsSchema.shape.params;

/**
 * GET /tracking
 * List tracking records with pagination and filters.
 */
router.get(
  "/",
  validateRequest({
    query: trackingListQuerySchema.shape.query,
  }),
  trackingController.listTracking,
);

/**
 * GET /tracking/flight/:flightNumber
 * Look up tracking by flight number.
 */
router.get(
  "/flight/:flightNumber",
  validateRequest({ params: trackingFlightLookupSchema.shape.params }),
  trackingController.getTracking,
);

/**
 * GET /tracking/:flightId/history
 * Retrieve tracking status and event history.
 */
router.get(
  "/:flightId/history",
  validateRequest({
    params: flightIdParamsSchema,
  }),
  trackingController.getTrackingHistory,
);

/**
 * GET /tracking/:flightId
 * Retrieve a tracking record by flight ID.
 */
router.get(
  "/:flightId",
  validateRequest({
    params: flightIdParamsSchema,
  }),
  trackingController.getTracking,
);

/**
 * POST /tracking
 * Create a tracking record.
 */
router.post(
  "/",
  authenticate,
  authorize("staff", "admin", "super_admin"),
  validateRequest({
    body: createFlightTrackingSchema.shape.body,
  }),
  trackingController.createTracking,
);

/**
 * PATCH /tracking/:flightId/position
 * Update the current aircraft position.
 */
router.patch(
  "/:flightId/position",
  authenticate,
  authorize("staff", "admin", "super_admin"),
  validateRequest({
    params: updateFlightPositionSchema.shape.params,
    body: updateFlightPositionSchema.shape.body,
  }),
  trackingController.updatePosition,
);

/**
 * PATCH /tracking/:flightId/status
 * Update flight status and append a tracking event.
 */
router.patch(
  "/:flightId/status",
  authenticate,
  authorize("staff", "admin", "super_admin"),
  validateRequest({
    params: updateFlightTrackingStatusSchema.shape.params,
    body: updateFlightTrackingStatusSchema.shape.body,
  }),
  trackingController.updateStatus,
);

/**
 * DELETE /tracking/:flightId
 * Delete a tracking record.
 */
router.delete(
  "/:flightId",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({
    params: flightIdParamsSchema,
  }),
  trackingController.deleteTracking,
);

export default router;
