export const AIRPORT_STATUSES = [
  "active",
  "inactive",
  "closed",
  "maintenance",
] as const;

export const AIRPORT_CODE_LENGTHS = {
  iata: 3,
  icao: 4,
} as const;

export const AIRPORT_DEFAULTS = {
  countryCode: "NG",
  timezone: "Africa/Lagos",
} as const;

export const AIRPORT_FACILITIES = [
  "check-in",
  "baggage-claim",
  "lounges",
  "restaurants",
  "shops",
  "parking",
  "car-rental",
  "currency-exchange",
  "wifi",
  "medical-services",
] as const;