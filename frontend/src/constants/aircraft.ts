export const AIRCRAFT_STATUSES = [
  "active",
  "inactive",
  "maintenance",
  "retired",
] as const;

export const AIRCRAFT_TYPES = [
  "narrow-body",
  "wide-body",
  "regional",
  "turboprop",
  "private",
] as const;

export const AIRCRAFT_CABIN_CLASSES = [
  "economy",
  "premium-economy",
  "business",
  "first",
] as const;

export const AIRCRAFT_DEFAULTS = {
  minimumSeats: 1,
  maximumSeats: 1000,
} as const;