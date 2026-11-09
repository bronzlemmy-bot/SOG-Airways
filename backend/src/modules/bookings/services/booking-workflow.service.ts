import { createHash, randomBytes } from "node:crypto";
import mongoose from "mongoose";

import { ApiError } from "../../../utils/api-error.js";
import { Aircraft } from "../../aircraft/models/aircraft.model.js";
import { customerService } from "../../customers/services/customer.service.js";
import { Flight } from "../../flights/models/flight.model.js";
import { flightService } from "../../flights/services/flight.service.js";
import { passengerService } from "../../passengers/services/passenger.service.js";
import { Booking } from "../models/booking.model.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { bookingService } from "./booking.service.js";
import { paymentService } from "../../payments/services/payment.service.js";
import { Payment } from "../../payments/models/payment.model.js";
import { ticketService } from "../../tickets/services/ticket.service.js";

import type {
  BookingClass,
} from "../models/booking.model.js";
import type {
  BookingProfileResponse,
  CreateCustomerBookingInput,
  CustomerBookingDetailsResponse,
  DemoPaymentWorkflowResponse,
} from "../types/booking.types.js";
import type {
  DemoPaymentMethod,
  DemoPaymentOutcome,
} from "../../payments/types/payment.types.js";
import type { PassengerProfileResponse } from "../../passengers/types/passenger.types.js";
import type { TicketProfileResponse } from "../../tickets/types/ticket.types.js";

const BOOKING_HOLD_MINUTES = 15;

function createReference(prefix: string): string {
  return `${prefix}-${randomBytes(12).toString("hex").toUpperCase()}`;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function createRequestHash(input: CreateCustomerBookingInput): string {
  const passengers = input.passengers.map((passenger) =>
    Object.fromEntries(
      Object.entries(passenger)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => [
          key,
          value instanceof Date ? value.toISOString() : value ?? null,
        ]),
    ),
  );

  return createHash("sha256")
    .update(
      JSON.stringify({
        flightId: input.flightId,
        bookingClass: input.bookingClass,
        passengers,
      }),
    )
    .digest("hex");
}

function getAircraftCabinCapacity(
  capacity: {
    economy: number;
    premiumEconomy: number;
    business: number;
    first: number;
  },
  cabin: BookingClass,
): number {
  switch (cabin) {
    case "economy":
      return capacity.economy;
    case "premium_economy":
      return capacity.premiumEconomy;
    case "business":
      return capacity.business;
    case "first":
      return capacity.first;
  }
}

function getTrackingReference(booking: {
  trackingReference?: string;
}): string {
  if (!booking.trackingReference) {
    throw new ApiError(
      "The booking does not have a tracking reference.",
      500,
      { code: "BOOKING_TRACKING_REFERENCE_MISSING" },
    );
  }

  return booking.trackingReference;
}

function matchesDemoPaymentRequest(
  metadata: unknown,
  outcome: DemoPaymentOutcome,
  method: DemoPaymentMethod,
): boolean {
  if (
    typeof metadata !== "object" ||
    metadata === null ||
    Array.isArray(metadata)
  ) {
    return false;
  }

  const record = metadata as Record<string, unknown>;
  return (
    record.mode === "DEMO" &&
    record.demo === true &&
    record.outcome === outcome &&
    record.method === method
  );
}

export class BookingWorkflowService {
  async createCustomerBooking(
    userId: string,
    input: CreateCustomerBookingInput,
  ): Promise<CustomerBookingDetailsResponse> {
    const requestHash = createRequestHash(input);
    const session = await mongoose.startSession();
    let bookingId = "";
    let customerId = "";

    try {
      await session.withTransaction(async () => {
        customerId = await customerService.getOrCreateProfileId(
          userId,
          session,
        );

        const existing = await bookingRepository.findByIdempotencyKey(
          customerId,
          input.idempotencyKey,
          session,
        );

        if (existing) {
          if (existing.requestHash !== requestHash) {
            throw new ApiError(
              "This booking request key was already used with different details.",
              409,
              { code: "BOOKING_IDEMPOTENCY_CONFLICT" },
            );
          }

          bookingId = existing._id.toString();
          return;
        }

        const now = new Date();
        const flight = await Flight.findById(input.flightId)
          .session(session)
          .exec();

        if (!flight) {
          throw new ApiError("Selected flight was not found.", 404, {
            code: "FLIGHT_NOT_FOUND",
          });
        }

        if (
          !["scheduled", "delayed"].includes(flight.status) ||
          flight.scheduledDeparture <= now
        ) {
          throw new ApiError(
            "This flight is not currently available for booking.",
            409,
            { code: "FLIGHT_NOT_BOOKABLE" },
          );
        }

        const fare = flight.fareSchedule?.[input.bookingClass];
        if (!fare) {
          throw new ApiError(
            "A backend-configured fare is not available for the selected cabin.",
            409,
            { code: "FLIGHT_FARE_UNAVAILABLE" },
          );
        }

        const aircraft = await Aircraft.findById(flight.aircraft)
          .session(session)
          .exec();
        if (!aircraft || aircraft.status !== "active") {
          throw new ApiError(
            "The aircraft assigned to this flight is not available.",
            409,
            { code: "FLIGHT_AIRCRAFT_UNAVAILABLE" },
          );
        }

        const capacity = getAircraftCabinCapacity(
          aircraft.capacity,
          input.bookingClass,
        );
        if (capacity < input.passengers.length) {
          throw new ApiError(
            "There are not enough seats available in this cabin.",
            409,
            { code: "FLIGHT_CAPACITY_EXCEEDED" },
          );
        }

        const lock = await Flight.updateOne(
          { _id: flight._id },
          { $inc: { bookingRevision: 1 } },
          { session },
        ).exec();
        if (lock.matchedCount !== 1) {
          throw new ApiError("Selected flight was not found.", 404, {
            code: "FLIGHT_NOT_FOUND",
          });
        }

        const occupancy = await Booking.aggregate<{ total: number }>([
          {
            $match: {
              flight: flight._id,
              bookingClass: input.bookingClass,
              $or: [
                { status: "confirmed" },
                {
                  status: "pending",
                  expiresAt: { $gt: now },
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$passengerCount" },
            },
          },
        ])
          .session(session)
          .exec();
        const occupiedSeats = occupancy[0]?.total ?? 0;

        if (occupiedSeats + input.passengers.length > capacity) {
          throw new ApiError(
            "There are not enough seats available in this cabin.",
            409,
            { code: "FLIGHT_CAPACITY_EXCEEDED" },
          );
        }

        const passengers: PassengerProfileResponse[] = [];
        for (const passenger of input.passengers) {
          passengers.push(
            await passengerService.createPassenger(
              {
                ...passenger,
                customer: customerId,
              },
              session,
            ),
          );
        }

        const baseFare = roundMoney(fare.baseFare * passengers.length);
        const taxes = roundMoney(fare.taxes * passengers.length);
        const fees = roundMoney(fare.fees * passengers.length);
        const totalAmount = roundMoney(baseFare + taxes + fees);
        const booking = await bookingRepository.create(
          {
            customer: customerId,
            flight: flight._id.toString(),
            passengers: passengers.map((passenger) => passenger.id),
            passengerCount: passengers.length,
            bookingClass: input.bookingClass,
            currency: fare.currency,
            baseFare,
            taxes,
            fees,
            discount: 0,
            totalAmount,
            idempotencyKey: input.idempotencyKey,
            requestHash,
            bookingReference: createReference("SOG"),
            trackingReference: createReference("SOG-TRK"),
            expiresAt: new Date(
              now.getTime() + BOOKING_HOLD_MINUTES * 60_000,
            ),
          },
          session,
        );
        bookingId = booking._id.toString();
      });
    } finally {
      await session.endSession();
    }

    if (!bookingId) {
      throw new ApiError("Booking could not be created.", 500, {
        code: "BOOKING_CREATE_FAILED",
      });
    }

    return this.getBookingDetailsForAccess(bookingId, userId, false);
  }

  async processDemoPayment(
    userId: string,
    bookingId: string,
    input: {
      idempotencyKey: string;
      outcome: DemoPaymentOutcome;
      method: DemoPaymentMethod;
    },
  ): Promise<DemoPaymentWorkflowResponse> {
    const customerId = await customerService.getProfileIdForUser(userId);
    const session = await mongoose.startSession();
    let responseBookingId = "";
    let responsePaymentId = "";

    try {
      await session.withTransaction(async () => {
        const booking = await Booking.findOne({
          _id: bookingId,
          customer: customerId,
        })
          .session(session)
          .exec();

        if (!booking) {
          throw new ApiError("Booking not found.", 404, {
            code: "BOOKING_NOT_FOUND",
          });
        }

        const existingAttempt = await Payment.findOne({
          idempotencyKey: input.idempotencyKey,
        })
          .session(session)
          .exec();

        if (existingAttempt) {
          if (
            existingAttempt.booking.toString() !== booking._id.toString() ||
            existingAttempt.customer.toString() !== customerId ||
            !matchesDemoPaymentRequest(
              existingAttempt.metadata,
              input.outcome,
              input.method,
            )
          ) {
            throw new ApiError(
              "This payment request key has already been used.",
              409,
              { code: "PAYMENT_IDEMPOTENCY_CONFLICT" },
            );
          }

          responseBookingId = booking._id.toString();
          responsePaymentId = existingAttempt._id.toString();
          return;
        }

        const completedPayment = await Payment.findOne({
          booking: booking._id,
          customer: customerId,
          status: "completed",
          "metadata.mode": "DEMO",
        })
          .session(session)
          .exec();

        if (completedPayment) {
          responseBookingId = booking._id.toString();
          responsePaymentId = completedPayment._id.toString();
          return;
        }

        if (
          booking.status !== "pending" ||
          booking.paymentStatus !== "unpaid" ||
          !booking.expiresAt ||
          booking.expiresAt <= new Date()
        ) {
          throw new ApiError(
            "This booking is no longer available for payment.",
            409,
            { code: "BOOKING_NOT_PAYABLE" },
          );
        }

        const payment = await paymentService.createDemoPayment(
          {
            booking: booking._id.toString(),
            customer: customerId,
            amount: booking.totalAmount,
            currency: booking.currency,
            idempotencyKey: input.idempotencyKey,
            outcome: input.outcome,
            method: input.method,
          },
          session,
        );

        const approved = input.outcome === "approved";
        const updatedBooking = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            customer: customerId,
            status: "pending",
            paymentStatus: "unpaid",
          },
          {
            $set: approved
              ? {
                  status: "confirmed",
                  paymentStatus: "paid",
                  expiresAt: null,
                }
              : {
                  status: "cancelled",
                  paymentStatus: "failed",
                  expiresAt: null,
                  cancelledAt: new Date(),
                  cancellationReason:
                    "The demo payment did not receive approval.",
                },
          },
          { new: true, session, runValidators: true },
        ).exec();

        if (!updatedBooking) {
          throw new ApiError(
            "Booking payment state changed while processing.",
            409,
            { code: "BOOKING_PAYMENT_STATE_CONFLICT" },
          );
        }

        if (approved) {
          const farePerPassenger = roundMoney(
            booking.totalAmount / booking.passengerCount,
          );
          for (const passengerId of booking.passengers) {
            await ticketService.issueTicket(
              {
                booking: booking._id.toString(),
                payment: payment.id,
                customer: customerId,
                passenger: passengerId.toString(),
                flight: booking.flight.toString(),
                ticketClass: booking.bookingClass,
                fareAmount: farePerPassenger,
                currency: booking.currency,
                trackingReference: booking.trackingReference ?? undefined,
                notes: "DEMO TICKET - NOT VALID FOR TRAVEL.",
              },
              session,
            );
          }
        }

        responseBookingId = updatedBooking._id.toString();
        responsePaymentId = payment.id;
      });
    } finally {
      await session.endSession();
    }

    if (!responseBookingId || !responsePaymentId) {
      throw new ApiError("Demo payment could not be processed.", 500, {
        code: "DEMO_PAYMENT_PROCESSING_FAILED",
      });
    }

    const [booking, payment, tickets] = await Promise.all([
      bookingService.getBookingById(responseBookingId),
      paymentService.getPaymentById(responsePaymentId),
      ticketService.getBookingTickets(responseBookingId),
    ]);

    return {
      booking,
      payment,
      tickets,
      trackingReference: getTrackingReference(booking),
    };
  }

  async getBookingDetailsForAccess(
    bookingId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<CustomerBookingDetailsResponse> {
    const customerId = isAdmin
      ? null
      : await customerService.getProfileIdForUser(userId);
    const bookingRecord = await Booking.findById(bookingId).exec();

    if (
      !bookingRecord ||
      (!isAdmin &&
        (!customerId ||
          bookingRecord.customer.toString() !== customerId))
    ) {
      throw new ApiError("Booking not found.", 404, {
        code: "BOOKING_NOT_FOUND",
      });
    }

    const booking: BookingProfileResponse =
      await bookingService.getBookingById(bookingId);
    const [flight, passengers, tickets, paymentRecord] = await Promise.all([
      flightService.getFlightById(booking.flight),
      Promise.all(
        booking.passengers.map((passengerId) =>
          passengerService.getPassengerById(passengerId),
        ),
      ),
      ticketService.getBookingTickets(bookingId),
      Payment.findOne({ booking: bookingRecord._id }).exec(),
    ]);
    const payment = paymentRecord
      ? await paymentService.getPaymentById(paymentRecord._id.toString())
      : undefined;

    return {
      booking,
      flight,
      passengers,
      tickets,
      ...(payment ? { payment } : {}),
      ...(bookingRecord.trackingReference
        ? { trackingReference: bookingRecord.trackingReference }
        : {}),
    };
  }

  async getMyBookings(
    userId: string,
  ): Promise<BookingProfileResponse[]> {
    const customerId = await customerService.getProfileIdForUser(userId);
    const result = await bookingService.listBookings(
      { customer: customerId },
      {
        page: 1,
        limit: 100,
        sortBy: "bookedAt",
        sortOrder: "desc",
      },
    );
    return result.items;
  }

}

export const bookingWorkflowService = new BookingWorkflowService();
