
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  cancelCheckIn,
  countCheckIns,
  createCheckIn,
  deleteCheckIn,
  getCheckInById,
  getCheckInByReference,
  getCheckInsByBooking,
  getCheckInsByFlight,
  getMyCheckIns,
  issueBoardingPass,
  listCheckIns,
  markBoardingPassUsed,
  updateCheckIn,
} from "../controllers/check-in.controller.js";

import {
  bookingIdParamsSchema,
  cancelCheckInSchema,
  checkInCountQuerySchema,
  checkInIdParamsSchema,
  checkInListQuerySchema,
  checkInReferenceParamsSchema,
  createCheckInSchema,
  flightIdParamsSchema,
  updateCheckInSchema,
} from "../validations/check-in.validation.js";

const checkInRouter = Router();

/**
 * Customer routes
 */
checkInRouter.get(
  "/my-check-ins",
  authenticate,
  validateRequest({ query: checkInListQuerySchema }),
  getMyCheckIns,
);

checkInRouter.get(
  "/reference/:checkInReference",
  authenticate,
  validateRequest({ params: checkInReferenceParamsSchema }),
  getCheckInByReference,
);

/**
 * Administrative routes
 */
checkInRouter.get(
  "/count",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ query: checkInCountQuerySchema }),
  countCheckIns,
);

checkInRouter.get(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ query: checkInListQuerySchema }),
  listCheckIns,
);

checkInRouter.get(
  "/booking/:bookingId",
  authenticate,
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: bookingIdParamsSchema }),
  getCheckInsByBooking,
);

checkInRouter.get(
  "/flight/:flightId",
  authenticate,
  authorize("admin", "super_admin", "staff"),
  validateRequest({
    params: flightIdParamsSchema,
    query: checkInListQuerySchema,
  }),
  getCheckInsByFlight,
);

checkInRouter.get(
  "/:checkInId",
  authenticate,
  validateRequest({ params: checkInIdParamsSchema }),
  getCheckInById,
);

checkInRouter.post(
  "/",
  authenticate,
  authorize("admin", "super_admin", "staff"),
  validateRequest({ body: createCheckInSchema }),
  createCheckIn,
);

checkInRouter.patch(
  "/:checkInId/cancel",
  authenticate,
  validateRequest({
    params: checkInIdParamsSchema,
    body: cancelCheckInSchema,
  }),
  cancelCheckIn,
);

checkInRouter.patch(
  "/:checkInId/boarding-pass/issue",
  authenticate,
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: checkInIdParamsSchema }),
  issueBoardingPass,
);

checkInRouter.patch(
  "/:checkInId/boarding-pass/use",
  authenticate,
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: checkInIdParamsSchema }),
  markBoardingPassUsed,
);

checkInRouter.patch(
  "/:checkInId",
  authenticate,
  authorize("admin", "super_admin", "staff"),
  validateRequest({
    params: checkInIdParamsSchema,
    body: updateCheckInSchema,
  }),
  updateCheckIn,
);

checkInRouter.delete(
  "/:checkInId",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ params: checkInIdParamsSchema }),
  deleteCheckIn,
);

export default checkInRouter;
