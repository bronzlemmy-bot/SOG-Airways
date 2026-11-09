
import mongoose from "mongoose";

import { ApiError } from "../../../utils/api-error.js";

import { reportRepository } from "../repositories/report.repository.js";

import type {
  CreateReportInput,
  ReportCountQuery,
  ReportListQuery,
  UpdateReportInput,
  UpdateReportStatusInput,
} from "../types/report.types.js";

class ReportService {
  async create(input: CreateReportInput) {
    if (!input.title?.trim()) {
      throw new ApiError("Report title is required.", 400, {
        code: "REPORT_TITLE_REQUIRED",
      });
    }

    if (!mongoose.isValidObjectId(input.requestedBy)) {
      throw new ApiError("A valid requesting user is required.", 400, {
        code: "INVALID_REPORT_REQUESTER",
      });
    }

    return reportRepository.create(input);
  }

  async findById(reportId: string) {
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError("Invalid report ID.", 400, {
        code: "INVALID_REPORT_ID",
      });
    }

    const report = await reportRepository.findById(reportId);

    if (!report) {
      throw new ApiError("Report not found.", 404, {
        code: "REPORT_NOT_FOUND",
      });
    }

    return report;
  }

  async list(query: ReportListQuery = {}) {
    return reportRepository.findMany(query);
  }

  async listForUser(
    userId: string,
    query: Omit<ReportListQuery, "requestedBy"> = {},
  ) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError("A valid user ID is required.", 400, {
        code: "INVALID_REPORT_REQUESTER",
      });
    }

    return reportRepository.findForUser(userId, query);
  }

  async update(reportId: string, input: UpdateReportInput) {
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError("Invalid report ID.", 400, {
        code: "INVALID_REPORT_ID",
      });
    }

    const report = await reportRepository.update(reportId, input);

    if (!report) {
      const existing = await reportRepository.findById(reportId);

      if (!existing) {
        throw new ApiError("Report not found.", 404, {
          code: "REPORT_NOT_FOUND",
        });
      }

      throw new ApiError(
        "Only queued or failed reports can be edited.",
        409,
        { code: "REPORT_NOT_EDITABLE" },
      );
    }

    return report;
  }

  async updateStatus(
    reportId: string,
    input: UpdateReportStatusInput,
  ) {
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError("Invalid report ID.", 400, {
        code: "INVALID_REPORT_ID",
      });
    }

    if (
      input.status === "completed" &&
      (!input.fileUrl || !input.fileName)
    ) {
      throw new ApiError(
        "A completed report must include its file URL and file name.",
        400,
        { code: "REPORT_FILE_REQUIRED" },
      );
    }

    const report = await reportRepository.updateStatus(
      reportId,
      input,
    );

    if (!report) {
      throw new ApiError("Report not found.", 404, {
        code: "REPORT_NOT_FOUND",
      });
    }

    return report;
  }

  async delete(reportId: string) {
    if (!mongoose.isValidObjectId(reportId)) {
      throw new ApiError("Invalid report ID.", 400, {
        code: "INVALID_REPORT_ID",
      });
    }

    const report = await reportRepository.delete(reportId);

    if (!report) {
      throw new ApiError("Report not found.", 404, {
        code: "REPORT_NOT_FOUND",
      });
    }

    return report;
  }

  async deleteForUser(reportId: string, userId: string) {
    if (
      !mongoose.isValidObjectId(reportId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      throw new ApiError("Invalid report or user ID.", 400, {
        code: "INVALID_REPORT_OR_USER_ID",
      });
    }

    const report = await reportRepository.deleteForUser(
      reportId,
      userId,
    );

    if (!report) {
      throw new ApiError(
        "Report not found or you do not have permission to delete it.",
        404,
        { code: "REPORT_NOT_FOUND" },
      );
    }

    return report;
  }

  async count(query: ReportCountQuery = {}) {
    return reportRepository.count(query);
  }

  async getStats(requestedBy?: string) {
    if (
      requestedBy !== undefined &&
      !mongoose.isValidObjectId(requestedBy)
    ) {
      throw new ApiError("Invalid requesting user ID.", 400, {
        code: "INVALID_REPORT_REQUESTER",
      });
    }

    return reportRepository.getStats(requestedBy);
  }
}

export const reportService = new ReportService();
