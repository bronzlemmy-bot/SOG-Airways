
import { randomBytes } from "node:crypto";
import type { ClientSession } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";
import { Booking } from "../../bookings/models/booking.model.js";
import { Flight } from "../../flights/models/flight.model.js";
import { Airport } from "../../airports/models/airport.model.js";
import { Passenger } from "../../passengers/models/passenger.model.js";
import { Payment } from "../../payments/models/payment.model.js";

import {
  TICKET_STATUSES,
  type TicketStatus,
} from "../models/ticket.model.js";

import { ticketRepository } from "../repositories/ticket.repository.js";

import type {
  CreateTicketInput,
  PaginatedTickets,
  TicketCountResult,
  TicketFilters,
  TicketPaginationOptions,
  TicketProfileResponse,
  TicketPdfData,
  UpdateTicketInput,
} from "../types/ticket.types.js";

function isDemoPaymentMetadata(metadata: unknown): boolean {
  if (
    typeof metadata !== "object" ||
    metadata === null ||
    Array.isArray(metadata)
  ) {
    return false;
  }

  const record = metadata as Record<string, unknown>;
  return record.mode === "DEMO" && record.demo === true;
}

export class TicketService {
  async issueTicket(
    input: CreateTicketInput,
    session?: ClientSession,
  ): Promise<TicketProfileResponse> {
    const existingTicket = await ticketRepository.findByBookingPassengerAndFlight(
      input.booking,
      input.passenger,
      input.flight,
      session,
    );

    if (existingTicket) {
      throw new ApiError(
        "A ticket already exists for this passenger, booking, and flight.",
        409,
        { code: "TICKET_ALREADY_EXISTS" },
      );
    }

    if (input.ticketNumber) {
      const ticketNumberExists =
        await ticketRepository.existsByTicketNumber(input.ticketNumber);

      if (ticketNumberExists) {
        throw new ApiError(
          "This ticket number is already in use.",
          409,
          { code: "TICKET_NUMBER_ALREADY_EXISTS" },
        );
      }
    }

    const [booking, payment, passenger] = await Promise.all([
      Booking.findById(input.booking).session(session ?? null).exec(),
      Payment.findById(input.payment).session(session ?? null).exec(),
      Passenger.findById(input.passenger).session(session ?? null).exec(),
    ]);

    if (!booking || !payment || !passenger) {
      throw new ApiError(
        "Ticket associations must refer to existing booking, payment, and passenger records.",
        400,
        { code: "INVALID_TICKET_ASSOCIATION" },
      );
    }

    if (
      booking.status !== "confirmed" ||
      booking.paymentStatus !== "paid" ||
      payment.status !== "completed" ||
      !isDemoPaymentMetadata(payment.metadata) ||
      payment.booking.toString() !== booking._id.toString() ||
      payment.customer.toString() !== booking.customer.toString() ||
      passenger.customer.toString() !== booking.customer.toString() ||
      booking.flight.toString() !== input.flight ||
      !booking.passengers.some(
        (passengerId) => passengerId.toString() === input.passenger,
      ) ||
      booking.bookingClass !== input.ticketClass
    ) {
      throw new ApiError(
        "Tickets can only be issued to passengers on a fully paid, confirmed booking.",
        409,
        { code: "TICKET_REQUIRES_COMPLETED_PAYMENT" },
      );
    }

    if (
      input.trackingReference &&
      booking.trackingReference &&
      input.trackingReference !== booking.trackingReference
    ) {
      throw new ApiError(
        "The ticket tracking reference must match its booking.",
        400,
        { code: "TICKET_TRACKING_REFERENCE_MISMATCH" },
      );
    }

    const ticket = await ticketRepository.create(
      {
        ...input,
        ticketNumber:
          input.ticketNumber ??
          `SOG-TKT-${randomBytes(10).toString("hex").toUpperCase()}`,
        trackingReference:
          input.trackingReference ?? booking.trackingReference ?? undefined,
      },
      session,
    );
    return this.toTicketProfile(ticket);
  }

  async getTicketByIdForAccess(
    ticketId: string,
    customerId: string | null,
    isAdmin: boolean,
  ): Promise<TicketProfileResponse> {
    const ticket = await ticketRepository.findById(ticketId);

    if (!ticket) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    if (
      !isAdmin &&
      (!customerId || ticket.customer.toString() !== customerId)
    ) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    return this.toTicketProfile(ticket);
  }

  async getTicketByNumberForAccess(
    ticketNumber: string,
    customerId: string | null,
    isAdmin: boolean,
  ): Promise<TicketProfileResponse> {
    const ticket =
      await ticketRepository.findByTicketNumber(ticketNumber);

    if (
      !ticket ||
      (!isAdmin &&
        (!customerId || ticket.customer.toString() !== customerId))
    ) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    return this.toTicketProfile(ticket);
  }

  async getBookingTicketsForAccess(
    bookingId: string,
    customerId: string | null,
    isAdmin: boolean,
  ): Promise<TicketProfileResponse[]> {
    const booking = await Booking.findById(bookingId).exec();

    if (
      !booking ||
      (!isAdmin &&
        (!customerId || booking.customer.toString() !== customerId))
    ) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    return this.getBookingTickets(bookingId);
  }

  async getTicketPdfData(
    ticketId: string,
    customerId: string | null,
    isAdmin: boolean,
  ): Promise<TicketPdfData> {
    const ticket = await ticketRepository.findById(ticketId);

    if (
      !ticket ||
      (!isAdmin &&
        (!customerId || ticket.customer.toString() !== customerId))
    ) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    const [booking, passenger, flight, payment] = await Promise.all([
      Booking.findById(ticket.booking).exec(),
      Passenger.findById(ticket.passenger).exec(),
      Flight.findById(ticket.flight).exec(),
      Payment.findById(ticket.payment).exec(),
    ]);

    if (!booking || !passenger || !flight || !payment) {
      throw new ApiError(
        "Ticket details could not be loaded from persisted records.",
        404,
        { code: "TICKET_DETAILS_NOT_FOUND" },
      );
    }

    if (
      ticket.status === "cancelled" ||
      ticket.status === "voided" ||
      booking.status !== "confirmed" ||
      booking.paymentStatus !== "paid" ||
      payment.status !== "completed" ||
      !isDemoPaymentMetadata(payment.metadata) ||
      payment.booking.toString() !== booking._id.toString() ||
      payment.customer.toString() !== booking.customer.toString() ||
      ticket.customer.toString() !== booking.customer.toString() ||
      ticket.flight.toString() !== booking.flight.toString() ||
      ticket.passenger.toString() !== passenger._id.toString() ||
      !booking.passengers.some(
        (passengerId) => passengerId.toString() === passenger._id.toString(),
      ) ||
      passenger.customer.toString() !== booking.customer.toString()
    ) {
      throw new ApiError(
        "A downloadable demo ticket requires a valid issued ticket and completed demo payment.",
        409,
        { code: "TICKET_PDF_NOT_AVAILABLE" },
      );
    }

    const [departureAirport, arrivalAirport] = await Promise.all([
      Airport.findById(flight.departureAirport)
        .select("airportCode name city")
        .exec(),
      Airport.findById(flight.arrivalAirport)
        .select("airportCode name city")
        .exec(),
    ]);

    if (!departureAirport || !arrivalAirport) {
      throw new ApiError(
        "Ticket airport details could not be loaded.",
        404,
        { code: "TICKET_AIRPORT_DETAILS_NOT_FOUND" },
      );
    }

    return {
      ticket: this.toTicketProfile(ticket),
      bookingReference: booking.bookingReference,
      passengerName: [
        passenger.firstName,
        passenger.middleName,
        passenger.lastName,
      ]
        .filter(Boolean)
        .join(" "),
      flightNumber: flight.flightNumber,
      departureAirportCode: departureAirport.airportCode,
      departureAirportName: departureAirport.name,
      departureAirportCity: departureAirport.city,
      arrivalAirportCode: arrivalAirport.airportCode,
      arrivalAirportName: arrivalAirport.name,
      arrivalAirportCity: arrivalAirport.city,
      scheduledDeparture: flight.scheduledDeparture,
      scheduledArrival: flight.scheduledArrival,
      paymentStatus: payment.status,
      demoPayment: true,
    };
  }

  async getTicketById(id: string): Promise<TicketProfileResponse> {
    const ticket = await ticketRepository.findById(id);

    if (!ticket) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    return this.toTicketProfile(ticket);
  }

  async getTicketByNumber(
    ticketNumber: string,
  ): Promise<TicketProfileResponse> {
    const ticket =
      await ticketRepository.findByTicketNumber(ticketNumber);

    if (!ticket) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    return this.toTicketProfile(ticket);
  }

  async listTickets(
    filters: TicketFilters = {},
    pagination: TicketPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "issuedAt",
      sortOrder: "desc",
    },
  ): Promise<PaginatedTickets> {
    const [tickets, totalItems] = await Promise.all([
      ticketRepository.findMany(filters, pagination),
      ticketRepository.count(filters),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      items: tickets.map((ticket) => this.toTicketProfile(ticket)),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1,
      },
    };
  }

  async getCustomerTickets(
    customerId: string,
    pagination: TicketPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "issuedAt",
      sortOrder: "desc",
    },
  ): Promise<PaginatedTickets> {
    return this.listTickets({ customer: customerId }, pagination);
  }

  async getFlightTickets(
    flightId: string,
    pagination: TicketPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "issuedAt",
      sortOrder: "desc",
    },
  ): Promise<PaginatedTickets> {
    return this.listTickets({ flight: flightId }, pagination);
  }

  async getBookingTickets(
    bookingId: string,
  ): Promise<TicketProfileResponse[]> {
    const tickets = await ticketRepository.findByBooking(bookingId);
    return tickets.map((ticket) => this.toTicketProfile(ticket));
  }

  async getPaymentTickets(
    paymentId: string,
  ): Promise<TicketProfileResponse[]> {
    const tickets = await ticketRepository.findByPayment(paymentId);
    return tickets.map((ticket) => this.toTicketProfile(ticket));
  }

  async updateTicket(
    id: string,
    updates: UpdateTicketInput,
  ): Promise<TicketProfileResponse> {
    const existingTicket = await ticketRepository.findById(id);

    if (!existingTicket) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    this.validateStatusTransition(existingTicket.status, updates.status);

    if (
      updates.status === "cancelled" &&
      !updates.cancellationReason &&
      !existingTicket.cancellationReason
    ) {
      throw new ApiError(
        "A cancellation reason is required when cancelling a ticket.",
        400,
        { code: "CANCELLATION_REASON_REQUIRED" },
      );
    }

    const updatedTicket = await ticketRepository.update(id, updates);

    if (!updatedTicket) {
      throw new ApiError("Unable to update ticket.", 500, {
        code: "TICKET_UPDATE_FAILED",
      });
    }

    return this.toTicketProfile(updatedTicket);
  }

  async cancelTicket(
    id: string,
    reason: string,
  ): Promise<TicketProfileResponse> {
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      throw new ApiError("A cancellation reason is required.", 400, {
        code: "CANCELLATION_REASON_REQUIRED",
      });
    }

    return this.updateTicket(id, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: normalizedReason,
    });
  }

  async deleteTicket(id: string): Promise<TicketProfileResponse> {
    const existingTicket = await ticketRepository.findById(id);

    if (!existingTicket) {
      throw new ApiError("Ticket not found.", 404, {
        code: "TICKET_NOT_FOUND",
      });
    }

    if (existingTicket.status === "used") {
      throw new ApiError(
        "A used ticket cannot be deleted.",
        409,
        { code: "USED_TICKET_CANNOT_BE_DELETED" },
      );
    }

    const deletedTicket = await ticketRepository.delete(id);

    if (!deletedTicket) {
      throw new ApiError("Unable to delete ticket.", 500, {
        code: "TICKET_DELETE_FAILED",
      });
    }

    return this.toTicketProfile(deletedTicket);
  }

  async countTickets(
    filters: TicketFilters = {},
  ): Promise<TicketCountResult> {
    const [total, statusCounts] = await Promise.all([
      ticketRepository.count(filters),
      ticketRepository.countByStatus(filters),
    ]);

    return {
      total,
      issued: statusCounts.issued ?? 0,
      checked_in: statusCounts.checked_in ?? 0,
      used: statusCounts.used ?? 0,
      cancelled: statusCounts.cancelled ?? 0,
      voided: statusCounts.voided ?? 0,
    };
  }

  private validateStatusTransition(
    currentStatus: TicketStatus,
    nextStatus?: TicketStatus,
  ): void {
    if (!nextStatus || currentStatus === nextStatus) {
      return;
    }

    const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
      issued: ["checked_in", "cancelled", "voided"],
      checked_in: ["used", "cancelled", "voided"],
      used: [],
      cancelled: [],
      voided: [],
    };

    if (!TICKET_STATUSES.includes(nextStatus)) {
      throw new ApiError("Invalid ticket status.", 400, {
        code: "INVALID_TICKET_STATUS",
      });
    }

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new ApiError(
        `Ticket cannot transition from '${currentStatus}' to '${nextStatus}'.`,
        409,
        { code: "INVALID_TICKET_STATUS_TRANSITION" },
      );
    }
  }

  private toTicketProfile(ticket: {
    _id: unknown;
    ticketNumber: string;
    booking: unknown;
    payment: unknown;
    customer: unknown;
    passenger: unknown;
    flight: unknown;
    trackingReference?: string | null;
    ticketClass: TicketProfileResponse["ticketClass"];
    status: TicketProfileResponse["status"];
    issuedAt: Date;
    cancelledAt?: Date | null;
    cancellationReason?: string | null;
    checkedInAt?: Date | null;
    usedAt?: Date | null;
    seatNumber?: string | null;
    fareAmount: number;
    currency: string;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): TicketProfileResponse {
    return {
      id: String(ticket._id),
      ticketNumber: ticket.ticketNumber,
      booking: String(ticket.booking),
      payment: String(ticket.payment),
      customer: String(ticket.customer),
      passenger: String(ticket.passenger),
      flight: String(ticket.flight),
      ...(ticket.trackingReference
        ? { trackingReference: ticket.trackingReference }
        : {}),
      ticketClass: ticket.ticketClass,
      status: ticket.status,
      issuedAt: ticket.issuedAt,
      ...(ticket.cancelledAt
        ? { cancelledAt: ticket.cancelledAt }
        : {}),
      ...(ticket.cancellationReason
        ? { cancellationReason: ticket.cancellationReason }
        : {}),
      ...(ticket.checkedInAt ? { checkedInAt: ticket.checkedInAt } : {}),
      ...(ticket.usedAt ? { usedAt: ticket.usedAt } : {}),
      ...(ticket.seatNumber ? { seatNumber: ticket.seatNumber } : {}),
      fareAmount: ticket.fareAmount,
      currency: ticket.currency,
      ...(ticket.notes ? { notes: ticket.notes } : {}),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}

export const ticketService = new TicketService();
