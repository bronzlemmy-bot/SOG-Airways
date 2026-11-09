

import type { Request, Response } from "express";
import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";
import { conversationService } from "../services/conversation.service.js";

import type {
  CreateConversationInput,
  UpdateConversationInput,
} from "../types/conversation.types.js";

import type {
  ConversationListValidatedQuery,
  UpdateConversationStatusValidatedInput,
} from "../validations/conversation.validation.js";


type AuthenticatedUser = {
  id?: string;
  _id?: string;
};

type ValidatedRequestData = {
  body?: unknown;
  params?: Record<string, string>;
  query?: unknown;
};

const getValidatedData = <T>(res: Response, key: keyof ValidatedRequestData): T => {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  const value = validated?.[key];

  if (value === undefined || value === null) {
    throw new ApiError(`Validated request ${key} is missing.`, 400, {
      code: "VALIDATED_DATA_MISSING",
    });
  }

  return value as T;
};

const getAuthenticatedUserId = (res: Response): string => {
  const user = res.locals.authenticatedUser as
    | AuthenticatedUser
    | undefined;

  const userId = user?.id ?? user?._id;

  if (!userId) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return userId.toString();
};

class ConversationController {
  create = asyncHandler(async (_req: Request, res: Response) => {
    const input = getValidatedData<
      Omit<CreateConversationInput, "createdBy">
    >(res, "body");

    const creatorId = getAuthenticatedUserId(res);
    const conversation = await conversationService.create(input, creatorId);

    res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: conversation,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = getValidatedData<{
      conversationId: string;
    }>(res, "params");

    const requestingUserId = getAuthenticatedUserId(res);
    const conversation = await conversationService.getById(
      conversationId,
      requestingUserId,
    );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  });

  list = asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<ConversationListValidatedQuery>(
      res,
      "query",
    );

    const result = await conversationService.list(query);

    res.status(200).json({
      success: true,
      ...result,
    });
  });

  listMine = asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<ConversationListValidatedQuery>(
      res,
      "query",
    );

    const userId = getAuthenticatedUserId(res);
    const result = await conversationService.listForParticipant(
      userId,
      query,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  });

  update = asyncHandler(async (_req: Request, res: Response) => {
    const { conversationId } = getValidatedData<{
      conversationId: string;
    }>(res, "params");

    const input = getValidatedData<UpdateConversationInput>(res, "body");
    const userId = getAuthenticatedUserId(res);

    const conversation = await conversationService.update(
      conversationId,
      input,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Conversation updated successfully.",
      data: conversation,
    });
  });

  updateStatus = asyncHandler(async (_req: Request, res: Response) => {
    const { conversationId } = getValidatedData<{
      conversationId: string;
    }>(res, "params");

    const { status } =
      getValidatedData<UpdateConversationStatusValidatedInput>(
        res,
        "body",
      );

    const userId = getAuthenticatedUserId(res);
    const conversation = await conversationService.updateStatus(
      conversationId,
      status,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Conversation status updated successfully.",
      data: conversation,
    });
  });

  assign = asyncHandler(async (_req: Request, res: Response) => {
    const { conversationId } = getValidatedData<{
      conversationId: string;
    }>(res, "params");

    const { assignedTo } = getValidatedData<{
      assignedTo: string | null;
    }>(res, "body");

    const conversation = await conversationService.assign(
      conversationId,
      assignedTo,
    );

    res.status(200).json({
      success: true,
      message: "Conversation assignment updated successfully.",
      data: conversation,
    });
  });

  markAsRead = asyncHandler(async (_req: Request, res: Response) => {
    const { conversationId } = getValidatedData<{
      conversationId: string;
    }>(res, "params");

    const userId = getAuthenticatedUserId(res);
    const conversation = await conversationService.markAsRead(
      conversationId,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Conversation marked as read.",
      data: conversation,
    });
  });

  getUnreadCount = asyncHandler(async (_req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(res);
    const unreadCount = await conversationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await conversationService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  count = asyncHandler(async (_req: Request, res: Response) => {
    const count = await conversationService.count();
    res.status(200).json({
      success: true,
      data: { count },
    });
  });

  delete = asyncHandler(async (_req: Request, res: Response) => {
    const { conversationId } = getValidatedData<{
      conversationId: string;
    }>(res, "params");

    const userId = getAuthenticatedUserId(res);
    await conversationService.delete(conversationId, userId);

    res.status(200).json({
      success: true,
      message: "Conversation and its messages deleted successfully.",
    });
  });
}

export const conversationController = new ConversationController();
