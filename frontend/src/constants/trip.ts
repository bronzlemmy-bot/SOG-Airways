export const TRIP_STATUSES = [
  "upcoming",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export const TRIP_TYPES = [
  "one-way",
  "round-trip",
  "multi-city",
] as const;

export const TRIP_DEFAULTS = {
  status: "upcoming",
  passengerCount: 1,
} as const;

export const TRIP_FILTERS = [
  "all",
  "upcoming",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export const TRIP_SORT_OPTIONS = [
  "date-asc",
  "date-desc",
  "destination-asc",
  "destination-desc",
  "status",
] as const;