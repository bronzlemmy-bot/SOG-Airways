
import mongoose, { type SortOrder } from "mongoose";

import { Report } from "../models/report-export.model.js";

import type {
  CreateReportInput,
  ReportCountQuery,
  ReportListQuery,
  ReportStats,
  UpdateReportInput,
  UpdateReportStatusInput,
} from "../types/report.types.js";

function buildReportFilter(
  query: ReportListQuery | ReportCountQuery,
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (query.type) {
    filter.type = query.type;
  }

  if (query.format) {
    filter.format = query.format;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.requestedBy) {
    filter.requestedBy = query.requestedBy;
  }

  if ("search" in query && query.search) {
    const escapedSearch = query.search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
      { fileName: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const dateFilter: Record<string, Date> = {};

  if (query.fromDate) {
    dateFilter.$gte = query.fromDate;
  }

  if (query.toDate) {
    dateFilter.$lte = query.toDate;
  }

  if (Object.keys(dateFilter).length > 0) {
    filter.createdAt = dateFilter;
  }

  return filter;
}

class ReportRepository {
  async create(input: CreateReportInput) {
    return Report.create({
      title: input.title,
      description: input.description ?? null,
      type: input.type,
      format: input.format ?? "csv",
      requestedBy: new mongoose.Types.ObjectId(input.requestedBy),
      filters: input.filters ?? {},
      expiresAt: input.expiresAt ?? null,
      metadata: input.metadata ?? {},
      status: "queued",
    });
  }

  async findById(reportId: string) {
    if (!mongoose.isValidObjectId(reportId)) {
      return null;
    }

    return Report.findById(reportId)
      .populate("requestedBy", "firstName lastName email")
      .exec();
  }

  async findMany(query: ReportListQuery = {}) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));

    const sortOrder: SortOrder =
      query.sortOrder === "asc" ? 1 : -1;

    const filter = buildReportFilter(query);

    const [items, total] = await Promise.all([
      Report.find(filter as any)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("requestedBy", "firstName lastName email")
        .exec(),
      Report.countDocuments(filter as any).exec(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findForUser(
    userId: string,
    query: Omit<ReportListQuery, "requestedBy"> = {},
  ) {
    return this.findMany({
      ...query,
      requestedBy: userId,
    });
  }

  async update(reportId: string, input: UpdateReportInput) {
    if (!mongoose.isValidObjectId(reportId)) {
      return null;
    }

    return Report.findOneAndUpdate(
      {
        _id: reportId,
        status: { $in: ["queued", "failed"] },
      },
      { $set: input },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("requestedBy", "firstName lastName email")
      .exec();
  }

  async updateStatus(
    reportId: string,
    input: UpdateReportStatusInput,
  ) {
    if (!mongoose.isValidObjectId(reportId)) {
      return null;
    }

    const update: Record<string, unknown> = {
      status: input.status,
    };

    if (input.status === "processing") {
      update.startedAt = new Date();
      update.completedAt = null;
      update.errorMessage = null;
    }

    if (input.status === "completed") {
      update.completedAt = new Date();
      update.errorMessage = null;

      if (input.fileUrl !== undefined) {
        update.fileUrl = input.fileUrl;
      }

      if (input.fileName !== undefined) {
        update.fileName = input.fileName;
      }

      if (input.fileSizeBytes !== undefined) {
        update.fileSizeBytes = input.fileSizeBytes;
      }

      if (input.recordCount !== undefined) {
        update.recordCount = input.recordCount;
      }

      if (input.expiresAt !== undefined) {
        update.expiresAt = input.expiresAt;
      }
    }

    if (input.status === "failed") {
      update.errorMessage =
        input.errorMessage ?? "Report generation failed.";
      update.completedAt = new Date();
    }

    if (input.status === "expired") {
      update.expiresAt = input.expiresAt ?? new Date();
    }

    if (input.metadata !== undefined) {
      update.metadata = input.metadata;
    }

    return Report.findByIdAndUpdate(
      reportId,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("requestedBy", "firstName lastName email")
      .exec();
  }

  async delete(reportId: string) {
    if (!mongoose.isValidObjectId(reportId)) {
      return null;
    }

    return Report.findByIdAndDelete(reportId).exec();
  }

  async deleteForUser(reportId: string, userId: string) {
    if (!mongoose.isValidObjectId(reportId)) {
      return null;
    }

    return Report.findOneAndDelete({
      _id: reportId,
      requestedBy: userId,
    }).exec();
  }

  async count(query: ReportCountQuery = {}) {
    const filter = buildReportFilter(query);

    return Report.countDocuments(filter as any).exec();
  }

  async getStats(requestedBy?: string): Promise<ReportStats> {
    const baseFilter: Record<string, unknown> = {};

    if (requestedBy) {
      baseFilter.requestedBy = requestedBy;
    }

    const [total, queued, processing, completed, failed, expired] =
      await Promise.all([
        Report.countDocuments(baseFilter as any).exec(),
        Report.countDocuments({
          ...baseFilter,
          status: "queued",
        } as any).exec(),
        Report.countDocuments({
          ...baseFilter,
          status: "processing",
        } as any).exec(),
        Report.countDocuments({
          ...baseFilter,
          status: "completed",
        } as any).exec(),
        Report.countDocuments({
          ...baseFilter,
          status: "failed",
        } as any).exec(),
        Report.countDocuments({
          ...baseFilter,
          status: "expired",
        } as any).exec(),
      ]);

    return {
      total,
      queued,
      processing,
      completed,
      failed,
      expired,
    };
  }
}

export const reportRepository = new ReportRepository();
