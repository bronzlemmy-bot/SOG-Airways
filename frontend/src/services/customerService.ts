import { apiService } from "./api";

import type { Customer } from "@/types";

export interface CustomerFilters {
  status?: string;
  search?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export type CreateCustomerData = Omit<
  Customer,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateCustomerData = Partial<
  CreateCustomerData
>;

export type PreferredCabinClass =
  | "economy"
  | "premium_economy"
  | "business"
  | "first";

export interface CustomerSelfProfile {
  id: string;
  userId: string;
  loyaltyNumber: string | null;
  loyaltyTier: "standard" | "silver" | "gold" | "platinum";
  milesBalance: number;
  preferredCabinClass: PreferredCabinClass | null;
  preferredCurrency: string | null;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfilePreferencesInput {
  preferredCabinClass?: PreferredCabinClass;
  preferredCurrency?: string;
  marketingConsent?: boolean;
}

export const customerService = {
  async getMyProfile(): Promise<CustomerSelfProfile> {
    return apiService.get<CustomerSelfProfile>("/customers/me");
  },

  async createMyProfile(
    data: CustomerProfilePreferencesInput,
  ): Promise<CustomerSelfProfile> {
    return apiService.post<CustomerSelfProfile>("/customers/me", data);
  },

  async updateMyProfile(
    data: CustomerProfilePreferencesInput,
  ): Promise<CustomerSelfProfile> {
    return apiService.patch<CustomerSelfProfile>("/customers/me", data);
  },

  async getCustomers(): Promise<Customer[]> {
    return apiService.get<Customer[]>(
      "/customers",
    );
  },

  async getCustomerById(
    id: string,
  ): Promise<Customer> {
    return apiService.get<Customer>(
      `/customers/${id}`,
    );
  },

  async getCustomerByEmail(
    email: string,
  ): Promise<Customer> {
    return apiService.get<Customer>(
      `/customers/email/${encodeURIComponent(email)}`,
    );
  },

  async getCustomersByFilters(
    filters: CustomerFilters,
  ): Promise<Customer[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.country) {
      params.set("country", filters.country);
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<Customer[]>(
      `/customers${query ? `?${query}` : ""}`,
    );
  },

  async createCustomer(
    data: CreateCustomerData,
  ): Promise<Customer> {
    return apiService.post<Customer>(
      "/customers",
      data,
    );
  },

  async updateCustomer(
    id: string,
    data: UpdateCustomerData,
  ): Promise<Customer> {
    return apiService.patch<Customer>(
      `/customers/${id}`,
      data,
    );
  },

  async deleteCustomer(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/customers/${id}`,
    );
  },
};