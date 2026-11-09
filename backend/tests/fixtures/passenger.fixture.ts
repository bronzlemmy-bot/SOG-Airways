import { Passenger } from "../../src/modules/passengers/models/passenger.model.js";

export const passengerId = "68a222222222222222222222";
export const passengerCustomerId = "68a111111111111111111111";

export function makePassenger(overrides: Record<string, unknown> = {}) {
  return Passenger.hydrate({
    _id: passengerId,
    customer: passengerCustomerId,
    firstName: "Avery",
    middleName: "J",
    lastName: "Example",
    dateOfBirth: new Date("1990-01-01T00:00:00.000Z"),
    gender: "prefer_not_to_say",
    nationality: "US",
    email: "avery@example.test",
    documentType: "passport",
    documentNumber: "P123456",
    documentIssuingCountry: "US",
    documentExpiryDate: new Date("2030-01-01T00:00:00.000Z"),
    specialAssistanceRequired: false,
    frequentFlyerNumber: "SG-123",
    status: "active",
    createdAt: new Date("2025-06-01T10:00:00.000Z"),
    updatedAt: new Date("2025-06-01T10:00:00.000Z"),
    ...overrides,
  });
}
