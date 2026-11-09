export const CUSTOMER_STATUSES = [
  "active",
  "inactive",
  "suspended",
  "blocked",
] as const;

export const CUSTOMER_TYPES = [
  "individual",
  "corporate",
  "travel-agent",
] as const;

export const CUSTOMER_DEFAULTS = {
  language: "en",
  currency: "NGN",
  countryCode: "NG",
} as const;

export const CUSTOMER_DOCUMENT_TYPES = [
  "passport",
  "national-id",
  "drivers-license",
  "other",
] as const;