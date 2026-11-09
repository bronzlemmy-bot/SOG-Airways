
import type { RequestHandler } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { userService } from "../services/user.service.js";
import type {
  CreateCustomerUserData,
  UpdateUserProfileData,
} from "../validations/user.validation.js";

interface AuthenticatedUserContext {
  id: string;
  role?: string;
  email?: string;
}

/**
 * Ensures a route parameter is a single, non-empty string.
 */
function requireSingleRouteParam(
  value: string | string[] | undefined,
  parameterName: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(`A valid ${parameterName} is required.`, 400, {
      code: "INVALID_ROUTE_PARAMETER",
    });
  }

  return value.trim();
}

/**
 * Ensures users can only access their own profiles,
 * unless they have an administrative role.
 */
function assertCanAccessUser(
  actor: AuthenticatedUserContext | undefined,
  targetUserId: string,
): void {
  if (!actor) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  const role = actor.role?.toLowerCase();
  const isAdministrator =
    role === "admin" || role === "super_admin";

  if (actor.id !== targetUserId && !isAdministrator) {
    throw new ApiError(
      "You do not have permission to access this user profile.",
      403,
      {
        code: "INSUFFICIENT_PERMISSIONS",
      },
    );
  }
}

/**
 * Creates a customer account.
 * The route should validate the request body before reaching this controller.
 */
export const createCustomerUser: RequestHandler = asyncHandler(
  async (req, res) => {
    const input = req.body as CreateCustomerUserData;

    const user = await userService.createCustomerUser(input);

    res.status(201).json({
      success: true,
      message: "Customer account created successfully.",
      data: user,
    });
  },
);

/**
 * Retrieves a user profile.
 * Requires authentication and ownership or administrator access.
 */
export const getUserById: RequestHandler = asyncHandler(
  async (req, res) => {
    const userId = requireSingleRouteParam(
      req.params.id,
      "user ID",
    );

    assertCanAccessUser(
      res.locals.authenticatedUser,
      userId,
    );

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

/**
 * Updates a user profile.
 * Users may update their own profile; administrators may update others.
 */
export const updateUserProfile: RequestHandler = asyncHandler(
  async (req, res) => {
    const userId = requireSingleRouteParam(
      req.params.id,
      "user ID",
    );

    assertCanAccessUser(
      res.locals.authenticatedUser,
      userId,
    );

    const input = req.body as UpdateUserProfileData;

    const user = await userService.updateUserProfile(
      userId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      data: user,
    });
  },
);
