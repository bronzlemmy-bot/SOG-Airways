export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "successful",
  "failed",
  "cancelled",
  "refunded",
  "partially-refunded",
] as const;

export const PAYMENT_DEFAULTS = {
  currency: "NGN",
  status: "pending",
} as const;

export const PAYMENT_CURRENCY = {
  codeLength: 3,
  standard: "ISO-4217",
} as const;

export const PAYMENT_CURRENCY_SCOPE = "all" as const;

export const PAYMENT_CURRENCY_DECIMALS = 2;

export const PAYMENT_REFERENCE_PREFIX = "SOG-PAY";

export const PAYMENT_AMOUNT_LIMITS = {
  minimum: 0,
  maximum: 100000000,
} as const;