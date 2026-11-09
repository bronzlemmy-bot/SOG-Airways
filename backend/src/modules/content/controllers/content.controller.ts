
import type { Request, Response } from "express";
import { asyncHandler } from "../../../utils/async-handler.js";
import { contentService } from "../services/content.service.js";
import type {
  ContentIdValidatedParams,
  ContentListValidatedQuery,
  ContentSlugValidatedParams,
  CreateContentValidatedInput,
  ContentCountValidatedQuery,
  PublicContentValidatedQuery,
  UpdateContentValidatedInput,
} from "../validations/content.validation.js";

type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

function getValidatedData<T>(res: Response, key: keyof ValidatedRequestData): T {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  const value = validated?.[key];

  if (value === undefined || value === null) {
    throw new Error(`Validated request ${key} data is missing.`);
  }

  return value as T;
}

function getAuthenticatedUserId(res: Response): string {
  const user = res.locals.authenticatedUser as
    | { id?: string; _id?: string }
    | undefined;

  const userId = user?.id ?? user?._id;

  if (!userId) {
    throw new Error("Authenticated user ID is missing.");
  }

  return userId;
}

export const contentController = {
  create: asyncHandler(async (_req: Request, res: Response) => {
    const input = getValidatedData<CreateContentValidatedInput>(
      res,
      "body",
    );

    const author = getAuthenticatedUserId(res);

    const content = await contentService.create({
      ...input,
      author,
    });

    res.status(201).json({
      success: true,
      message: "Content created successfully.",
      data: content,
    });
  }),

  list: asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<ContentListValidatedQuery>(
      res,
      "query",
    );

    const result = await contentService.list(query);

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  }),

  listPublic: asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<PublicContentValidatedQuery>(
      res,
      "query",
    );

    const result = await contentService.listPublic(query);

    res.status(200).json({
      success: true,
      message: "Published content retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  }),

  getById: asyncHandler(async (_req: Request, res: Response) => {
    const { contentId } = getValidatedData<ContentIdValidatedParams>(
      res,
      "params",
    );

    const content = await contentService.getById(contentId);

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully.",
      data: content,
    });
  }),

  getBySlug: asyncHandler(async (_req: Request, res: Response) => {
    const { slug } = getValidatedData<ContentSlugValidatedParams>(
      res,
      "params",
    );

    const content = await contentService.getBySlug(slug);

    res.status(200).json({
      success: true,
      message: "Published content retrieved successfully.",
      data: content,
    });
  }),

  update: asyncHandler(async (_req: Request, res: Response) => {
    const { contentId } = getValidatedData<ContentIdValidatedParams>(
      res,
      "params",
    );

    const input = getValidatedData<UpdateContentValidatedInput>(
      res,
      "body",
    );

    const content = await contentService.update(contentId, input);

    res.status(200).json({
      success: true,
      message: "Content updated successfully.",
      data: content,
    });
  }),

  delete: asyncHandler(async (_req: Request, res: Response) => {
    const { contentId } = getValidatedData<ContentIdValidatedParams>(
      res,
      "params",
    );

    const result = await contentService.delete(contentId);

    res.status(200).json({
      success: true,
      message: "Content deleted successfully.",
      data: result,
    });
  }),

  count: asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<ContentCountValidatedQuery>(
      res,
      "query",
    );

    const count = await contentService.count(query);

    res.status(200).json({
      success: true,
      message: "Content count retrieved successfully.",
      data: { count },
    });
  }),

  stats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await contentService.getStats();

    res.status(200).json({
      success: true,
      message: "Content statistics retrieved successfully.",
      data: stats,
    });
  }),
};
