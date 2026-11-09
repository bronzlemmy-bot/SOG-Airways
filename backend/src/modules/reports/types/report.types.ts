
import type {
  REPORT_FORMATS,
  REPORT_STATUSES,
  REPORT_TYPES,
} from "../models/report-export.model.js";

export type ReportType = (typeof REPORT_TYPES)[number];

export type ReportFormat = (typeof REPORT_FORMATS)[number];

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface CreateReportInput {
  title: string;
  description?: string | null;
  type: ReportType;
  format?: ReportFormat;
  requestedBy: string;
  filters?: Record<string, unknown>;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown>;
}

export interface UpdateReportInput {
  title?: string;
  description?: string | null;
  format?: ReportFormat;
  filters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateReportStatusInput {
  status: ReportStatus;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSizeBytes?: number | null;
  recordCount?: number | null;
  errorMessage?: string | null;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown>;
}

export interface ReportListQuery {
  page?: number;
  limit?: number;
  type?: ReportType;
  format?: ReportFormat;
  status?: ReportStatus;
  requestedBy?: string;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  sortOrder?: "asc" | "desc";
}

export interface ReportCountQuery {
  type?: ReportType;
  format?: ReportFormat;
  status?: ReportStatus;
  requestedBy?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface ReportIdParams {
  reportId: string;
}

export interface ReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportListResult<T> {
  items: T[];
  pagination: ReportPagination;
}

export interface ReportStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  expired: number;
}

export interface ReportGenerationResult {
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  recordCount: number;
}
