
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { flightController } from "../controllers/flight.controller.js";

import {
  createFlightSchema,
  flightCountQuerySchema,
  flightIdParamSchema,
  flightNumberParamSchema,
  flightProfileQuerySchema,
  updateFlightSchema,
} from "../validations/flight.validation.js";

const flightRouter = Router();

const requireFlightAdmin = [
  authenticate,
  authorize("admin", "super_admin"),
];

// Public flight listing.
flightRouter.get(
  "/",
  validateRequest({ query: flightProfileQuerySchema }),
  flightController.listFlights,
);

// Admin statistics routes must appear before dynamic /:id routes.
flightRouter.get(
  "/admin/count",
  ...requireFlightAdmin,
  validateRequest({ query: flightCountQuerySchema }),
  flightController.countFlights,
);

flightRouter.get(
  "/admin/statistics",
  ...requireFlightAdmin,
  flightController.getFlightStatistics,
);

flightRouter.get(
  "/admin/route-statistics",
  ...requireFlightAdmin,
  flightController.getFlightRouteStatistics,
);

// Find a flight by its flight number.
flightRouter.get(
  "/number/:flightNumber",
  validateRequest({ params: flightNumberParamSchema }),
  flightController.getFlightByNumber,
);

// Find a flight by its MongoDB ID.
flightRouter.get(
  "/:id",
  validateRequest({ params: flightIdParamSchema }),
  flightController.getFlightById,
);

// Create a flight.
flightRouter.post(
  "/",
  ...requireFlightAdmin,
  validateRequest({ body: createFlightSchema }),
  flightController.createFlight,
);

// Update a flight.
flightRouter.patch(
  "/:id",
  ...requireFlightAdmin,
  validateRequest({
    params: flightIdParamSchema,
    body: updateFlightSchema,
  }),
  flightController.updateFlight,
);

// Delete a flight.
flightRouter.delete(
  "/:id",
  ...requireFlightAdmin,
  validateRequest({ params: flightIdParamSchema }),
  flightController.deleteFlight,
);

export default flightRouter;
