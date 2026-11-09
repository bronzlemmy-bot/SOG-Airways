
import type {
  PassengerDocumentType,
  PassengerGender,
  PassengerStatus,
} from "../models/passenger.model.js";

export interface CreatePassengerInput {
  customer: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: Date;
  gender?: PassengerGender;
  nationality: string;
  email?: string | null;
  phoneNumber?: string | null;
  documentType?: PassengerDocumentType | null;
  documentNumber?: string | null;
  documentIssuingCountry?: string | null;
  documentExpiryDate?: Date | null;
  specialAssistanceRequired?: boolean;
  specialAssistanceNotes?: string | null;
  frequentFlyerNumber?: string | null;
  status?: PassengerStatus;
  notes?: string | null;
}

export interface UpdatePassengerInput {
  customer?: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: PassengerGender;
  nationality?: string;
  email?: string | null;
  phoneNumber?: string | null;
  documentType?: PassengerDocumentType | null;
  documentNumber?: string | null;
  documentIssuingCountry?: string | null;
  documentExpiryDate?: Date | null;
  specialAssistanceRequired?: boolean;
  specialAssistanceNotes?: string | null;
  frequentFlyerNumber?: string | null;
  status?: PassengerStatus;
  notes?: string | null;
}

export interface PassengerProfileResponse {
  id: string;
  customer: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  gender: PassengerGender;
  nationality: string;
  email?: string;
  phoneNumber?: string;
  documentType?: PassengerDocumentType;
  documentNumber?: string;
  documentIssuingCountry?: string;
  documentExpiryDate?: Date;
  specialAssistanceRequired: boolean;
  specialAssistanceNotes?: string;
  frequentFlyerNumber?: string;
  status: PassengerStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PassengerFilters {
  search?: string;
  customer?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  nationality?: string;
  gender?: PassengerGender;
  status?: PassengerStatus;
  documentType?: PassengerDocumentType;
  specialAssistanceRequired?: boolean;
  dateOfBirthFrom?: Date;
  dateOfBirthTo?: Date;
  createdFrom?: Date;
  createdTo?: Date;
}

export type PassengerSortField =
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "nationality"
  | "status"
  | "createdAt"
  | "updatedAt";

export interface PassengerPaginationOptions {
  page: number;
  limit: number;
  sortBy?: PassengerSortField;
  sortOrder?: "asc" | "desc";
}

export interface PassengerPaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedPassengers {
  items: PassengerProfileResponse[];
  pagination: PassengerPaginationMetadata;
}

export interface PassengerCountResult {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
}

export interface PassengerRepositoryUpdateData
  extends UpdatePassengerInput {}
