
import type {
  ContactCategory,
  ContactStatus,
} from "../models/contact-inquiry.model.js";

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  category?: ContactCategory;
  customer?: string | null;
}

export interface UpdateContactInput {
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  category?: ContactCategory;
  status?: ContactStatus;
  assignedTo?: string | null;
  adminNotes?: string | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
}

export interface ContactFilters {
  reference?: string;
  name?: string;
  email?: string;
  category?: ContactCategory;
  status?: ContactStatus;
  customer?: string;
  assignedTo?: string;
  search?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

export type ContactSortField =
  | "name"
  | "email"
  | "subject"
  | "category"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "resolvedAt"
  | "closedAt";

export interface ContactPaginationOptions {
  page: number;
  limit: number;
  sortBy?: ContactSortField;
  sortOrder?: "asc" | "desc";
}

export interface ContactPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedContacts<T> {
  items: T[];
  pagination: ContactPaginationMetadata;
}

export interface ContactCountResult {
  total: number;
  byStatus: Partial<Record<ContactStatus, number>>;
  byCategory: Partial<Record<ContactCategory, number>>;
}

export interface ContactRepositoryUpdateData
  extends Partial<UpdateContactInput> {}
