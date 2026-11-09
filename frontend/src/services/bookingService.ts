import { apiService } from "./api";

import type { Booking } from "@/types";
import type {
  CheckoutBooking,
  CustomerBookingDetails,
  CreateCustomerBookingInput,
} from "@/types";

export interface BookingFilters {
  status?: string;
  paymentStatus?: string;
  customer?: string;
  flight?: string;
  bookingReference?: string;
  bookingClass?: string;
  currency?: string;
  bookedFrom?: string;
  bookedTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export type CreateBookingData = Omit<
  Booking,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateBookingData = Partial<CreateBookingData>;

export const bookingService = {
  async createCustomerBooking(
    data: CreateCustomerBookingInput,
  ): Promise<CustomerBookingDetails> {
    return apiService.post<CustomerBookingDetails>("/bookings/checkout", data);
  },

  async getMyBookings(): Promise<CheckoutBooking[]> {
    return apiService.get<CheckoutBooking[]>("/bookings/my-bookings");
  },

  async getCustomerBookingDetails(
    id: string,
  ): Promise<CustomerBookingDetails> {
    return apiService.get<CustomerBookingDetails>(
      `/bookings/${encodeURIComponent(id)}/details`,
    );
  },

  async findManageBooking(
    reference: string,
    lastName: string,
  ): Promise<CustomerBookingDetails | null> {
    const normalizedReference = reference
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();

    const normalizedLastName = lastName
      .trim()
      .toLowerCase();

    if (!normalizedReference || !normalizedLastName) {
      return null;
    }

    const booking = await apiService.get<CheckoutBooking>(
      `/bookings/reference/${encodeURIComponent(normalizedReference)}`,
    );
    const details = await this.getCustomerBookingDetails(booking.id);

    const surnameMatches = details.passengers.some(
      (passenger) =>
        passenger.lastName.trim().toLowerCase() === normalizedLastName,
    );

    return surnameMatches ? details : null;
  },

  async getBookings(): Promise<Booking[]> {
    return apiService.get<Booking[]>("/bookings");
  },

  async getBookingById(id: string): Promise<Booking> {
    return apiService.get<Booking>(`/bookings/${id}`);
  },

  async getBookingByReference(reference: string): Promise<Booking> {
    return apiService.get<Booking>(
      `/bookings/reference/${encodeURIComponent(reference)}`,
    );
  },

  async getBookingsByUser(): Promise<CheckoutBooking[]> {
    return this.getMyBookings();
  },

  async getBookingsByFilters(
    filters: BookingFilters,
  ): Promise<Booking[]> {
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.paymentStatus) {
      params.set("paymentStatus", filters.paymentStatus);
    }
    if (filters.customer) params.set("customer", filters.customer);
    if (filters.flight) params.set("flight", filters.flight);
    if (filters.bookingReference) {
      params.set("bookingReference", filters.bookingReference);
    }
    if (filters.bookingClass) {
      params.set("bookingClass", filters.bookingClass);
    }
    if (filters.currency) params.set("currency", filters.currency);
    if (filters.bookedFrom) params.set("bookedFrom", filters.bookedFrom);
    if (filters.bookedTo) params.set("bookedTo", filters.bookedTo);
    if (filters.minAmount !== undefined) {
      params.set("minAmount", String(filters.minAmount));
    }
    if (filters.maxAmount !== undefined) {
      params.set("maxAmount", String(filters.maxAmount));
    }
    if (filters.search) params.set("search", filters.search);

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<Booking[]>(
      `/bookings${query ? `?${query}` : ""}`,
    );
  },

  async createBooking(data: CreateBookingData): Promise<Booking> {
    return apiService.post<Booking>("/bookings", data);
  },

  async updateBooking(
    id: string,
    data: UpdateBookingData,
  ): Promise<Booking> {
    return apiService.patch<Booking>(`/bookings/${id}`, data);
  },

  async cancelBooking(id: string): Promise<Booking> {
    return apiService.patch<Booking>(`/bookings/${id}/cancel`);
  },

  async deleteBooking(id: string): Promise<void> {
    await apiService.delete(`/bookings/${id}`);
  },
};