export const PASSENGER_STATUSES = [
  "active",
  "inactive",
  "blocked",
] as const;

export const PASSENGER_TYPES = [
  "adult",
  "child",
  "infant",
] as const;

export const PASSENGER_GENDERS = [
  "male",
  "female",
  "other",
  "prefer-not-to-say",
] as const;

export const PASSENGER_DOCUMENT_TYPES = [
  "passport",
  "national-id",
  "drivers-license",
  "other",
] as const;

export const PASSENGER_DEFAULTS = {
  passengerType: "adult",
  status: "active",
} as const;

export const PASSENGER_SEARCH_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "frequentFlyerNumber",
] as const;