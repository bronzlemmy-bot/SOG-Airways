export const PAYMENT_METHOD_TYPES = [
  "card",
  "bank-transfer",
  "mobile-money",
  "wallet",
  "other",
] as const;

export const CARD_BRANDS = [
  "visa",
  "mastercard",
  "verve",
  "amex",
  "other",
] as const;

export const PAYMENT_METHOD_STATUSES = [
  "active",
  "inactive",
  "expired",
] as const;

export const PAYMENT_METHOD_DEFAULTS = {
  isDefault: false,
} as const;

export const CARD_NUMBER_RULES = {
  minLength: 12,
  maxLength: 19,
} as const;

export const CARD_CVV_RULES = {
  minLength: 3,
  maxLength: 4,
} as const;

export const CARD_EXPIRY_RULES = {
  monthMin: 1,
  monthMax: 12,
} as const;

export const PAYMENT_METHOD_CURRENCY_SCOPE = "all" as const;