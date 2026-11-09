
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  createAirport,
  getAirportById,
  getAirportByCode,
  updateAirport,
  listAirports,
  deleteAirport,
  countAirports,
} from "../controllers/airport.controller.js";

import {
  createAirportSchema,
  updateAirportSchema,
  airportIdParamSchema,
  airportCodeParamSchema,
  airportProfileQuerySchema,
} from "../validations/airport.validation.js";

const airportRouter = Router();

// Public airport lookups support flight searches and booking.
airportRouter.get(
  "/",
  validateRequest({ query: airportProfileQuerySchema }),
  listAirports,
);

// Keep specific routes before parameterized routes.
airportRouter.get(
  "/code/:airportCode",
  validateRequest({ params: airportCodeParamSchema }),
  getAirportByCode,
);

// Administrative endpoints require authentication and authorization.
airportRouter.get(
  "/count",
  authenticate,
  authorize("admin", "super_admin"),
  countAirports,
);

airportRouter.post(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ body: createAirportSchema }),
  createAirport,
);

airportRouter.get(
  "/:airportId",
  validateRequest({ params: airportIdParamSchema }),
  getAirportById,
);

airportRouter.patch(
  "/:airportId",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({
    params: airportIdParamSchema,
    body: updateAirportSchema,
  }),
  updateAirport,
);

airportRouter.delete(
  "/:airportId",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ params: airportIdParamSchema }),
  deleteAirport,
);

export default airportRouter;
