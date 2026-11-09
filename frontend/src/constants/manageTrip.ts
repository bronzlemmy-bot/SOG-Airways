export const MANAGE_TRIP_STATUSES = [
  "upcoming",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export const MANAGE_TRIP_ACTIONS = [
  "view",
  "modify",
  "cancel",
  "check-in",
  "download",
] as const;

export const MANAGE_TRIP_FILTERS = [
  "all",
  "upcoming",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export const MANAGE_TRIP_DEFAULTS = {
  sortBy: "date",
  sortOrder: "asc",
} as const;