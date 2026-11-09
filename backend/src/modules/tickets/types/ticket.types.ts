
import type {
  TicketClass,
  TicketStatus,
} from "../models/ticket.model.js";

export interface CreateTicketInput {
  ticketNumber?: string;
  booking: string;
  payment: string;
  customer: string;
  passenger: string;
  flight: string;
  trackingReference?: string;
  ticketClass: TicketClass;
  status?: TicketStatus;
  issuedAt?: Date;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
  checkedInAt?: Date | null;
  usedAt?: Date | null;
  seatNumber?: string | null;
  fareAmount: number;
  currency?: string;
  notes?: string | null;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
  checkedInAt?: Date | null;
  usedAt?: Date | null;
  seatNumber?: string | null;
  notes?: string | null;
}

export interface TicketProfileResponse {
  id: string;
  ticketNumber: string;
  booking: string;
  payment: string;
  customer: string;
  passenger: string;
  flight: string;
  trackingReference?: string;
  ticketClass: TicketClass;
  status: TicketStatus;
  issuedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  checkedInAt?: Date;
  usedAt?: Date;
  seatNumber?: string;
  fareAmount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketPdfData {
  ticket: TicketProfileResponse;
  bookingReference: string;
  passengerName: string;
  flightNumber: string;
  departureAirportCode: string;
  departureAirportName: string;
  departureAirportCity: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  arrivalAirportCity: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  paymentStatus: string;
  demoPayment: boolean;
}

export interface TicketFilters {
  search?: string;
  ticketNumber?: string;
  booking?: string;
  payment?: string;
  customer?: string;
  passenger?: string;
  flight?: string;
  ticketClass?: TicketClass;
  status?: TicketStatus;
  currency?: string;
  issuedFrom?: Date;
  issuedTo?: Date;
  minFare?: number;
  maxFare?: number;
}

export type TicketSortField =
  | "ticketNumber"
  | "fareAmount"
  | "status"
  | "issuedAt"
  | "createdAt"
  | "updatedAt";

export interface TicketPaginationOptions {
  page: number;
  limit: number;
  sortBy?: TicketSortField;
  sortOrder?: "asc" | "desc";
}

export interface TicketPaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTickets {
  items: TicketProfileResponse[];
  pagination: TicketPaginationMetadata;
}

export interface TicketCountResult {
  total: number;
  issued: number;
  checked_in: number;
  used: number;
  cancelled: number;
  voided: number;
}

export interface TicketRepositoryUpdateData extends UpdateTicketInput {}
