
import type {
  BookingClass,
  BookingPaymentStatus,
  BookingStatus,
} from "../models/booking.model.js";
import type { CreatePassengerInput } from "../../passengers/types/passenger.types.js";
import type { PassengerProfileResponse } from "../../passengers/types/passenger.types.js";
import type { FlightProfileResponse } from "../../flights/types/flight.types.js";
import type { TicketProfileResponse } from "../../tickets/types/ticket.types.js";
import type { PaymentProfileResponse } from "../../payments/types/payment.types.js";

export interface CreateBookingInput {
  bookingReference?: string;
  customer: string;
  flight: string;
  passengers?: string[];
  passengerCount: number;
  bookingClass?: BookingClass;
  status?: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  currency?: string;
  baseFare: number;
  taxes?: number;
  fees?: number;
  discount?: number;
  totalAmount?: number;
  expiresAt?: Date | null;
  notes?: string;
  idempotencyKey?: string;
  requestHash?: string;
  trackingReference?: string;
}

export interface CreateCustomerBookingInput {
  flightId: string;
  bookingClass: BookingClass;
  passengers: Array<Omit<CreatePassengerInput, "customer">>;
  idempotencyKey: string;
}

export interface CustomerBookingDetailsResponse {
  booking: BookingProfileResponse;
  flight: FlightProfileResponse;
  passengers: PassengerProfileResponse[];
  tickets: TicketProfileResponse[];
  payment?: PaymentProfileResponse;
  trackingReference?: string;
}

export interface DemoPaymentWorkflowResponse {
  booking: BookingProfileResponse;
  payment: PaymentProfileResponse;
  tickets: TicketProfileResponse[];
  trackingReference: string;
}

export interface UpdateBookingInput {
  customer?: string;
  flight?: string;
  passengers?: string[];
  passengerCount?: number;
  bookingClass?: BookingClass;
  status?: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  currency?: string;
  baseFare?: number;
  taxes?: number;
  fees?: number;
  discount?: number;
  totalAmount?: number;
  expiresAt?: Date | null;
  cancellationReason?: string | null;
  notes?: string | null;
}

export interface CancelBookingInput {
  cancellationReason?: string;
}

export interface BookingProfileResponse {
  id: string;
  bookingReference: string;
  customer: string;
  flight: string;
  passengers: string[];
  passengerCount: number;
  bookingClass: BookingClass;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  currency: string;
  baseFare: number;
  taxes: number;
  fees: number;
  discount: number;
  totalAmount: number;
  bookedAt: Date;
  expiresAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string;
  notes?: string;
  trackingReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingFilters {
  search?: string;
  bookingReference?: string;
  customer?: string;
  flight?: string;
  status?: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  bookingClass?: BookingClass;
  currency?: string;
  bookedFrom?: Date;
  bookedTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export type BookingSortField =
  | "bookingReference"
  | "bookedAt"
  | "totalAmount"
  | "status"
  | "createdAt";

export interface BookingPaginationOptions {
  page: number;
  limit: number;
  sortBy?: BookingSortField;
  sortOrder?: "asc" | "desc";
}

export interface BookingPaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedBookings {
  items: BookingProfileResponse[];
  pagination: BookingPaginationMetadata;
}

export interface BookingCountResult {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  expired: number;
}

export interface BookingRevenueResult {
  currency: string;
  totalBookings: number;
  totalRevenue: number;
  totalDiscount: number;
}

export interface BookingRepositoryUpdateData extends UpdateBookingInput {
  cancelledAt?: Date | null;
}
