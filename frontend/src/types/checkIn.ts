export type CheckInStatus =
  | "not-checked-in"
  | "in-progress"
  | "checked-in"
  | "cancelled";

export type BoardingStatus =
  | "not-boarded"
  | "boarding"
  | "boarded"
  | "missed";

export interface CheckInPassenger {
  passengerId: string;
  firstName: string;
  lastName: string;
  seatNumber?: string;
  seatClass: "economy" | "premium-economy" | "business" | "first";
  checkedIn: boolean;
  boardingPassIssued: boolean;
}

export interface CheckIn {
  id: string;
  bookingId: string;
  bookingReference: string;
  flightId: string;
  flightNumber: string;
  userId: string;
  passengers: CheckInPassenger[];
  status: CheckInStatus;
  boardingStatus: BoardingStatus;
  checkInTime?: string;
  boardingPassUrl?: string;
  gate?: string;
  boardingTime?: string;
  baggageCount?: number;
  specialAssistance?: boolean;
  specialAssistanceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PersistedCheckInStatus =
  | "pending"
  | "checked_in"
  | "cancelled";

export type BoardingPassStatus =
  | "not_issued"
  | "issued"
  | "used"
  | "voided";

export interface CheckInRecord {
  id: string;
  booking: string;
  ticket: string;
  passenger: string;
  flight: string;
  customer: string;
  status: PersistedCheckInStatus;
  boardingPassStatus: BoardingPassStatus;
  checkInReference: string | null;
  seatNumber: string | null;
  checkedInAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  boardingPassIssuedAt: string | null;
  boardingPassUsedAt: string | null;
  baggageCount: number;
  baggageWeightKg: number;
  specialAssistanceRequired: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}