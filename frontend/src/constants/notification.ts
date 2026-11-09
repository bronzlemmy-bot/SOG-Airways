export const NOTIFICATION_TYPES = [
  "booking",
  "flight",
  "payment",
  "travel",
  "check-in",
  "system",
] as const;

export const NOTIFICATION_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

export const NOTIFICATION_DEFAULTS = {
  priority: "normal",
  read: false,
} as const;

export const NOTIFICATION_PAGE_SIZE = 10;

export const NOTIFICATION_MAX_PAGE_SIZE = 100;