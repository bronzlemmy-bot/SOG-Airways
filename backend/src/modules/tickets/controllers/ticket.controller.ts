
import type { Request, Response } from "express";
import PDFDocument from "pdfkit";

import { asyncHandler } from "../../../utils/async-handler.js";
import { ApiError } from "../../../utils/api-error.js";
import { customerService } from "../../customers/services/customer.service.js";

import { ticketService } from "../services/ticket.service.js";

import type {
  TicketFilters,
  TicketPaginationOptions,
} from "../types/ticket.types.js";

type ValidatedRequestData = {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

function getValidatedData(res: Response): ValidatedRequestData {
  return (res.locals.validated ?? {}) as ValidatedRequestData;
}

function getRequiredString(
  value: unknown,
  fieldName: string,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(`${fieldName} is required.`, 400, {
      code: "VALIDATION_ERROR",
    });
  }

  return value.trim();
}

function getPaginationOptions(
  query: Record<string, unknown>,
): TicketPaginationOptions {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new ApiError("Invalid pagination parameters.", 400, {
      code: "INVALID_PAGINATION",
    });
  }

  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder;

  return {
    page,
    limit,
    ...(typeof sortBy === "string"
      ? {
          sortBy: sortBy as TicketPaginationOptions["sortBy"],
        }
      : {}),
    ...(sortOrder === "asc" || sortOrder === "desc"
      ? { sortOrder }
      : {}),
  };
}

function getTicketAccessContext(res: Response): {
  userId: string;
  isAdmin: boolean;
} {
  const user = res.locals.authenticatedUser as
    | { id?: string; role?: string }
    | undefined;

  if (!user?.id) {
    throw new ApiError("Authentication is required.", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return {
    userId: user.id,
    isAdmin: user.role === "admin" || user.role === "super_admin",
  };
}

function getTicketFilters(
  query: Record<string, unknown>,
): TicketFilters {
  const filters: TicketFilters = {};

  const stringFields = [
    "search",
    "ticketNumber",
    "booking",
    "payment",
    "customer",
    "passenger",
    "flight",
    "ticketClass",
    "status",
    "currency",
  ] as const;

  for (const field of stringFields) {
    const value = query[field];

    if (typeof value === "string" && value.trim()) {
      switch (field) {
        case "search":
          filters.search = value.trim();
          break;
        case "ticketNumber":
          filters.ticketNumber = value.trim().toUpperCase();
          break;
        case "booking":
          filters.booking = value.trim();
          break;
        case "payment":
          filters.payment = value.trim();
          break;
        case "customer":
          filters.customer = value.trim();
          break;
        case "passenger":
          filters.passenger = value.trim();
          break;
        case "flight":
          filters.flight = value.trim();
          break;
        case "ticketClass":
          filters.ticketClass =
            value.trim() as TicketFilters["ticketClass"];
          break;
        case "status":
          filters.status = value.trim() as TicketFilters["status"];
          break;
        case "currency":
          filters.currency = value.trim().toUpperCase();
          break;
      }
    }
  }

  if (query.issuedFrom instanceof Date) {
    filters.issuedFrom = query.issuedFrom;
  }

  if (query.issuedTo instanceof Date) {
    filters.issuedTo = query.issuedTo;
  }

  if (query.minFare !== undefined) {
    const minFare = Number(query.minFare);

    if (Number.isFinite(minFare)) {
      filters.minFare = minFare;
    }
  }

  if (query.maxFare !== undefined) {
    const maxFare = Number(query.maxFare);

    if (Number.isFinite(maxFare)) {
      filters.maxFare = maxFare;
    }
  }

  return filters;
}

export const issueTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { body } = getValidatedData(res);
    const input = (body ?? req.body) as Parameters<
      typeof ticketService.issueTicket
    >[0];

    const ticket = await ticketService.issueTicket(input);

    res.status(201).json({
      success: true,
      message: "Ticket issued successfully.",
      data: ticket,
    });
  },
);

export const getTicketById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { params } = getValidatedData(res);
    const id = getRequiredString(
      params?.ticketId ?? req.params.ticketId,
      "Ticket ID",
    );

    const context = getTicketAccessContext(res);
    const customerId = context.isAdmin
      ? null
      : await customerService.getProfileIdForUser(context.userId);
    const ticket = await ticketService.getTicketByIdForAccess(
      id,
      customerId,
      context.isAdmin,
    );

    res.status(200).json({
      success: true,
      data: ticket,
    });
  },
);

export const getTicketByNumber = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { params } = getValidatedData(res);
    const ticketNumber = getRequiredString(
      params?.ticketNumber ?? req.params.ticketNumber,
      "Ticket number",
    );

    const context = getTicketAccessContext(res);
    const customerId = context.isAdmin
      ? null
      : await customerService.getProfileIdForUser(context.userId);
    const ticket = await ticketService.getTicketByNumberForAccess(
      ticketNumber,
      customerId,
      context.isAdmin,
    );

    res.status(200).json({
      success: true,
      data: ticket,
    });
  },
);

export const listTickets = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { query = {} } = getValidatedData(res);
    const pagination = getPaginationOptions(query);
    const filters = getTicketFilters(query);

    const result = await ticketService.listTickets(filters, pagination);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const getMyTickets = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const user = getTicketAccessContext(res);
    const customerId = await customerService.getProfileIdForUser(
      user.userId,
    );

    const { query = {} } = getValidatedData(res);
    const pagination = getPaginationOptions(query);

    const result = await ticketService.getCustomerTickets(
      customerId,
      pagination,
    );

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const getTicketsByFlight = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { params, query = {} } = getValidatedData(res);
    const flightId = getRequiredString(
      params?.flightId ?? req.params.flightId,
      "Flight ID",
    );

    const result = await ticketService.getFlightTickets(
      flightId,
      getPaginationOptions(query),
    );

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  },
);

export const getTicketsByBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { params } = getValidatedData(res);
    const bookingId = getRequiredString(
      params?.bookingId ?? req.params.bookingId,
      "Booking ID",
    );

    const context = getTicketAccessContext(res);
    const customerId = context.isAdmin
      ? null
      : await customerService.getProfileIdForUser(context.userId);
    const tickets = await ticketService.getBookingTicketsForAccess(
      bookingId,
      customerId,
      context.isAdmin,
    );

    res.status(200).json({
      success: true,
      data: tickets,
    });
  },
);

export const downloadTicketPdf = asyncHandler(
  async (req: Request, res: Response, next) => {
    const { params } = getValidatedData(res);
    const ticketId = getRequiredString(
      params?.ticketId ?? req.params.ticketId,
      "Ticket ID",
    );
    const context = getTicketAccessContext(res);
    const customerId = context.isAdmin
      ? null
      : await customerService.getProfileIdForUser(context.userId);
    const ticketData = await ticketService.getTicketPdfData(
      ticketId,
      customerId,
      context.isAdmin,
    );
    const safeTicketNumber = ticketData.ticket.ticketNumber.replace(
      /[^A-Z0-9-]/g,
      "",
    );
    const filename = `SOG-Airways-Ticket-${safeTicketNumber || ticketId}.pdf`;
    const document = new PDFDocument({
      size: "A4",
      margin: 48,
      info: {
        Title: `SOG Airways demo ticket ${ticketData.ticket.ticketNumber}`,
        Author: "SOG Airways",
        Subject: "DEMO TICKET - NOT VALID FOR TRAVEL",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
    res.setHeader("Cache-Control", "private, no-store");
    document.on("error", next);
    document.pipe(res);

    const ticket = ticketData.ticket;
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(date);
    const addField = (label: string, value: string) => {
      document
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#64748b")
        .text(label.toUpperCase());
      document
        .moveDown(0.25)
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#0f172a")
        .text(value || "Not available");
      document.moveDown(0.8);
    };

    document
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#0f172a")
      .text("SOG AIRWAYS");
    document
      .moveDown(0.3)
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#b45309")
      .text("DEMO TICKET - NOT VALID FOR TRAVEL");
    document
      .moveDown(0.4)
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#475569")
      .text("Simulated booking record. No real payment was taken.");
    document.moveDown(1.2);

    addField("Passenger", ticketData.passengerName);
    addField("Ticket number", ticket.ticketNumber);
    addField("Booking reference", ticketData.bookingReference);
    addField("Flight number", ticketData.flightNumber);
    addField(
      "Route",
      `${ticketData.departureAirportCity} (${ticketData.departureAirportCode}) to ${ticketData.arrivalAirportCity} (${ticketData.arrivalAirportCode})`,
    );
    addField("Departure (UTC)", formatDate(ticketData.scheduledDeparture));
    addField("Arrival (UTC)", formatDate(ticketData.scheduledArrival));
    addField("Cabin class", ticket.ticketClass.replaceAll("_", " "));
    addField("Seat", ticket.seatNumber ?? "Not assigned");
    addField("Tracking reference", ticket.trackingReference ?? "Not available");
    addField("Ticket status", ticket.status);
    addField("Payment status", "DEMO - completed");

    document
      .moveDown(0.4)
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#64748b")
      .text(
        "This document is for demonstration only. It is not a boarding pass, travel ticket, or proof of transportation.",
        { align: "center" },
      );
    document.end();
  },
);

export const getTicketsByPayment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { params } = getValidatedData(res);
    const paymentId = getRequiredString(
      params?.paymentId ?? req.params.paymentId,
      "Payment ID",
    );

    const tickets = await ticketService.getPaymentTickets(paymentId);

    res.status(200).json({
      success: true,
      data: tickets,
    });
  },
);

export const updateTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { body, params } = getValidatedData(res);
    const id = getRequiredString(
      params?.ticketId ?? req.params.ticketId,
      "Ticket ID",
    );

    const updates = (body ?? req.body) as Parameters<
      typeof ticketService.updateTicket
    >[1];

    const ticket = await ticketService.updateTicket(id, updates);

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully.",
      data: ticket,
    });
  },
);

export const cancelTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { body, params } = getValidatedData(res);
    const id = getRequiredString(
      params?.ticketId ?? req.params.ticketId,
      "Ticket ID",
    );

    const reason = getRequiredString(
      body?.reason ?? req.body.reason,
      "Cancellation reason",
    );

    const ticket = await ticketService.cancelTicket(id, reason);

    res.status(200).json({
      success: true,
      message: "Ticket cancelled successfully.",
      data: ticket,
    });
  },
);

export const deleteTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { params } = getValidatedData(res);
    const id = getRequiredString(
      params?.ticketId ?? req.params.ticketId,
      "Ticket ID",
    );

    const ticket = await ticketService.deleteTicket(id);

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully.",
      data: ticket,
    });
  },
);

export const countTickets = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { query = {} } = getValidatedData(res);
    const filters = getTicketFilters(query);
    const counts = await ticketService.countTickets(filters);

    res.status(200).json({
      success: true,
      data: counts,
    });
  },
);
