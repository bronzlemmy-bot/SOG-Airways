export const SUPPORT_TICKET_STATUSES = [
  "open",
  "in-progress",
  "waiting-for-customer",
  "resolved",
  "closed",
] as const;

export const SUPPORT_TICKET_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

export const SUPPORT_CATEGORIES = [
  "booking",
  "flight",
  "payment",
  "check-in",
  "baggage",
  "refund",
  "technical",
  "other",
] as const;

export const SUPPORT_DEFAULTS = {
  status: "open",
  priority: "normal",
  category: "other",
} as const;

export const SUPPORT_TICKET_PREFIX = "SOG";

export const SUPPORT_MESSAGE_MAX_LENGTH = 5000;

export const SUPPORT_SUBJECT_MAX_LENGTH = 200;