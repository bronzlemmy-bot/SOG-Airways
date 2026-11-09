
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  countPayments,
  createPayment,
  deletePayment,
  getPaymentById,
  getPaymentByReference,
  getPaymentRevenue,
  getPaymentStatistics,
  listPayments,
  processDemoBookingPayment,
  refundPayment,
  updatePayment,
} from "../controllers/payment.controller.js";

import {
  createPaymentSchema,
  demoPaymentBookingParamsSchema,
  demoPaymentSchema,
  paymentCountQuerySchema,
  paymentIdParamSchema,
  paymentListQuerySchema,
  paymentReferenceParamSchema,
  refundPaymentSchema,
  updatePaymentSchema,
} from "../validations/payment.validation.js";

const paymentRouter = Router();

// All payment routes require authentication.
paymentRouter.use(authenticate);

paymentRouter.post(
  "/bookings/:bookingId/demo",
  validateRequest({
    params: demoPaymentBookingParamsSchema,
    body: demoPaymentSchema,
  }),
  processDemoBookingPayment,
);

// Generic payment creation is reserved for administrators.
paymentRouter.post(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({ body: createPaymentSchema }),
  createPayment,
);

// Administrative reporting routes.
paymentRouter.get(
  "/statistics",
  authorize("admin", "super_admin"),
  getPaymentStatistics,
);

paymentRouter.get(
  "/revenue",
  authorize("admin", "super_admin"),
  getPaymentRevenue,
);

paymentRouter.get(
  "/count",
  authorize("admin", "super_admin"),
  validateRequest({ query: paymentCountQuerySchema }),
  countPayments,
);

// Payment lookup by reference.
paymentRouter.get(
  "/reference/:paymentReference",
  validateRequest({ params: paymentReferenceParamSchema }),
  getPaymentByReference,
);

// List payments: administrators only.
paymentRouter.get(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({ query: paymentListQuerySchema }),
  listPayments,
);

// Individual payment lookup.
paymentRouter.get(
  "/:id",
  validateRequest({ params: paymentIdParamSchema }),
  getPaymentById,
);

// Administrative payment management.
paymentRouter.patch(
  "/:id",
  authorize("admin", "super_admin"),
  validateRequest({
    params: paymentIdParamSchema,
    body: updatePaymentSchema,
  }),
  updatePayment,
);

paymentRouter.post(
  "/:id/refund",
  authorize("admin", "super_admin"),
  validateRequest({
    params: paymentIdParamSchema,
    body: refundPaymentSchema,
  }),
  refundPayment,
);

paymentRouter.delete(
  "/:id",
  authorize("admin", "super_admin"),
  validateRequest({ params: paymentIdParamSchema }),
  deletePayment,
);

export default paymentRouter;
