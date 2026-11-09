
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { reportService } from "../services/report.service.js";
import type {
  CreateReportValidatedInput,
  ReportCountValidatedQuery,
  ReportIdValidatedParams,
  ReportListValidatedQuery,
  UpdateReportStatusValidatedInput,
  UpdateReportValidatedInput,
} from "../validations/report.validation.js";

function getValidatedData<T>(
  res: Response,
  key: "body" | "params" | "query",
): T {
  const validated = res.locals.validated as
    | Record<string, unknown>
    | undefined;

  const value = validated?.[key];

  if (!value || typeof value !== "object") {
    throw new ApiError("Validated request data is missing.", 500, {
      code: "VALIDATED_DATA_MISSING",
    });
  }

  return value as T;
}

function getAuthenticatedUserId(res: Response): string {
  const user = res.locals.authenticatedUser as
    | { id?: string; _id?: mongoose.Types.ObjectId | string }
    | undefined;

  const userId = user?.id ?? user?._id?.toString();

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError("Authenticated user could not be identified.", 401, {
      code: "AUTHENTICATED_USER_NOT_FOUND",
    });
  }

  return userId;
}

export const createReport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const input = getValidatedData<CreateReportValidatedInput>(
      res,
      "body",
    );

    const requestedBy = getAuthenticatedUserId(res);

    const report = await reportService.create({
      ...input,
      requestedBy,
    });

    res.status(201).json({
      success: true,
      message: "Report request created successfully.",
      data: { report },
    });
  },
);

export const getReportById = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { reportId } = getValidatedData<ReportIdValidatedParams>(
      res,
      "params",
    );

    const report = await reportService.findById(reportId);

    res.status(200).json({
      success: true,
      data: { report },
    });
  },
);

export const listReports = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const query = getValidatedData<ReportListValidatedQuery>(
      res,
      "query",
    );

    const result = await reportService.list(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const listMyReports = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const query = getValidatedData<ReportListValidatedQuery>(
      res,
      "query",
    );
    const userId = getAuthenticatedUserId(res);

    const result = await reportService.listForUser(userId, query);

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const updateReport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { reportId } = getValidatedData<ReportIdValidatedParams>(
      res,
      "params",
    );

    const input = getValidatedData<UpdateReportValidatedInput>(
      res,
      "body",
    );

    const report = await reportService.update(reportId, input);

    res.status(200).json({
      success: true,
      message: "Report updated successfully.",
      data: { report },
    });
  },
);

export const updateReportStatus = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { reportId } = getValidatedData<ReportIdValidatedParams>(
      res,
      "params",
    );

    const input = getValidatedData<UpdateReportStatusValidatedInput>(
      res,
      "body",
    );

    const report = await reportService.updateStatus(reportId, input);

    res.status(200).json({
      success: true,
      message: "Report status updated successfully.",
      data: { report },
    });
  },
);

export const deleteReport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { reportId } = getValidatedData<ReportIdValidatedParams>(
      res,
      "params",
    );

    await reportService.delete(reportId);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  },
);

export const deleteMyReport = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { reportId } = getValidatedData<ReportIdValidatedParams>(
      res,
      "params",
    );

    const userId = getAuthenticatedUserId(res);

    await reportService.deleteForUser(reportId, userId);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  },
);

export const countReports = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const query = getValidatedData<ReportCountValidatedQuery>(
      res,
      "query",
    );

    const count = await reportService.count(query);

    res.status(200).json({
      success: true,
      data: { count },
    });
  },
);

export const getReportStats = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const stats = await reportService.getStats();

    res.status(200).json({
      success: true,
      data: { stats },
    });
  },
);
