
import type {
  BoardingPassStatus,
  CheckInStatus,
} from "../models/check-in-record.model.js";

export interface CreateCheckInInput {
  booking: string;
  ticket: string;
  passenger: string;
  flight: string;
  customer: string;
  status?: CheckInStatus;
  boardingPassStatus?: BoardingPassStatus;
  checkInReference?: string;
  seatNumber?: string | null;
  checkedInAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
  boardingPassIssuedAt?: Date | null;
  boardingPassUsedAt?: Date | null;
  baggageCount?: number;
  baggageWeightKg?: number;
  specialAssistanceRequired?: boolean;
  notes?: string | null;
}

export interface UpdateCheckInInput {
  status?: CheckInStatus;
  boardingPassStatus?: BoardingPassStatus;
  seatNumber?: string | null;
  checkedInAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
  boardingPassIssuedAt?: Date | null;
  boardingPassUsedAt?: Date | null;
  baggageCount?: number;
  baggageWeightKg?: number;
  specialAssistanceRequired?: boolean;
  notes?: string | null;
}

export interface CheckInFilters {
  booking?: string;
  ticket?: string;
  passenger?: string;
  flight?: string;
  customer?: string;
  status?: CheckInStatus;
  boardingPassStatus?: BoardingPassStatus;
  checkInReference?: string;
  seatNumber?: string;
  search?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

export type CheckInSortField =
  | "createdAt"
  | "updatedAt"
  | "checkedInAt"
  | "seatNumber"
  | "status"
  | "checkInReference";

export interface CheckInPaginationOptions {
  page: number;
  limit: number;
  sortBy?: CheckInSortField;
  sortOrder?: "asc" | "desc";
}

export interface CheckInPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedCheckIns<T> {
  items: T[];
  pagination: CheckInPaginationMetadata;
}

export interface CheckInCountResult {
  total: number;
  byStatus: Partial<Record<CheckInStatus, number>>;
  byBoardingPassStatus: Partial<Record<BoardingPassStatus, number>>;
}

export type CheckInRepositoryUpdateData = Partial<UpdateCheckInInput>;
