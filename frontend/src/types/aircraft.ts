export type AircraftStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "retired";

export interface Aircraft {
  id: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  aircraftType: string;
  totalSeats: number;
  economySeats: number;
  premiumEconomySeats?: number;
  businessSeats: number;
  firstClassSeats?: number;
  status: AircraftStatus;
  yearOfManufacture?: number;
  range?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}