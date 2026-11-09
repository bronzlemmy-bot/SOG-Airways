
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { newsletterController } from "../controllers/newsletter.controller.js";

import {
  createNewsletterSchema,
  newsletterCountQuerySchema,
  newsletterIdParamsSchema,
  newsletterListQuerySchema,
  unsubscribeNewsletterSchema,
  updateNewsletterSchema,
} from "../validations/newsletter.validation.js";

const newsletterRouter = Router();

// Public subscription endpoint.
newsletterRouter.post(
  "/subscribe",
  validateRequest({ body: createNewsletterSchema }),
  newsletterController.subscribe,
);

// Unsubscribe endpoint.
// Before production, replace email-only lookup with a verified,
// unguessable unsubscribe token.
newsletterRouter.post(
  "/unsubscribe",
  authenticate,
  validateRequest({ body: unsubscribeNewsletterSchema }),
  newsletterController.unsubscribe,
);

// All routes below require authentication.
newsletterRouter.use(authenticate);

const staffAuthorization = authorize(
  "staff",
  "admin",
  "super_admin",
);

// List newsletter subscriptions.
newsletterRouter.get(
  "/",
  staffAuthorization,
  validateRequest({ query: newsletterListQuerySchema }),
  newsletterController.list,
);

// Newsletter statistics.
newsletterRouter.get(
  "/stats",
  staffAuthorization,
  newsletterController.getStats,
);

// Count subscriptions with optional filters.
newsletterRouter.get(
  "/count",
  staffAuthorization,
  validateRequest({ query: newsletterCountQuerySchema }),
  newsletterController.count,
);

// Retrieve one subscription.
newsletterRouter.get(
  "/:newsletterId",
  staffAuthorization,
  validateRequest({ params: newsletterIdParamsSchema }),
  newsletterController.getById,
);

// Update a subscription.
newsletterRouter.patch(
  "/:newsletterId",
  authorize("admin", "super_admin"),
  validateRequest({
    params: newsletterIdParamsSchema,
    body: updateNewsletterSchema,
  }),
  newsletterController.update,
);

// Delete a subscription.
newsletterRouter.delete(
  "/:newsletterId",
  authorize("admin", "super_admin"),
  validateRequest({ params: newsletterIdParamsSchema }),
  newsletterController.delete,
);

export default newsletterRouter;
