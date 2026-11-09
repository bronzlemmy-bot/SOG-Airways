
import type { Request, Response } from "express";

import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";

import { BookingService } from "../services/booking.service.js";
import { bookingWorkflowService } from "../services/booking-workflow.service.js";
import { customerService } from "../../customers/services/customer.service.js";

import type {
  BookingFilters,
  BookingPaginationOptions,
  CancelBookingInput,
  CreateBookingInput,
  CreateCustomerBookingInput,
  UpdateBookingInput,
} from "../types/booking.types.js";

const bookingService = new BookingService();

function getAuthenticatedUser(res: Response): {
  id: string;
  role?: string;
} {
  const user = res.locals.authenticatedUser as
    | { id?: string; role?: string }
    | undefined;

  if (!user?.id) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return { id: user.id, role: user.role };
}

function isAdmin(role?: string): boolean {
  return role === "admin" || role === "super_admin";
}

export class BookingController {
  createBooking = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const input = res.locals.validated.body as CreateBookingInput;

      const booking = await bookingService.createBooking(input);

      res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        data: booking,
      });
    },
  );

  createCustomerBooking = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const user = getAuthenticatedUser(res);
      if (user.role !== "customer") {
        throw new ApiError(
          "Only customer accounts can create customer bookings.",
          403,
          { code: "CUSTOMER_ACCOUNT_REQUIRED" },
        );
      }
      const input = res.locals.validated
        .body as CreateCustomerBookingInput;
      const result =
        await bookingWorkflowService.createCustomerBooking(
          user.id,
          input,
        );

      res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        data: result,
      });
    },
  );

  getMyBookings = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const user = getAuthenticatedUser(res);
      const bookings = await bookingWorkflowService.getMyBookings(
        user.id,
      );

      res.status(200).json({
        success: true,
        message: "Customer bookings retrieved successfully.",
        data: bookings,
      });
    },
  );

  getBookingDetails = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = getAuthenticatedUser(res);
      const bookingId = String(req.params.id);
      const result =
        await bookingWorkflowService.getBookingDetailsForAccess(
          bookingId,
          user.id,
          isAdmin(user.role),
        );

      res.status(200).json({
        success: true,
        message: "Booking details retrieved successfully.",
        data: result,
      });
    },
  );

  getBookingById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = getAuthenticatedUser(res);
      const bookingId = String(req.params.id);

      const booking = await bookingService.getBookingByIdForAccess(
        bookingId,
        user.id,
        isAdmin(user.role),
      );

      res.status(200).json({
        success: true,
        message: "Booking retrieved successfully.",
        data: booking,
      });
    },
  );

  getBookingByReference = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = getAuthenticatedUser(res);
      const bookingReference = String(req.params.bookingReference);

      const booking =
        await bookingService.getBookingByReferenceForAccess(
          bookingReference,
          user.id,
          isAdmin(user.role),
        );

      res.status(200).json({
        success: true,
        message: "Booking retrieved successfully.",
        data: booking,
      });
    },
  );

  listBookings = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = (res.locals.validated?.query ??
        req.query) as Record<string, unknown>;

      const filters: BookingFilters = {
        search:
          typeof query.search === "string" ? query.search : undefined,
        bookingReference:
          typeof query.bookingReference === "string"
            ? query.bookingReference
            : undefined,
        customer:
          typeof query.customer === "string"
            ? query.customer
            : undefined,
        flight:
          typeof query.flight === "string" ? query.flight : undefined,
        status: query.status as BookingFilters["status"],
        paymentStatus:
          query.paymentStatus as BookingFilters["paymentStatus"],
        bookingClass:
          query.bookingClass as BookingFilters["bookingClass"],
        currency:
          typeof query.currency === "string" ? query.currency : undefined,
        bookedFrom:
          query.bookedFrom === undefined
            ? undefined
            : new Date(String(query.bookedFrom)),
        bookedTo:
          query.bookedTo === undefined
            ? undefined
            : new Date(String(query.bookedTo)),
        minAmount:
          query.minAmount === undefined
            ? undefined
            : Number(query.minAmount),
        maxAmount:
          query.maxAmount === undefined
            ? undefined
            : Number(query.maxAmount),
      };

      const pagination: BookingPaginationOptions = {
        page: Number(query.page ?? 1),
        limit: Number(query.limit ?? 10),
        sortBy:
          query.sortBy as BookingPaginationOptions["sortBy"],
        sortOrder:
          query.sortOrder as BookingPaginationOptions["sortOrder"],
      };

      const result = await bookingService.listBookings(
        filters,
        pagination,
      );

      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully.",
        data: result.items,
        pagination: result.pagination,
      });
    },
  );

  updateBooking = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const bookingId = String(req.params.id);

      const input = res.locals.validated.body as UpdateBookingInput;

      const booking = await bookingService.updateBooking(
        bookingId,
        input,
      );

      res.status(200).json({
        success: true,
        message: "Booking updated successfully.",
        data: booking,
      });
    },
  );

  cancelBooking = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = getAuthenticatedUser(res);
      const bookingId = String(req.params.id);

      const input = res.locals.validated.body as CancelBookingInput;
      const customerId = isAdmin(user.role)
        ? undefined
        : await customerService.getProfileIdForUser(user.id);

      const booking = await bookingService.cancelBooking(
        bookingId,
        input.cancellationReason,
        customerId,
      );

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully.",
        data: booking,
      });
    },
  );

  deleteBooking = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const bookingId = String(req.params.id);

      await bookingService.deleteBooking(bookingId);

      res.status(200).json({
        success: true,
        message: "Booking deleted successfully.",
      });
    },
  );

  countBookings = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = (res.locals.validated?.query ??
        req.query) as Record<string, unknown>;

      const filters: BookingFilters = {
        status: query.status as BookingFilters["status"],
        paymentStatus:
          query.paymentStatus as BookingFilters["paymentStatus"],
        bookedFrom:
          query.bookedFrom === undefined
            ? undefined
            : new Date(String(query.bookedFrom)),
        bookedTo:
          query.bookedTo === undefined
            ? undefined
            : new Date(String(query.bookedTo)),
      };

      const total = await bookingService.countBookings(filters);

      res.status(200).json({
        success: true,
        message: "Booking count retrieved successfully.",
        data: { total },
      });
    },
  );

  getBookingStatistics = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const statistics = await bookingService.getBookingStatistics();

      res.status(200).json({
        success: true,
        message: "Booking statistics retrieved successfully.",
        data: statistics,
      });
    },
  );

  getBookingRevenue = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const revenue = await bookingService.getBookingRevenue();

      res.status(200).json({
        success: true,
        message: "Booking revenue retrieved successfully.",
        data: revenue,
      });
    },
  );
}

export const bookingController = new BookingController();
