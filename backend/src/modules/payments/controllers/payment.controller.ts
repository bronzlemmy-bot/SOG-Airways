
import type { Request, Response } from "express";

import { ApiError } from "../../../utils/api-error.js";
import { asyncHandler } from "../../../utils/async-handler.js";

import { paymentService } from "../services/payment.service.js";
import { bookingWorkflowService } from "../../bookings/services/booking-workflow.service.js";
import { customerService } from "../../customers/services/customer.service.js";

import type {
  CreatePaymentInput,
  PaymentFilters,
  PaymentPaginationOptions,
  RefundPaymentInput,
  UpdatePaymentInput,
} from "../types/payment.types.js";

import type {
  CreatePaymentValidatedInput,
  PaymentCountValidatedQuery,
  PaymentListValidatedQuery,
  RefundPaymentValidatedInput,
  UpdatePaymentValidatedInput,
} from "../validations/payment.validation.js";

type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

type AuthenticatedUser = {
  id?: string;
  _id?: string;
  userId?: string;
  role?: string;
  [key: string]: unknown;
};

function getValidatedData<T>(res: Response, key: keyof ValidatedRequestData): T {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  if (!validated || validated[key] === undefined) {
    throw new ApiError(
      `Validated request ${String(key)} data is missing.`,
      400,
      { code: "VALIDATED_REQUEST_DATA_MISSING" },
    );
  }

  return validated[key] as T;
}

function getAuthenticatedUser(res: Response): AuthenticatedUser {
  const user = res.locals.authenticatedUser as
    | AuthenticatedUser
    | undefined;

  if (!user) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return user;
}

function getAuthenticatedUserId(res: Response): string {
  const user = getAuthenticatedUser(res);
  const id = user.id ?? user._id?.toString() ?? user.userId;

  if (!id) {
    throw new ApiError(
      "The authenticated user ID is unavailable.",
      401,
      { code: "AUTHENTICATED_USER_ID_MISSING" },
    );
  }

  return id;
}

function success<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export const createPayment = asyncHandler(
  async (_req: Request, res: Response) => {
    const input = getValidatedData<CreatePaymentValidatedInput>(
      res,
      "body",
    );

    const payment = await paymentService.createPayment(
      input as CreatePaymentInput,
    );

    return success(res, "Payment created successfully.", payment, 201);
  },
);

export const getPaymentById = asyncHandler(
  async (_req: Request, res: Response) => {
    const { id } = getValidatedData<{ id: string }>(res, "params");
    const user = getAuthenticatedUser(res);
    const isAdmin =
      user.role === "admin" || user.role === "super_admin";
    const customerId = isAdmin
      ? null
      : await customerService.getProfileIdForUser(
          getAuthenticatedUserId(res),
        );
    const payment = await paymentService.getPaymentByIdForAccess(
      id,
      customerId,
      isAdmin,
    );

    return success(res, "Payment retrieved successfully.", payment);
  },
);

export const getPaymentByReference = asyncHandler(
  async (_req: Request, res: Response) => {
    const { paymentReference } = getValidatedData<{
      paymentReference: string;
    }>(res, "params");

    const user = getAuthenticatedUser(res);
    const isAdmin =
      user.role === "admin" || user.role === "super_admin";
    const customerId = isAdmin
      ? null
      : await customerService.getProfileIdForUser(
          getAuthenticatedUserId(res),
        );
    const payment = await paymentService.getPaymentByReferenceForAccess(
      paymentReference,
      customerId,
      isAdmin,
    );

    return success(res, "Payment retrieved successfully.", payment);
  },
);

export const processDemoBookingPayment = asyncHandler(
  async (_req: Request, res: Response) => {
    const { bookingId } = getValidatedData<{ bookingId: string }>(
      res,
      "params",
    );
    const input = getValidatedData<{
      idempotencyKey: string;
      outcome: "approved" | "declined" | "error";
      method: "demo-wallet" | "demo-bank-transfer";
    }>(res, "body");
    const user = getAuthenticatedUser(res);
    if (user.role !== "customer") {
      throw new ApiError(
        "Only customer accounts can submit a demo booking payment.",
        403,
        { code: "CUSTOMER_ACCOUNT_REQUIRED" },
      );
    }
    const result = await bookingWorkflowService.processDemoPayment(
      getAuthenticatedUserId(res),
      bookingId,
      input,
    );

    return success(res, "Demo payment processed.", result);
  },
);

export const listPayments = asyncHandler(
  async (_req: Request, res: Response) => {
    const query = getValidatedData<PaymentListValidatedQuery>(
      res,
      "query",
    );

    const filters: PaymentFilters = {
      search: query.search,
      paymentReference: query.paymentReference,
      booking: query.booking,
      customer: query.customer,
      method: query.method,
      provider: query.provider,
      status: query.status,
      refundStatus: query.refundStatus,
      currency: query.currency,
      createdFrom: query.createdFrom,
      createdTo: query.createdTo,
      minAmount: query.minAmount,
      maxAmount: query.maxAmount,
    };

    const pagination: PaymentPaginationOptions = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await paymentService.listPayments(
      filters,
      pagination,
    );

    return success(res, "Payments retrieved successfully.", result);
  },
);

export const updatePayment = asyncHandler(
  async (_req: Request, res: Response) => {
    const { id } = getValidatedData<{ id: string }>(res, "params");

    const input = getValidatedData<UpdatePaymentValidatedInput>(
      res,
      "body",
    );

    const payment = await paymentService.updatePayment(
      id,
      input as UpdatePaymentInput,
    );

    return success(res, "Payment updated successfully.", payment);
  },
);

export const refundPayment = asyncHandler(
  async (_req: Request, res: Response) => {
    const { id } = getValidatedData<{ id: string }>(res, "params");

    const input = getValidatedData<RefundPaymentValidatedInput>(
      res,
      "body",
    );

    const payment = await paymentService.refundPayment(
      id,
      input as RefundPaymentInput,
    );

    return success(res, "Payment refund recorded successfully.", payment);
  },
);

export const deletePayment = asyncHandler(
  async (_req: Request, res: Response) => {
    const { id } = getValidatedData<{ id: string }>(res, "params");

    await paymentService.deletePayment(id);

    return success(res, "Payment deleted successfully.", null);
  },
);

export const countPayments = asyncHandler(
  async (_req: Request, res: Response) => {
    const query = getValidatedData<PaymentCountValidatedQuery>(
      res,
      "query",
    );

    const filters: PaymentFilters = {
      status: query.status,
      currency: query.currency,
      createdFrom: query.createdFrom,
      createdTo: query.createdTo,
    };

    const total = await paymentService.countPayments(filters);

    return success(res, "Payment count retrieved successfully.", {
      total,
    });
  },
);

export const getPaymentStatistics = asyncHandler(
  async (_req: Request, res: Response) => {
    const statistics = await paymentService.getPaymentStatistics();

    return success(
      res,
      "Payment statistics retrieved successfully.",
      statistics,
    );
  },
);

export const getPaymentRevenue = asyncHandler(
  async (_req: Request, res: Response) => {
    const revenue = await paymentService.getPaymentRevenue();

    return success(
      res,
      "Payment revenue retrieved successfully.",
      revenue,
    );
  },
);
