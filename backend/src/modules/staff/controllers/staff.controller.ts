
import type { Request, Response } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { staffService } from "../services/staff.service.js";

import type {
  CreateStaffRequest,
  UpdateStaffRequest,
  StaffIdParam,
  StaffUserIdParam,
  StaffProfileQuery,
} from "../validations/staff.validation.js";

export const createStaffProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = res.locals.validatedRequest?.body as
      | CreateStaffRequest
      | undefined;

    if (!input) {
      throw new ApiError("Validated request body is missing.", 400, {
        code: "VALIDATED_BODY_MISSING",
      });
    }

    const staff = await staffService.createStaffProfile(input);

    res.status(201).json({
      success: true,
      message: "Staff profile created successfully.",
      data: staff,
    });
  },
);

export const getStaffProfileById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const params = res.locals.validatedRequest?.params as
      | StaffIdParam
      | undefined;

    if (!params) {
      throw new ApiError("Validated route parameters are missing.", 400, {
        code: "VALIDATED_PARAMS_MISSING",
      });
    }

    const staff = await staffService.getStaffProfileById(params.staffId);

    res.status(200).json({
      success: true,
      message: "Staff profile retrieved successfully.",
      data: staff,
    });
  },
);

export const getStaffProfileByUserId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const params = res.locals.validatedRequest?.params as
      | StaffUserIdParam
      | undefined;

    if (!params) {
      throw new ApiError("Validated route parameters are missing.", 400, {
        code: "VALIDATED_PARAMS_MISSING",
      });
    }

    const staff = await staffService.getStaffProfileByUserId(params.userId);

    res.status(200).json({
      success: true,
      message: "Staff profile retrieved successfully.",
      data: staff,
    });
  },
);

export const updateStaffProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const params = res.locals.validatedRequest?.params as
      | StaffIdParam
      | undefined;

    const input = res.locals.validatedRequest?.body as
      | UpdateStaffRequest
      | undefined;

    if (!params || !input) {
      throw new ApiError("Validated request data is missing.", 400, {
        code: "VALIDATED_REQUEST_DATA_MISSING",
      });
    }

    const staff = await staffService.updateStaffProfile(
      params.staffId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "Staff profile updated successfully.",
      data: staff,
    });
  },
);

export const listStaffProfiles = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = res.locals.validatedRequest?.query as
      | StaffProfileQuery
      | undefined;

    if (!query) {
      throw new ApiError("Validated query parameters are missing.", 400, {
        code: "VALIDATED_QUERY_MISSING",
      });
    }

    const { page, limit, ...filters } = query;

    const result = await staffService.listStaffProfiles(filters, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Staff profiles retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const deleteStaffProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const params = res.locals.validatedRequest?.params as
      | StaffIdParam
      | undefined;

    if (!params) {
      throw new ApiError("Validated route parameters are missing.", 400, {
        code: "VALIDATED_PARAMS_MISSING",
      });
    }

    await staffService.deleteStaffProfile(params.staffId);

    res.status(200).json({
      success: true,
      message: "Staff profile deleted successfully.",
    });
  },
);

export const countStaffProfiles = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const total = await staffService.countStaffProfiles();

    res.status(200).json({
      success: true,
      message: "Staff profile count retrieved successfully.",
      data: { total },
    });
  },
);
