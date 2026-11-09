export type PassengerStatus =
  | "active"
  | "inactive"
  | "blocked";

export type PassengerType =
  | "adult"
  | "child"
  | "infant";

export type Gender =
  | "male"
  | "female"
  | "other"
  | "prefer-not-to-say";

export interface PassengerDocument {
  type:
    | "passport"
    | "national-id"
    | "drivers-license"
    | "other";
  number: string;
  issuingCountry?: string;
  expiryDate?: string;
}

export interface Passenger {
  id: string;
  customerId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  passengerType: PassengerType;
  nationality?: string;
  nationalityCode?: string;
  status: PassengerStatus;
  document?: PassengerDocument;
  frequentFlyerNumber?: string;
  specialAssistance?: boolean;
  specialAssistanceNotes?: string;
  totalTrips: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}