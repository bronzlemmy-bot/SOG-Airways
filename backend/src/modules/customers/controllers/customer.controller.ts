
import type { RequestHandler } from "express";
import { z } from "zod";

import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";
import { customerService } from "../services/customer.service.js";
import {
  createCustomerProfileSchema,
  updateCustomerProfileSchema,
  customerIdParamSchema,
  customerProfileQuerySchema,
} from "../validations/customer.validation.js";

const userIdParamSchema = z.object({
  userId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "User ID must be a valid MongoDB ObjectId."),
});

function getAuthenticatedUserId(res: Parameters<RequestHandler>[1]): string {
  const authenticatedUser = res.locals.authenticatedUser as
    | { id?: string }
    | undefined;

  if (!authenticatedUser?.id) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return authenticatedUser.id;
}

function throwValidationError(details: unknown): never {
  throw new ApiError("Request validation failed.", 400, {
    code: "VALIDATION_ERROR",
    details,
  });
}

export const getMyCustomerProfile: RequestHandler = asyncHandler(
  async (_req, res) => {
    const userId = getAuthenticatedUserId(res);
    const profile = await customerService.getMyProfile(userId);

    res.status(200).json({
      success: true,
      message: "Customer profile retrieved successfully.",
      data: profile,
    });
  },
);

export const createMyCustomerProfile: RequestHandler = asyncHandler(
  async (req, res) => {
    const userId = getAuthenticatedUserId(res);
    const validation = createCustomerProfileSchema.safeParse(req.body);

    if (!validation.success) {
      throwValidationError(validation.error.flatten());
    }

    const profile = await customerService.createProfile(
      userId,
      validation.data,
    );

    res.status(201).json({
      success: true,
      message: "Customer profile created successfully.",
      data: profile,
    });
  },
);

export const updateMyCustomerProfile: RequestHandler = asyncHandler(
  async (req, res) => {
    const userId = getAuthenticatedUserId(res);
    const validation = updateCustomerProfileSchema.safeParse(req.body);

    if (!validation.success) {
      throwValidationError(validation.error.flatten());
    }

    const profile = await customerService.updateMyProfile(
      userId,
      validation.data,
    );

    res.status(200).json({
      success: true,
      message: "Customer profile updated successfully.",
      data: profile,
    });
  },
);

export const getCustomerProfileByUserId: RequestHandler = asyncHandler(
  async (req, res) => {
    const validation = userIdParamSchema.safeParse(req.params);

    if (!validation.success) {
      throwValidationError(validation.error.flatten());
    }

    const profile = await customerService.getProfileByUserId(
      validation.data.userId,
    );

    res.status(200).json({
      success: true,
      message: "Customer profile retrieved successfully.",
      data: profile,
    });
  },
);

export const listCustomerProfiles: RequestHandler = asyncHandler(
  async (req, res) => {
    const validation = customerProfileQuerySchema.safeParse(req.query);

    if (!validation.success) {
      throwValidationError(validation.error.flatten());
    }

    const { page, limit, loyaltyTier, loyaltyNumber } = validation.data;

    const result = await customerService.listProfiles(
      {
        ...(loyaltyTier ? { loyaltyTier } : {}),
        ...(loyaltyNumber ? { loyaltyNumber } : {}),
      },
      { page, limit },
    );

    res.status(200).json({
      success: true,
      message: "Customer profiles retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const checkLoyaltyNumberAvailability: RequestHandler = asyncHandler(
  async (req, res) => {
    const validation = z
      .object({
        loyaltyNumber: z
          .string()
          .trim()
          .min(1, "Loyalty number is required.")
          .max(40, "Loyalty number cannot exceed 40 characters.")
          .transform((value) => value.toUpperCase()),
      })
      .safeParse(req.query);

    if (!validation.success) {
      throwValidationError(validation.error.flatten());
    }

    const available = await customerService.isLoyaltyNumberAvailable(
      validation.data.loyaltyNumber,
    );

    res.status(200).json({
      success: true,
      message: "Loyalty number availability checked successfully.",
      data: { loyaltyNumber: validation.data.loyaltyNumber, available },
    });
  },
);

export const countCustomerProfiles: RequestHandler = asyncHandler(
  async (_req, res) => {
    const total = await customerService.countProfiles();

    res.status(200).json({
      success: true,
      message: "Customer profile count retrieved successfully.",
      data: { total },
    });
  },
);

export const deleteMyCustomerProfile: RequestHandler = asyncHandler(
  async (_req, _res) => {
    throw new ApiError(
      "Customer profile deletion is not currently supported.",
      501,
      { code: "CUSTOMER_PROFILE_DELETION_NOT_SUPPORTED" },
    );
  },
);

export const validateCustomerId: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    const validation = customerIdParamSchema.safeParse(req.params);

    if (!validation.success) {
      throwValidationError(validation.error.flatten());
    }

    next();
  },
);
