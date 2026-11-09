
import type { Types } from "mongoose";

import type {
  StaffDepartment,
  StaffEmploymentStatus,
} from "../models/staff-profile.model.js";

export interface CreateStaffInput {
  userId: string;
  employeeNumber: string;
  department: StaffDepartment;
  jobTitle: string;
  hireDate: string;
  notes?: string;
}

export interface UpdateStaffInput {
  employeeNumber?: string;
  department?: StaffDepartment;
  jobTitle?: string;
  employmentStatus?: StaffEmploymentStatus;
  hireDate?: string;
  terminationDate?: string | null;
  notes?: string | null;
}

export interface StaffProfileDocumentData {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  employeeNumber: string;
  department: StaffDepartment;
  jobTitle: string;
  employmentStatus: StaffEmploymentStatus;
  hireDate: Date;
  terminationDate?: Date | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffProfileResponse {
  id: string;
  userId: string;
  employeeNumber: string;
  department: StaffDepartment;
  jobTitle: string;
  employmentStatus: StaffEmploymentStatus;
  hireDate: string;
  terminationDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfileFilters {
  userId?: string;
  employeeNumber?: string;
  department?: StaffDepartment;
  employmentStatus?: StaffEmploymentStatus;
}

export interface StaffPaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedStaffProfiles {
  items: StaffProfileResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
