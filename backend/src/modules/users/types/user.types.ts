
import type {
  UserRole,
  UserStatus,
} from "../models/user.model.js";

/**
 * Public user profile data.
 * Never include passwordHash in API response types.
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filters supported when listing users.
 */
export interface UserListFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

/**
 * Pagination metadata for user lists.
 */
export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * A paginated result returned by user-listing operations.
 */
export interface UserListResult {
  users: UserProfile[];
  pagination: UserPagination;
}

/**
 * Fields a user may update through their own profile.
 */
export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
