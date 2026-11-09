
import type {
  ISupportCase,
  ISupportMessage,
  SupportCaseCategory,
  SupportCasePriority,
  SupportCaseStatus,
} from "../models/support-case.model.js";

export type {
  ISupportCase,
  ISupportMessage,
  SupportCaseCategory,
  SupportCasePriority,
  SupportCaseStatus,
};

export interface CreateSupportCaseInput {
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category?: SupportCaseCategory;
  priority?: SupportCasePriority;
  attachments?: string[];
}

export interface UpdateSupportCaseInput {
  subject?: string;
  description?: string;
  category?: SupportCaseCategory;
  priority?: SupportCasePriority;
  status?: SupportCaseStatus;
  assignedTo?: string | null;
  resolution?: string | null;
}

export interface AddSupportMessageInput {
  senderId?: string | null;
  senderRole: "customer" | "staff" | "admin" | "system";
  message: string;
  attachments?: string[];
}

export interface SupportCaseListFilters {
  customerId?: string;
  customerEmail?: string;
  assignedTo?: string;
  category?: SupportCaseCategory;
  priority?: SupportCasePriority;
  status?: SupportCaseStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
  sortOrder?: "asc" | "desc";
}

export interface SupportCasePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SupportCaseListResult {
  items: ISupportCase[];
  pagination: SupportCasePagination;
}

export interface SupportCaseCountResult {
  total: number;
  open: number;
  inProgress: number;
  waitingForCustomer: number;
  resolved: number;
  closed: number;
}

export interface SupportCaseSummary {
  id: string;
  caseNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: SupportCaseCategory;
  priority: SupportCasePriority;
  status: SupportCaseStatus;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportCaseResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface SupportCaseMessageResponse {
  success: boolean;
  message: string;
  data?: ISupportMessage;
}
