
import type { Request, Response } from "express";

import { Types } from "mongoose";

import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";
import { supportService } from "../services/support.service.js";

import type {
  AddSupportMessageValidatedInput,
  CreateSupportCaseValidatedInput,
  ListSupportCasesValidatedQuery,
  SupportCaseCountValidatedQuery,
  SupportCaseIdValidatedParams,
  SupportCaseNumberValidatedParams,
  UpdateSupportCaseValidatedInput,
} from "../validations/support.validation.js";

interface ValidatedRequestData {
  body?: unknown;
  params?: unknown;
  query?: unknown;
}

function getValidatedData<T>(res: Response): T {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  if (!validated) {
    throw new ApiError("Validated request data is unavailable.", 500);
  }

  return validated as T;
}

interface AuthenticatedUser {
  id?: string;
  _id?: Types.ObjectId | string;
  role?: "customer" | "staff" | "admin" | "super_admin";
}

function getAuthenticatedUser(res: Response): AuthenticatedUser {
  const user = res.locals.authenticatedUser as
    | AuthenticatedUser
    | undefined;

  if (!user) {
    throw new ApiError("Authentication is required.", 401);
  }

  return user;
}

function getUserId(user: AuthenticatedUser): string {
  const id = user.id ?? user._id?.toString();

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Authenticated user ID is invalid.", 401);
  }

  return id;
}

function isStaffRole(
  role: AuthenticatedUser["role"],
): boolean {
  return role === "staff" || role === "admin" || role === "super_admin";
}

export const createSupportCase = asyncHandler(
  async (_req: Request, res: Response) => {
    const { body } =
      getValidatedData<{ body: CreateSupportCaseValidatedInput }>(res);

    const user = getAuthenticatedUser(res);
    const userId = getUserId(user);

    const supportCase = await supportService.createCase(
      {
        ...body,
        customerId: userId,
      },
      userId,
    );

    res.status(201).json({
      success: true,
      message: "Support case created successfully.",
      data: supportCase,
    });
  },
);

export const listSupportCases = asyncHandler(
  async (_req: Request, res: Response) => {
    const { query } =
      getValidatedData<{ query: ListSupportCasesValidatedQuery }>(res);

    const user = getAuthenticatedUser(res);
    const userId = getUserId(user);
    const isStaff = isStaffRole(user.role);

    const result = await supportService.listCases(
      query,
      userId,
      isStaff,
    );

    res.status(200).json({
      success: true,
      message: "Support cases retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const getSupportCaseById = asyncHandler(
  async (_req: Request, res: Response) => {
    const { params } =
      getValidatedData<{ params: SupportCaseIdValidatedParams }>(res);

    const user = getAuthenticatedUser(res);
    const supportCase = await supportService.getCaseById(
      params.caseId,
      getUserId(user),
      isStaffRole(user.role),
    );

    res.status(200).json({
      success: true,
      message: "Support case retrieved successfully.",
      data: supportCase,
    });
  },
);

export const getSupportCaseByNumber = asyncHandler(
  async (_req: Request, res: Response) => {
    const { params } =
      getValidatedData<{ params: SupportCaseNumberValidatedParams }>(res);

    const user = getAuthenticatedUser(res);
    const supportCase = await supportService.getCaseByNumber(
      params.caseNumber,
      getUserId(user),
      isStaffRole(user.role),
    );

    res.status(200).json({
      success: true,
      message: "Support case retrieved successfully.",
      data: supportCase,
    });
  },
);

export const updateSupportCase = asyncHandler(
  async (_req: Request, res: Response) => {
    const { params, body } = getValidatedData<{
      params: SupportCaseIdValidatedParams;
      body: UpdateSupportCaseValidatedInput;
    }>(res);

    const user = getAuthenticatedUser(res);

    if (!isStaffRole(user.role)) {
      throw new ApiError("Only support staff can update support cases.", 403);
    }

    const supportCase = await supportService.updateCase(
      params.caseId,
      body,
    );

    res.status(200).json({
      success: true,
      message: "Support case updated successfully.",
      data: supportCase,
    });
  },
);

export const addSupportMessage = asyncHandler(
  async (_req: Request, res: Response) => {
    const { params, body } = getValidatedData<{
      params: SupportCaseIdValidatedParams;
      body: AddSupportMessageValidatedInput;
    }>(res);

    const user = getAuthenticatedUser(res);

    if (!user.role) {
      throw new ApiError("Authenticated user role is missing.", 401);
    }

    const supportCase = await supportService.addMessage(
      params.caseId,
      {
        ...body,
        senderRole: user.role === "super_admin" ? "admin" : user.role,
      },
      getUserId(user),
      user.role,
    );

    res.status(200).json({
      success: true,
      message: "Support message added successfully.",
      data: supportCase,
    });
  },
);

export const getSupportCaseCounts = asyncHandler(
  async (_req: Request, res: Response) => {
    const { query } =
      getValidatedData<{ query: SupportCaseCountValidatedQuery }>(res);

    const user = getAuthenticatedUser(res);
    const result = await supportService.getCaseCounts(
      query,
      getUserId(user),
      isStaffRole(user.role),
    );

    res.status(200).json({
      success: true,
      message: "Support case counts retrieved successfully.",
      data: result,
    });
  },
);

export const deleteSupportCase = asyncHandler(
  async (_req: Request, res: Response) => {
    const { params } =
      getValidatedData<{ params: SupportCaseIdValidatedParams }>(res);

    const user = getAuthenticatedUser(res);

    if (!isStaffRole(user.role)) {
      throw new ApiError("Only support staff can delete support cases.", 403);
    }

    await supportService.deleteCase(params.caseId);

    res.status(200).json({
      success: true,
      message: "Support case deleted successfully.",
    });
  },
);
