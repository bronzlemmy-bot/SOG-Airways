
import type { Request, Response } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import { customerService } from "../../customers/services/customer.service.js";
import { checkInService } from "../services/check-in.service.js";

import type {
  CheckInFilters,
  CheckInPaginationOptions,
  CreateCheckInInput,
  UpdateCheckInInput,
} from "../types/check-in.types.js";

type ValidatedRequestData = {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

type AuthenticatedUser = {
  id?: string;
  _id?: string;
  role?: string;
};

const getValidatedData = (res: Response): ValidatedRequestData =>
  (res.locals.validated as ValidatedRequestData | undefined) ?? {};

const getRequiredString = (
  value: unknown,
  fieldName: string,
): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(`${fieldName} is required.`, 400, {
      code: "VALIDATION_ERROR",
    });
  }

  return value.trim();
};

const getAuthenticatedUser = (res: Response): AuthenticatedUser => {
  const user = res.locals.authenticatedUser as
    | AuthenticatedUser
    | undefined;

  if (!user) {
    throw new ApiError("Authentication is required.", 401, {
      code: "UNAUTHENTICATED",
    });
  }

  return user;
};

const getCustomerId = async (res: Response): Promise<string> => {
  const user = getAuthenticatedUser(res);
  const userId = user.id ?? user._id;

  if (!userId) {
    throw new ApiError("The authenticated account is invalid.", 401, {
      code: "INVALID_AUTHENTICATED_USER_ID",
    });
  }

  return customerService.getProfileIdForUser(userId);
};

const getOptionalCustomerOwner = async (
  res: Response,
): Promise<string | undefined> => {
  const user = getAuthenticatedUser(res);

  if (
    user.role === "admin" ||
    user.role === "super_admin" ||
    user.role === "staff"
  ) {
    return undefined;
  }

  return getCustomerId(res);
};

const getPaginationOptions = (
  query: Record<string, unknown>,
): CheckInPaginationOptions => ({
  page: typeof query.page === "number" ? query.page : 1,
  limit: typeof query.limit === "number" ? query.limit : 20,
  sortBy:
    typeof query.sortBy === "string"
      ? (query.sortBy as CheckInPaginationOptions["sortBy"])
      : "createdAt",
  sortOrder: query.sortOrder === "asc" ? "asc" : "desc",
});

const getCheckInFilters = (
  query: Record<string, unknown>,
): CheckInFilters => {
  const filters: CheckInFilters = {};

  const stringFields = [
    "booking",
    "ticket",
    "passenger",
    "flight",
    "customer",
    "status",
    "boardingPassStatus",
    "checkInReference",
    "seatNumber",
    "search",
  ] as const;

  for (const field of stringFields) {
    const value = query[field];

    if (typeof value === "string" && value.trim()) {
      (filters as Record<string, unknown>)[field] = value.trim();
    }
  }

  if (query.createdFrom instanceof Date) {
    filters.createdFrom = query.createdFrom;
  }

  if (query.createdTo instanceof Date) {
    filters.createdTo = query.createdTo;
  }

  return filters;
};

export const createCheckIn = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const body = (validated.body ?? req.body) as CreateCheckInInput;

    const result = await checkInService.createCheckIn(body);

    res.status(201).json({
      success: true,
      message: "Check-in record created successfully.",
      data: result,
    });
  },
);

export const getCheckInById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const checkInId = getRequiredString(
      validated.params?.checkInId ?? req.params.checkInId,
      "Check-in ID",
    );

    const customerId = await getOptionalCustomerOwner(res);
    const result = await checkInService.getCheckInById(
      checkInId,
      customerId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const getCheckInByReference = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const reference = getRequiredString(
      validated.params?.checkInReference ?? req.params.checkInReference,
      "Check-in reference",
    );

    const customerId = await getOptionalCustomerOwner(res);
    const result = await checkInService.getCheckInByReference(
      reference,
      customerId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const listCheckIns = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const query = validated.query ?? (req.query as Record<string, unknown>);

    const result = await checkInService.listCheckIns(
      getCheckInFilters(query),
      getPaginationOptions(query),
    );

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const getMyCheckIns = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const query = validated.query ?? {};
    const customerId = await getCustomerId(res);

    const result = await checkInService.getCustomerCheckIns(
      customerId,
      getPaginationOptions(query),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const getCheckInsByFlight = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const flightId = getRequiredString(
      validated.params?.flightId ?? req.params.flightId,
      "Flight ID",
    );
    const query = validated.query ?? {};

    const result = await checkInService.getFlightCheckIns(
      flightId,
      getPaginationOptions(query),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const getCheckInsByBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const bookingId = getRequiredString(
      validated.params?.bookingId ?? req.params.bookingId,
      "Booking ID",
    );

    const result = await checkInService.getBookingCheckIns(bookingId);

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const updateCheckIn = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const checkInId = getRequiredString(
      validated.params?.checkInId ?? req.params.checkInId,
      "Check-in ID",
    );
    const body = (validated.body ?? req.body) as UpdateCheckInInput;

    const result = await checkInService.updateCheckIn(checkInId, body);

    res.status(200).json({
      success: true,
      message: "Check-in record updated successfully.",
      data: result,
    });
  },
);

export const cancelCheckIn = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const checkInId = getRequiredString(
      validated.params?.checkInId ?? req.params.checkInId,
      "Check-in ID",
    );
    const body = (validated.body ?? req.body) as {
      reason?: unknown;
    };

    const reason = getRequiredString(body.reason, "Cancellation reason");

    const customerId = await getOptionalCustomerOwner(res);
    const result = await checkInService.cancelCheckIn(
      checkInId,
      reason,
      customerId,
    );

    res.status(200).json({
      success: true,
      message: "Check-in cancelled successfully.",
      data: result,
    });
  },
);

export const issueBoardingPass = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const checkInId = getRequiredString(
      validated.params?.checkInId ?? req.params.checkInId,
      "Check-in ID",
    );

    const result = await checkInService.issueBoardingPass(checkInId);

    res.status(200).json({
      success: true,
      message: "Boarding pass issued successfully.",
      data: result,
    });
  },
);

export const markBoardingPassUsed = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const checkInId = getRequiredString(
      validated.params?.checkInId ?? req.params.checkInId,
      "Check-in ID",
    );

    const result = await checkInService.markBoardingPassUsed(checkInId);

    res.status(200).json({
      success: true,
      message: "Boarding pass marked as used.",
      data: result,
    });
  },
);

export const deleteCheckIn = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const checkInId = getRequiredString(
      validated.params?.checkInId ?? req.params.checkInId,
      "Check-in ID",
    );

    const result = await checkInService.deleteCheckIn(checkInId);

    res.status(200).json({
      success: true,
      message: "Check-in record deleted successfully.",
      data: result,
    });
  },
);

export const countCheckIns = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const validated = getValidatedData(res);
    const query = validated.query ?? {};

    const result = await checkInService.countCheckIns(
      getCheckInFilters(query),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);
