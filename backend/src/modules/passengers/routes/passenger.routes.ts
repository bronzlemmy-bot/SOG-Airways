
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { passengerController } from "../controllers/passenger.controller.js";

import {
  createPassengerSchema,
  passengerCountQuerySchema,
  passengerCustomerParamSchema,
  passengerIdParamSchema,
  passengerListQuerySchema,
  updatePassengerSchema,
} from "../validations/passenger.validation.js";

const passengerRouter = Router();

const requirePassengerAdmin = [
  authenticate,
  authorize("admin", "super_admin"),
];

// Administrative statistics routes come before dynamic routes.
passengerRouter.get(
  "/admin/count",
  ...requirePassengerAdmin,
  validateRequest({ query: passengerCountQuerySchema }),
  passengerController.countPassengers,
);

passengerRouter.get(
  "/admin/statistics",
  ...requirePassengerAdmin,
  passengerController.getPassengerStatistics,
);

passengerRouter.get(
  "/admin/customer-counts",
  ...requirePassengerAdmin,
  passengerController.getPassengerCountsByCustomer,
);

// List and filter passengers.
passengerRouter.get(
  "/",
  ...requirePassengerAdmin,
  validateRequest({ query: passengerListQuerySchema }),
  passengerController.listPassengers,
);

// Retrieve all passenger profiles belonging to a customer.
passengerRouter.get(
  "/customer/:customerId",
  authenticate,
  validateRequest({ params: passengerCustomerParamSchema }),
  passengerController.getPassengersByCustomer,
);

// Create a passenger profile.
passengerRouter.post(
  "/",
  authenticate,
  validateRequest({ body: createPassengerSchema }),
  passengerController.createPassenger,
);

// Retrieve one passenger by ID.
passengerRouter.get(
  "/:id",
  authenticate,
  validateRequest({ params: passengerIdParamSchema }),
  passengerController.getPassengerById,
);

// Update a passenger profile.
passengerRouter.patch(
  "/:id",
  ...requirePassengerAdmin,
  validateRequest({
    params: passengerIdParamSchema,
    body: updatePassengerSchema,
  }),
  passengerController.updatePassenger,
);

// Delete a passenger profile.
passengerRouter.delete(
  "/:id",
  ...requirePassengerAdmin,
  validateRequest({ params: passengerIdParamSchema }),
  passengerController.deletePassenger,
);

export default passengerRouter;
