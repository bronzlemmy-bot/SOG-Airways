export type CustomerStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "blocked";

export type CustomerType =
  | "individual"
  | "corporate"
  | "travel-agent";

export interface CustomerAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
}

export interface Customer {
  id: string;
  userId?: string;
  customerNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalityCode?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  address?: CustomerAddress;
  preferredLanguage?: string;
  preferredCurrency?: string;
  frequentFlyerNumber?: string;
  totalBookings: number;
  totalTrips: number;
  createdAt: string;
  updatedAt: string;
}