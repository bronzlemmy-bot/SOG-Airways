import { apiService } from "./api";

import type {
  Staff,
  StaffRole,
  StaffStatus,
} from "@/types";

export interface StaffFilters {
  role?: StaffRole;
  status?: StaffStatus;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type CreateStaffData = Omit<
  Staff,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateStaffData = Partial<
  CreateStaffData
>;

export const staffService = {
  async getStaff(): Promise<Staff[]> {
    return apiService.get<Staff[]>("/staff");
  },

  async getStaffById(
    id: string,
  ): Promise<Staff> {
    return apiService.get<Staff>(
      `/staff/${id}`,
    );
  },

  async getStaffByFilters(
    filters: StaffFilters,
  ): Promise<Staff[]> {
    const params = new URLSearchParams();

    if (filters.role) {
      params.set("role", filters.role);
    }

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.department) {
      params.set(
        "department",
        filters.department,
      );
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    return apiService.get<Staff[]>(
      `/staff${query ? `?${query}` : ""}`,
    );
  },

  async createStaff(
    data: CreateStaffData,
  ): Promise<Staff> {
    return apiService.post<Staff>(
      "/staff",
      data,
    );
  },

  async updateStaff(
    id: string,
    data: UpdateStaffData,
  ): Promise<Staff> {
    return apiService.patch<Staff>(
      `/staff/${id}`,
      data,
    );
  },

  async updateStaffStatus(
    id: string,
    status: StaffStatus,
  ): Promise<Staff> {
    return apiService.patch<Staff>(
      `/staff/${id}/status`,
      { status },
    );
  },

  async deleteStaff(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/staff/${id}`,
    );
  },
};