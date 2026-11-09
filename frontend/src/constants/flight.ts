export const FLIGHT_STATUSES = [
  "scheduled",
  "boarding",
  "departed",
  "in-air",
  "landed",
  "delayed",
  "cancelled",
  "diverted",
] as const;

export const FLIGHT_TYPES = [
  "domestic",
  "international",
] as const;

export const CABIN_CLASSES = [
  "economy",
  "premium-economy",
  "business",
  "first",
] as const;

export const FLIGHT_DEFAULTS = {
  currency: "NGN",
  availableSeats: 0,
  totalSeats: 0,
} as const;

export const FLIGHT_NUMBER_RULES = {
  prefix: "SOG",
  minDigits: 3,
  maxDigits: 4,
} as const;

export const FLIGHT_DELAY_THRESHOLDS = {
  minor: 15,
  moderate: 60,
  severe: 180,
} as const;