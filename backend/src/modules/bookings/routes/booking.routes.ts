
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { bookingController } from "../controllers/booking.controller.js";

import {
  bookingCountQuerySchema,
  createCustomerBookingSchema,
  bookingIdParamSchema,
  bookingProfileQuerySchema,
  bookingReferenceParamSchema,
  cancelBookingSchema,
  createBookingSchema,
  updateBookingSchema,
} from "../validations/booking.validation.js";

const bookingRouter = Router();

const requireBookingAdmin = [
  authenticate,
  authorize("admin", "super_admin"),
];

// Admin statistics routes must be declared before dynamic routes.
bookingRouter.get(
  "/admin/count",
  ...requireBookingAdmin,
  validateRequest({ query: bookingCountQuerySchema }),
  bookingController.countBookings,
);

bookingRouter.get(
  "/admin/statistics",
  ...requireBookingAdmin,
  bookingController.getBookingStatistics,
);

bookingRouter.get(
  "/admin/revenue",
  ...requireBookingAdmin,
  bookingController.getBookingRevenue,
);

// Retrieve bookings with pagination and optional filters.
bookingRouter.get(
  "/",
  ...requireBookingAdmin,
  validateRequest({ query: bookingProfileQuerySchema }),
  bookingController.listBookings,
);

bookingRouter.get(
  "/my-bookings",
  authenticate,
  bookingController.getMyBookings,
);

bookingRouter.post(
  "/checkout",
  authenticate,
  validateRequest({ body: createCustomerBookingSchema }),
  bookingController.createCustomerBooking,
);

bookingRouter.get(
  "/:id/details",
  authenticate,
  validateRequest({ params: bookingIdParamSchema }),
  bookingController.getBookingDetails,
);

// Booking references are only visible to the owner or an administrator.
bookingRouter.get(
  "/reference/:bookingReference",
  authenticate,
  validateRequest({ params: bookingReferenceParamSchema }),
  bookingController.getBookingByReference,
);

// Retrieve a booking by its MongoDB ID.
bookingRouter.get(
  "/:id",
  authenticate,
  validateRequest({ params: bookingIdParamSchema }),
  bookingController.getBookingById,
);

// Create a booking.
bookingRouter.post(
  "/",
  ...requireBookingAdmin,
  validateRequest({ body: createBookingSchema }),
  bookingController.createBooking,
);

// Update a booking.
bookingRouter.patch(
  "/:id",
  ...requireBookingAdmin,
  validateRequest({
    params: bookingIdParamSchema,
    body: updateBookingSchema,
  }),
  bookingController.updateBooking,
);

// Cancel a booking.
bookingRouter.patch(
  "/:id/cancel",
  authenticate,
  validateRequest({
    params: bookingIdParamSchema,
    body: cancelBookingSchema,
  }),
  bookingController.cancelBooking,
);

// Delete a booking.
bookingRouter.delete(
  "/:id",
  ...requireBookingAdmin,
  validateRequest({ params: bookingIdParamSchema }),
  bookingController.deleteBooking,
);

export default bookingRouter;
