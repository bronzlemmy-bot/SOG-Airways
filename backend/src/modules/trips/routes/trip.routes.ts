
import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";
import { tripController } from "../controllers/trip.controller.js";
import {
  cancelTripSchema,
  createTripSchema,
  tripCountQuerySchema,
  tripIdParamsSchema,
  tripListQuerySchema,
  tripBookingParamsSchema,
  tripReferenceParamsSchema,
  updateTripSchema,
} from "../validations/trip.validation.js";

const tripRouter = Router();

// All trip endpoints require authentication.
tripRouter.use(authenticate);

// Statistics and collection endpoints.
tripRouter.get(
  "/my-trips",
  validateRequest({ query: tripListQuerySchema }),
  tripController.getMyTrips,
);

tripRouter.get(
  "/my-trips/booking/:bookingId",
  validateRequest({ params: tripBookingParamsSchema }),
  tripController.getMyTripByBooking,
);

tripRouter.get(
  "/stats",
  authorize("admin", "super_admin"),
  validateRequest({ query: tripCountQuerySchema }),
  tripController.getTripCounts,
);

tripRouter.get(
  "/count",
  authorize("admin", "super_admin"),
  validateRequest({ query: tripCountQuerySchema }),
  tripController.countTrips,
);

tripRouter.get(
  "/",
  authorize("admin", "super_admin", "staff"),
  validateRequest({ query: tripListQuerySchema }),
  tripController.getTrips,
);

tripRouter.post(
  "/",
  authorize("admin", "super_admin", "staff"),
  validateRequest({ body: createTripSchema }),
  tripController.createTrip,
);

// Booking lookup must be registered before parameterized routes.
tripRouter.get(
  "/booking/:bookingId",
  authorize("admin", "super_admin", "staff"),
  tripController.getTripsByBooking,
);

tripRouter.get(
  "/reference/:tripReference",
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: tripReferenceParamsSchema }),
  tripController.getTripByReference,
);

// Individual trip operations.
tripRouter.get(
  "/:tripId",
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: tripIdParamsSchema }),
  tripController.getTripById,
);

tripRouter.patch(
  "/:tripId",
  authorize("admin", "super_admin", "staff"),
  validateRequest({
    params: tripIdParamsSchema,
    body: updateTripSchema,
  }),
  tripController.updateTrip,
);

tripRouter.patch(
  "/:tripId/cancel",
  authorize("admin", "super_admin", "staff"),
  validateRequest({
    params: tripIdParamsSchema,
    body: cancelTripSchema,
  }),
  tripController.cancelTrip,
);

tripRouter.delete(
  "/:tripId",
  authorize("admin", "super_admin"),
  validateRequest({ params: tripIdParamsSchema }),
  tripController.deleteTrip,
);

export default tripRouter;
