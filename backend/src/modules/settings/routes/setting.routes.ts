
import { Router } from "express";
import { asyncHandler } from "../../../utils/async-handler.js";
import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";
import {
  createSetting,
  deleteSetting,
  getPublicSettings,
  getSettingById,
  getSettingByKey,
  getSettingCategories,
  getSettingCountByCategory,
  getSettingCounts,
  listSettings,
  updateSetting,
} from "../controllers/setting.controller.js";
import {
  createSettingSchema,
  listSettingsQuerySchema,
  publicSettingsQuerySchema,
  settingCountQuerySchema,
  settingIdParamsSchema,
  settingKeyParamsSchema,
  updateSettingSchema,
} from "../validations/setting.validation.js";

const router = Router();

// Public endpoints: expose only explicitly public settings.
router.get(
  "/public",
  validateRequest({ query: publicSettingsQuerySchema }),
  asyncHandler(getPublicSettings),
);

router.get(
  "/categories",
  asyncHandler(getSettingCategories),
);

// All remaining endpoints require authentication.
router.use(authenticate);

router.get(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({ query: listSettingsQuerySchema }),
  asyncHandler(listSettings),
);

router.get(
  "/counts",
  authorize("admin", "super_admin"),
  asyncHandler(getSettingCounts),
);

router.get(
  "/counts/category",
  authorize("admin", "super_admin"),
  validateRequest({ query: settingCountQuerySchema }),
  asyncHandler(getSettingCountByCategory),
);

router.get(
  "/key/:key",
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: settingKeyParamsSchema }),
  asyncHandler(getSettingByKey),
);

router.get(
  "/:settingId",
  authorize("admin", "super_admin", "staff"),
  validateRequest({ params: settingIdParamsSchema }),
  asyncHandler(getSettingById),
);

router.post(
  "/",
  authorize("admin", "super_admin"),
  validateRequest({ body: createSettingSchema }),
  asyncHandler(createSetting),
);

router.patch(
  "/:settingId",
  authorize("admin", "super_admin"),
  validateRequest({
    params: settingIdParamsSchema,
    body: updateSettingSchema,
  }),
  asyncHandler(updateSetting),
);

router.delete(
  "/:settingId",
  authorize("super_admin"),
  validateRequest({ params: settingIdParamsSchema }),
  asyncHandler(deleteSetting),
);

export default router;
