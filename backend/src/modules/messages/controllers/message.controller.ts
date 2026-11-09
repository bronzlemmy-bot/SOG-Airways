
import type { Request, Response } from "express";
import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";
import { messageService } from "../services/message.service.js";
import type {
  CreateMessageInput,
  MessageListQuery,
  UpdateMessageInput,
} from "../types/message.types.js";
import type {
  CreateMessageValidatedInput,
  MessageListValidatedQuery,
  UpdateMessageValidatedInput,
} from "../validations/message.validation.js";

type AuthenticatedUser = {
  id?: string;
  _id?: string;
};

type ValidatedRequestData = {
  body?: unknown;
  params?: Record<string, string>;
  query?: unknown;
};

const getValidatedData = <T>(
  res: Response,
  key: keyof ValidatedRequestData,
): T => {
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

class MessageController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const input = getValidatedData<CreateMessageValidatedInput>(
      res,
      "body",
    );

    const senderId = getAuthenticatedUserId(res);

    const message = await messageService.create(
      input as Omit<CreateMessageInput, "sender">,
      senderId,
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  });

  getById = asyncHandler(async (_req: Request, res: Response) => {
    const { messageId } = getValidatedData<{ messageId: string }>(
      res,
      "params",
    );

    const userId = getAuthenticatedUserId(res);
    const message = await messageService.getById(messageId, userId);

    res.status(200).json({
      success: true,
      data: message,
    });
  });

  list = asyncHandler(async (_req: Request, res: Response) => {
    const query = getValidatedData<MessageListValidatedQuery>(
      res,
      "query",
    );

    const userId = getAuthenticatedUserId(res);

    const result = await messageService.listForUser(
      userId,
      query as MessageListQuery,
    );

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  });

  listByConversation = asyncHandler(
    async (_req: Request, res: Response) => {
      const { conversationId } = getValidatedData<{
        conversationId: string;
      }>(res, "params");

      const query = getValidatedData<MessageListValidatedQuery>(
        res,
        "query",
      );

      const userId = getAuthenticatedUserId(res);

      const result = await messageService.listConversationMessages(
        conversationId,
        userId,
        query as Pick<MessageListQuery, "page" | "limit" | "sortOrder">,
      );

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    },
  );

  update = asyncHandler(async (_req: Request, res: Response) => {
    const { messageId } = getValidatedData<{ messageId: string }>(
      res,
      "params",
    );

    const input = getValidatedData<UpdateMessageValidatedInput>(
      res,
      "body",
    );

    const message = await messageService.update(
      messageId,
      input as UpdateMessageInput,
    );

    res.status(200).json({
      success: true,
      message: "Message updated successfully.",
      data: message,
    });
  });

  markAsRead = asyncHandler(async (_req: Request, res: Response) => {
    const { messageId } = getValidatedData<{ messageId: string }>(
      res,
      "params",
    );

    const userId = getAuthenticatedUserId(res);
    const message = await messageService.markAsRead(messageId, userId);

    res.status(200).json({
      success: true,
      message: "Message marked as read.",
      data: message,
    });
  });

  markAsDelivered = asyncHandler(async (_req: Request, res: Response) => {
    const { messageId } = getValidatedData<{ messageId: string }>(
      res,
      "params",
    );

    const message = await messageService.markAsDelivered(messageId);

    res.status(200).json({
      success: true,
      message: "Message marked as delivered.",
      data: message,
    });
  });

  markAsFailed = asyncHandler(async (_req: Request, res: Response) => {
    const { messageId } = getValidatedData<{ messageId: string }>(
      res,
      "params",
    );

    const { reason } = getValidatedData<{ reason: string }>(res, "body");

    const message = await messageService.markAsFailed(messageId, reason);

    res.status(200).json({
      success: true,
      message: "Message delivery failure recorded.",
      data: message,
    });
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(res);
    const stats = await messageService.getStats({ recipient: userId });

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  delete = asyncHandler(async (_req: Request, res: Response) => {
    const { messageId } = getValidatedData<{ messageId: string }>(
      res,
      "params",
    );

    const userId = getAuthenticatedUserId(res);
    await messageService.delete(messageId, userId);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  });
}

export const messageController = new MessageController();
