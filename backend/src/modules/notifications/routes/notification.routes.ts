
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import { notificationController } from "../controllers/notification.controller.js";

import {
  createNotificationSchema,
  markNotificationsReadSchema,
  notificationCountQuerySchema,
  notificationIdParamsSchema,
  notificationListQuerySchema,
  updateNotificationSchema,
} from "../validations/notification.validation.js";

const router = Router();

// All notification endpoints require authentication.
router.use(authenticate);

// Current user's notifications.
router.get(
  "/mine",
  validateRequest({ query: notificationListQuerySchema }),
  notificationController.listMine,
);

router.get(
  "/mine/stats",
  notificationController.getMineStats,
);

router.get(
  "/mine/unread-count",
  notificationController.countUnreadMine,
);

router.patch(
  "/mine/read",
  validateRequest({ body: markNotificationsReadSchema }),
  notificationController.markMineAsRead,
);

router.patch(
  "/mine/:notificationId/archive",
  validateRequest({ params: notificationIdParamsSchema }),
  notificationController.archiveMine,
);

router.delete(
  "/mine/:notificationId",
  validateRequest({ params: notificationIdParamsSchema }),
  notificationController.deleteMine,
);

// Administrative notification management.
router.post(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({ body: createNotificationSchema }),
  notificationController.create,
);

router.get(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({ query: notificationListQuerySchema }),
  notificationController.list,
);

router.get(
  "/stats",
  authorize("admin", "super_admin"),
  notificationController.getStats,
);

router.get(
  "/count",
  authorize("admin", "super_admin"),
  validateRequest({ query: notificationCountQuerySchema }),
  notificationController.count,
);

router.get(
  "/:notificationId",
  authorize("admin", "super_admin"),
  validateRequest({ params: notificationIdParamsSchema }),
  notificationController.getById,
);

router.patch(
  "/:notificationId",
  authorize("admin", "super_admin"),
  validateRequest({
    params: notificationIdParamsSchema,
    body: updateNotificationSchema,
  }),
  notificationController.update,
);

router.patch(
  "/:notificationId/read",
  authorize("admin", "super_admin"),
  validateRequest({ params: notificationIdParamsSchema }),
  notificationController.markAsRead,
);

router.delete(
  "/:notificationId",
  authorize("admin", "super_admin"),
  validateRequest({ params: notificationIdParamsSchema }),
  notificationController.delete,
);

export default router;
