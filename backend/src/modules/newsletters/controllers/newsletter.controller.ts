
import type { Request, RequestHandler } from "express";

import { authService } from "../../auth/services/auth.service.js";
import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";

import { newsletterService } from "../services/newsletter.service.js";

import type {
  CreateNewsletterValidatedInput,
  NewsletterCountValidatedQuery,
  NewsletterIdValidatedParams,
  NewsletterListValidatedQuery,
  UnsubscribeNewsletterValidatedInput,
  UpdateNewsletterValidatedInput,
} from "../validations/newsletter.validation.js";

function getValidatedData<T>(
  res: Parameters<RequestHandler>[1],
  key: "body" | "params" | "query",
): T {
  const validated = res.locals.validated as
    | Record<string, unknown>
    | undefined;

  if (
    !validated ||
    typeof validated !== "object" ||
    !(key in validated)
  ) {
    throw new Error(`Validated request ${key} is missing.`);
  }

  return validated[key] as T;
}

function getRequestOrigin(req: Request): string {
  return req.get("origin") ?? "";
}

export const newsletterController = {
  subscribe: asyncHandler(async (req, res) => {
    const input =
      getValidatedData<CreateNewsletterValidatedInput>(
        res,
        "body",
      );

    const newsletter = await newsletterService.subscribe(input);

    res.status(201).json({
      success: true,
      message: "Newsletter subscription created successfully.",
      data: newsletter,
    });
  }),

  getById: asyncHandler(async (_req, res) => {
    const { newsletterId } =
      getValidatedData<NewsletterIdValidatedParams>(
        res,
        "params",
      );

    const newsletter =
      await newsletterService.getById(newsletterId);

    res.status(200).json({
      success: true,
      data: newsletter,
    });
  }),

  getByEmail: asyncHandler(async (req, res) => {
    const email =
      typeof req.params.email === "string"
        ? req.params.email
        : "";

    const newsletter =
      await newsletterService.getByEmail(email);

    res.status(200).json({
      success: true,
      data: newsletter,
    });
  }),

  list: asyncHandler(async (_req, res) => {
    const query =
      getValidatedData<NewsletterListValidatedQuery>(
        res,
        "query",
      );

    const result = await newsletterService.list(query);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  }),

  update: asyncHandler(async (_req, res) => {
    const { newsletterId } =
      getValidatedData<NewsletterIdValidatedParams>(
        res,
        "params",
      );

    const input =
      getValidatedData<UpdateNewsletterValidatedInput>(
        res,
        "body",
      );

    const newsletter = await newsletterService.update(
      newsletterId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "Newsletter subscription updated successfully.",
      data: newsletter,
    });
  }),

  unsubscribe: asyncHandler(async (_req, res) => {
    const { email } =
      getValidatedData<UnsubscribeNewsletterValidatedInput>(
        res,
        "body",
      );
    const user = res.locals.authenticatedUser;

    if (!user) {
      throw new ApiError("Authentication is required.", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const authenticatedUser = await authService.getCurrentUser(user.id);
    if (!authenticatedUser.emailVerifiedAt) {
      throw new ApiError(
        "A verified email address is required to unsubscribe.",
        403,
        { code: "VERIFIED_EMAIL_REQUIRED" },
      );
    }

    if (
      authenticatedUser.email.trim().toLowerCase() !==
      email.trim().toLowerCase()
    ) {
      throw new ApiError(
        "You can only unsubscribe the verified email on your account.",
        403,
        { code: "NEWSLETTER_EMAIL_OWNERSHIP_REQUIRED" },
      );
    }

    const newsletter =
      await newsletterService.unsubscribeByEmail(email);

    res.status(200).json({
      success: true,
      message: "Newsletter subscription cancelled successfully.",
      data: {
        id: newsletter.id,
        email: newsletter.email,
        status: newsletter.status,
        unsubscribedAt: newsletter.unsubscribedAt,
      },
    });
  }),

  delete: asyncHandler(async (_req, res) => {
    const { newsletterId } =
      getValidatedData<NewsletterIdValidatedParams>(
        res,
        "params",
      );

    await newsletterService.delete(newsletterId);

    res.status(200).json({
      success: true,
      message: "Newsletter subscription deleted successfully.",
    });
  }),

  count: asyncHandler(async (_req, res) => {
    const query =
      getValidatedData<NewsletterCountValidatedQuery>(
        res,
        "query",
      );

    const total = await newsletterService.count(query);

    res.status(200).json({
      success: true,
      data: { total },
    });
  }),

  getStats: asyncHandler(async (_req, res) => {
    const stats = await newsletterService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  }),
};
