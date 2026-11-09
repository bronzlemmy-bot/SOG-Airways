
import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";
import {
  countReports,
  createReport,
  deleteMyReport,
  deleteReport,
  getReportById,
  getReportStats,
  listMyReports,
  listReports,
  updateReport,
  updateReportStatus,
} from "../controllers/report.controller.js";
import {
  createReportSchema,
  reportCountQuerySchema,
  reportIdParamsSchema,
  reportListQuerySchema,
  updateReportSchema,
  updateReportStatusSchema,
} from "../validations/report.validation.js";

const router = Router();

router.use(authenticate);

// Authenticated users can manage their own report requests.
router.post(
  "/",
  validateRequest({
    body: createReportSchema.shape.body,
  }),
  createReport,
);

router.get(
  "/my",
  validateRequest({
    query: reportListQuerySchema,
  }),
  listMyReports,
);

router.delete(
  "/my/:reportId",
  validateRequest({
    params: reportIdParamsSchema.shape.params,
  }),
  deleteMyReport,
);

// Administrative report management.
router.get(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({
    query: reportListQuerySchema,
  }),
  listReports,
);

router.get(
  "/stats",
  authorize("admin", "super_admin"),
  getReportStats,
);

router.get(
  "/count",
  authorize("admin", "super_admin"),
  validateRequest({
    query: reportCountQuerySchema,
  }),
  countReports,
);

router.get(
  "/:reportId",
  authorize("admin", "super_admin"),
  validateRequest({
    params: reportIdParamsSchema.shape.params,
  }),
  getReportById,
);

router.patch(
  "/:reportId",
  authorize("admin", "super_admin"),
  validateRequest({
    params: updateReportSchema.shape.params,
    body: updateReportSchema.shape.body,
  }),
  updateReport,
);

router.patch(
  "/:reportId/status",
  authorize("admin", "super_admin"),
  validateRequest({
    params: updateReportStatusSchema.shape.params,
    body: updateReportStatusSchema.shape.body,
  }),
  updateReportStatus,
);

router.delete(
  "/:reportId",
  authorize("admin", "super_admin"),
  validateRequest({
    params: reportIdParamsSchema.shape.params,
  }),
  deleteReport,
);

export default router;
