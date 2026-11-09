
import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";
import { contentController } from "../controllers/content.controller.js";
import {
  contentCountQuerySchema,
  contentIdParamsSchema,
  contentListQuerySchema,
  contentSlugParamsSchema,
  createContentSchema,
  publicContentQuerySchema,
  updateContentSchema,
} from "../validations/content.validation.js";

const router = Router();

const adminOnly = [
  authenticate,
  authorize("admin", "super_admin"),
];

// Public routes
router.get(
  "/public",
  validateRequest({ query: publicContentQuerySchema }),
  contentController.listPublic,
);

router.get(
  "/public/slug/:slug",
  validateRequest({ params: contentSlugParamsSchema }),
  contentController.getBySlug,
);

// Administrative routes
router.post(
  "/",
  ...adminOnly,
  validateRequest({ body: createContentSchema }),
  contentController.create,
);

router.get(
  "/",
  ...adminOnly,
  validateRequest({ query: contentListQuerySchema }),
  contentController.list,
);

router.get(
  "/stats",
  ...adminOnly,
  contentController.stats,
);

router.get(
  "/count",
  ...adminOnly,
  validateRequest({ query: contentCountQuerySchema }),
  contentController.count,
);

router.get(
  "/:contentId",
  ...adminOnly,
  validateRequest({ params: contentIdParamsSchema }),
  contentController.getById,
);

router.patch(
  "/:contentId",
  ...adminOnly,
  validateRequest({
    params: contentIdParamsSchema,
    body: updateContentSchema,
  }),
  contentController.update,
);

router.delete(
  "/:contentId",
  ...adminOnly,
  validateRequest({ params: contentIdParamsSchema }),
  contentController.delete,
);

export default router;
