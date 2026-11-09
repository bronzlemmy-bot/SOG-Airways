export const REPORT_TYPES = [
  "sales",
  "bookings",
  "flights",
  "passengers",
  "customers",
  "payments",
  "revenue",
  "operations",
] as const;

export const REPORT_PERIODS = [
  "today",
  "yesterday",
  "this-week",
  "last-week",
  "this-month",
  "last-month",
  "this-quarter",
  "last-quarter",
  "this-year",
  "last-year",
  "custom",
] as const;

export const REPORT_FORMATS = [
  "pdf",
  "csv",
  "xlsx",
] as const;

export const REPORT_SORT_ORDERS = [
  "asc",
  "desc",
] as const;

export const REPORT_DEFAULTS = {
  period: "this-month",
  format: "pdf",
  sortOrder: "desc",
} as const;