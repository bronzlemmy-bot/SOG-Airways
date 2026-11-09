export type AirportStatus =
  | "active"
  | "inactive"
  | "closed"
  | "maintenance";

export interface Airport {
  id: string;
  code: string;
  iataCode: string;
  icaoCode?: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  terminalCount?: number;
  status: AirportStatus;
  latitude?: number;
  longitude?: number;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facilities?: string[];
  createdAt: string;
  updatedAt: string;
}