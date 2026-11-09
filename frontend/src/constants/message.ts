export const MESSAGE_SENDER_TYPES = [
  "customer",
  "staff",
  "system",
] as const;

export const MESSAGE_STATUSES = [
  "sent",
  "delivered",
  "read",
  "failed",
] as const;

export const MESSAGE_MAX_LENGTH = 5000;

export const MESSAGE_ATTACHMENT_LIMITS = {
  maxFiles: 5,
  maxFileSizeMB: 10,
} as const;

export const MESSAGE_ATTACHMENT_TYPES = [
  "image",
  "pdf",
  "document",
] as const;

export const MESSAGE_DEFAULTS = {
  status: "sent",
} as const;