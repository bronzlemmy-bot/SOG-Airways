
import type { Request, Response } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { notificationService } from "../services/notification.service.js";

import type {
  CreateNotificationValidatedInput,
  MarkNotificationsReadValidatedInput,
  NotificationCountValidatedQuery,
  NotificationIdValidatedParams,
  NotificationListValidatedQuery,
  UpdateNotificationValidatedInput,
} from "../validations/notification.validation.js";

function getValidatedData<T>(res: Response, key: string): T {
  const validated = res.locals.validated as
    | Record<string, unknown>
    | undefined;

  const data = validated?.[key];

  if (!data) {
    throw new ApiError(
      `Validated ${key} data is missing.`,
      400,
      { code: "VALIDATED_DATA_MISSING" },
    );
  }

  return data as T;
}

function getAuthenticatedUserId(res: Response): string {
  const user = res.locals.authenticatedUser as
    | { id?: string; _id?: string }
    | undefined;

  const userId = user?.id ?? user?._id;

  if (!userId) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return String(userId);
}

class NotificationController {
  create = asyncHandler(async (_req: Request, res: Response) => {
    const input =
      getValidatedData<CreateNotificationValidatedInput>(
        res,
        "body",
      );

    const notification = await notificationService.create(input);

    res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: notification,
    });
  });

  getById = asyncHandler(async (_req: Request, res: Response) => {
    const { notificationId } =
      getValidatedData<NotificationIdValidatedParams>(
        res,
        "params",
      );

    const notification =
      await notificationService.findById(notificationId);

    res.status(200).json({
      success: true,
      data: notification,
    });
  });

  list = asyncHandler(async (_req: Request, res: Response) => {
    const query =
      getValidatedData<NotificationListValidatedQuery>(
        res,
        "query",
      );

    const result = await notificationService.list(query);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  });

  listMine = asyncHandler(async (_req: Request, res: Response) => {
    const recipientId = getAuthenticatedUserId(res);

    const query =
      getValidatedData<NotificationListValidatedQuery>(
        res,
        "query",
      );

    const { recipient: _recipient, ...recipientQuery } = query;

    const result = await notificationService.listForRecipient(
      recipientId,
      recipientQuery,
    );

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  });

  update = asyncHandler(async (_req: Request, res: Response) => {
    const { notificationId } =
      getValidatedData<NotificationIdValidatedParams>(
        res,
        "params",
      );

    const input =
      getValidatedData<UpdateNotificationValidatedInput>(
        res,
        "body",
      );

    const notification = await notificationService.update(
      notificationId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "Notification updated successfully.",
      data: notification,
    });
  });

  markAsRead = asyncHandler(async (_req: Request, res: Response) => {
    const { notificationId } =
      getValidatedData<NotificationIdValidatedParams>(
        res,
        "params",
      );

    const notification =
      await notificationService.markAsRead(notificationId);

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  });

  markMineAsRead = asyncHandler(
    async (_req: Request, res: Response) => {
      const recipientId = getAuthenticatedUserId(res);

      const input =
        getValidatedData<MarkNotificationsReadValidatedInput>(
          res,
          "body",
        );

      const result = await notificationService.markManyAsRead(
        recipientId,
        input,
      );

      res.status(200).json({
        success: true,
        message: "Notifications marked as read.",
        data: result,
      });
    },
  );

  archiveMine = asyncHandler(
    async (_req: Request, res: Response) => {
      const recipientId = getAuthenticatedUserId(res);

      const { notificationId } =
        getValidatedData<NotificationIdValidatedParams>(
          res,
          "params",
        );

      const notification = await notificationService.archive(
        notificationId,
        recipientId,
      );

      res.status(200).json({
        success: true,
        message: "Notification archived successfully.",
        data: notification,
      });
    },
  );

  delete = asyncHandler(async (_req: Request, res: Response) => {
    const { notificationId } =
      getValidatedData<NotificationIdValidatedParams>(
        res,
        "params",
      );

    const notification =
      await notificationService.delete(notificationId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      data: notification,
    });
  });

  deleteMine = asyncHandler(async (_req: Request, res: Response) => {
    const recipientId = getAuthenticatedUserId(res);

    const { notificationId } =
      getValidatedData<NotificationIdValidatedParams>(
        res,
        "params",
      );

    const notification =
      await notificationService.deleteForRecipient(
        notificationId,
        recipientId,
      );

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      data: notification,
    });
  });

  count = asyncHandler(async (_req: Request, res: Response) => {
    const query =
      getValidatedData<NotificationCountValidatedQuery>(
        res,
        "query",
      );

    const count = await notificationService.count(query);

    res.status(200).json({
      success: true,
      data: { count },
    });
  });

  countUnreadMine = asyncHandler(
    async (_req: Request, res: Response) => {
      const recipientId = getAuthenticatedUserId(res);

      const count =
        await notificationService.countUnread(recipientId);

      res.status(200).json({
        success: true,
        data: { count },
      });
    },
  );

  getMineStats = asyncHandler(
    async (_req: Request, res: Response) => {
      const recipientId = getAuthenticatedUserId(res);

      const stats =
        await notificationService.getStats(recipientId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    },
  );

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await notificationService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}

export const notificationController = new NotificationController();
