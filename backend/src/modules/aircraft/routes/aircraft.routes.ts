
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { aircraftController } from "../controllers/aircraft.controller.js";

import {
  aircraftCountQuerySchema,
  aircraftIdParamSchema,
  aircraftProfileQuerySchema,
  aircraftRegistrationParamSchema,
  createAircraftSchema,
  updateAircraftSchema,
} from "../validations/aircraft.validation.js";

const aircraftRouter = Router();

// Public aircraft listing and individual aircraft lookup.
aircraftRouter.get(
  "/",
  validateRequest({ query: aircraftProfileQuerySchema }),
  aircraftController.listAircraft,
);

aircraftRouter.get(
  "/registration/:registrationNumber",
  validateRequest({ params: aircraftRegistrationParamSchema }),
  aircraftController.getAircraftByRegistrationNumber,
);

aircraftRouter.get(
  "/:id",
  validateRequest({ params: aircraftIdParamSchema }),
  aircraftController.getAircraftById,
);

// All management operations require an authenticated administrator.
aircraftRouter.use(authenticate);
aircraftRouter.use(authorize("admin", "super_admin"));

aircraftRouter.post(
  "/",
  validateRequest({ body: createAircraftSchema }),
  aircraftController.createAircraft,
);

aircraftRouter.patch(
  "/:id",
  validateRequest({
    params: aircraftIdParamSchema,
    body: updateAircraftSchema,
  }),
  aircraftController.updateAircraft,
);

aircraftRouter.delete(
  "/:id",
  validateRequest({ params: aircraftIdParamSchema }),
  aircraftController.deleteAircraft,
);

aircraftRouter.get(
  "/admin/count",
  validateRequest({ query: aircraftCountQuerySchema }),
  aircraftController.countAircraft,
);

aircraftRouter.get(
  "/admin/statistics",
  aircraftController.getAircraftStatistics,
);

aircraftRouter.get(
  "/admin/type-statistics",
  aircraftController.getAircraftTypeStatistics,
);

export default aircraftRouter;
