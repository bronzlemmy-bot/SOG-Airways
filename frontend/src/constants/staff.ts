export const STAFF_STATUSES = [
  "active",
  "inactive",
  "suspended",
  "on-leave",
] as const;

export const STAFF_ROLES = [
  "admin",
  "manager",
  "agent",
  "customer-service",
  "flight-operations",
  "finance",
  "support",
  "staff",
] as const;

export const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
] as const;

export const STAFF_DEPARTMENTS = [
  "Administration",
  "Customer Service",
  "Flight Operations",
  "Finance",
  "Human Resources",
  "IT",
  "Marketing",
  "Sales",
  "Security",
  "Support",
] as const;

export const STAFF_DEFAULTS = {
  status: "active",
  employmentType: "full-time",
} as const;