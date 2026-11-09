export const CHECKIN_STATUSES = [
  "not-checked-in",
  "in-progress",
  "checked-in",
  "cancelled",
] as const;

export const BOARDING_STATUSES = [
  "not-boarded",
  "boarding",
  "boarded",
  "missed",
] as const;

export const CHECKIN_DEADLINE_HOURS = {
  DOMESTIC: 1,
  INTERNATIONAL: 2,
} as const;

export const CHECKIN_OPEN_HOURS = {
  DOMESTIC: 24,
  INTERNATIONAL: 48,
} as const;

export const BOARDING_DEFAULTS = {
  gate: "TBD",
  boardingTime: "TBD",
} as const;

export const CHECKIN_DOCUMENT_TYPES = [
  "passport",
  "national-id",
  "drivers-license",
] as const;