export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "refunded",
] as const;

export const BOOKING_TYPES = [
  "one-way",
  "round-trip",
  "multi-city",
] as const;

export const BOOKING_CLASSES = [
  "economy",
  "premium-economy",
  "business",
  "first",
] as const;

export const BOOKING_PASSENGER_TYPES = [
  "adult",
  "child",
  "infant",
] as const;

export const BOOKING_REFERENCE_LENGTH = 6;

export const BOOKING_DEFAULTS = {
  currency: "NGN",
  passengerCount: 1,
} as const;