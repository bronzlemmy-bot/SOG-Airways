import { Types } from "mongoose";
import { CheckIn } from "../../src/modules/check-in/models/check-in-record.model.js";

export const checkInId = "68a222222222222222222222";
export const checkInBookingId = "68a333333333333333333333";
export const checkInTicketId = "68a444444444444444444444";
export const checkInPassengerId = "68a555555555555555555555";
export const checkInFlightId = "68a666666666666666666666";
export const checkInCustomerId = "68a777777777777777777777";

export function makeCheckIn(overrides: Record<string, unknown> = {}) {
  return CheckIn.hydrate({
    _id: new Types.ObjectId(checkInId),
    booking: new Types.ObjectId(checkInBookingId),
    ticket: new Types.ObjectId(checkInTicketId),
    passenger: new Types.ObjectId(checkInPassengerId),
    flight: new Types.ObjectId(checkInFlightId),
    customer: new Types.ObjectId(checkInCustomerId),
    status: "pending",
    boardingPassStatus: "not_issued",
    checkInReference: "SOG-CI-1001",
    seatNumber: "14A",
    checkedInAt: null,
    cancelledAt: null,
    cancellationReason: null,
    boardingPassIssuedAt: null,
    boardingPassUsedAt: null,
    baggageCount: 1,
    baggageWeightKg: 18,
    specialAssistanceRequired: false,
    notes: null,
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
    ...overrides,
  });
}
