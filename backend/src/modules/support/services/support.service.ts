
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";
import {
  SUPPORT_CASE_STATUSES,
  type ISupportCase,
  type ISupportMessage,
  type SupportCaseStatus,
} from "../models/support-case.model.js";
import {
  supportCaseRepository,
} from "../repositories/support-case.repository.js";
import type {
  AddSupportMessageInput,
  CreateSupportCaseInput,
  SupportCaseListFilters,
  SupportCaseListResult,
  UpdateSupportCaseInput,
} from "../types/support.types.js";

const CLOSED_STATUSES: SupportCaseStatus[] = ["closed"];
const RESOLVED_STATUSES: SupportCaseStatus[] = ["resolved"];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidObjectId(value: string): boolean {
  return Types.ObjectId.isValid(value);
}

function createCaseNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

  return `SOG-${timestamp}-${suffix}`;
}

export class SupportService {
  async createCase(
    input: CreateSupportCaseInput,
    authenticatedCustomerId?: string,
  ): Promise<ISupportCase> {
    if (
      authenticatedCustomerId &&
      !isValidObjectId(authenticatedCustomerId)
    ) {
      throw new ApiError("Invalid authenticated customer ID.", 400);
    }

    const customerId = authenticatedCustomerId
      ? new Types.ObjectId(authenticatedCustomerId)
      : undefined;

    const supportCase = await supportCaseRepository.create({
      caseNumber: createCaseNumber(),
      customerId: customerId ?? null,
      customerName: input.customerName.trim(),
      customerEmail: normalizeEmail(input.customerEmail),
      subject: input.subject.trim(),
      description: input.description.trim(),
      category: input.category ?? "other",
      priority: input.priority ?? "medium",
      status: "open",
      messages: (input.attachments ?? []).length
        ? [
            {
              senderId: customerId ?? null,
              senderRole: customerId ? "customer" : "system",
              message: input.description.trim(),
              attachments: input.attachments ?? [],
              createdAt: new Date(),
            },
          ]
        : [],
    });

    return supportCase;
  }

  async getCaseById(
    caseId: string,
    requesterId?: string,
    isStaff = false,
  ): Promise<ISupportCase> {
    const supportCase = await supportCaseRepository.findById(caseId);

    if (!supportCase) {
      throw new ApiError("Support case not found.", 404);
    }

    this.assertCanAccessCase(supportCase, requesterId, isStaff);

    return supportCase;
  }

  async getCaseByNumber(
    caseNumber: string,
    requesterId?: string,
    isStaff = false,
  ): Promise<ISupportCase> {
    const supportCase =
      await supportCaseRepository.findByCaseNumber(caseNumber);

    if (!supportCase) {
      throw new ApiError("Support case not found.", 404);
    }

    this.assertCanAccessCase(supportCase, requesterId, isStaff);

    return supportCase;
  }

  async listCases(
    filters: SupportCaseListFilters,
    requesterId?: string,
    isStaff = false,
  ): Promise<SupportCaseListResult> {
    const effectiveFilters: SupportCaseListFilters = { ...filters };

    if (!isStaff) {
      if (!requesterId || !isValidObjectId(requesterId)) {
        throw new ApiError("Authentication is required.", 401);
      }

      effectiveFilters.customerId = requesterId;
      delete effectiveFilters.assignedTo;
    }

    const { items, total } =
      await supportCaseRepository.findMany(effectiveFilters);

    const page = effectiveFilters.page ?? 1;
    const limit = effectiveFilters.limit ?? 20;
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateCase(
    caseId: string,
    updates: UpdateSupportCaseInput,
  ): Promise<ISupportCase> {
    const existing = await supportCaseRepository.findById(caseId);

    if (!existing) {
      throw new ApiError("Support case not found.", 404);
    }

    if (
      updates.assignedTo &&
      !isValidObjectId(updates.assignedTo)
    ) {
      throw new ApiError("Invalid staff assignment ID.", 400);
    }

    if (
      updates.status &&
      !SUPPORT_CASE_STATUSES.includes(updates.status)
    ) {
      throw new ApiError("Invalid support case status.", 400);
    }

    if (
      updates.status === "closed" &&
      existing.status !== "closed"
    ) {
      updates = {
        ...updates,
        resolution: updates.resolution ?? existing.resolution ?? null,
      };
    }

const now = new Date();

const {
  assignedTo,
  ...otherUpdates
} = updates;

const normalizedUpdates: Partial<ISupportCase> = {
  ...otherUpdates,
};

if (assignedTo !== undefined) {
  normalizedUpdates.assignedTo = assignedTo
    ? new Types.ObjectId(assignedTo)
    : null;
}


    if (updates.status && RESOLVED_STATUSES.includes(updates.status)) {
      normalizedUpdates.resolvedAt = existing.resolvedAt ?? now;
    }

    if (updates.status && CLOSED_STATUSES.includes(updates.status)) {
      normalizedUpdates.closedAt = existing.closedAt ?? now;
    }

    if (
      updates.status &&
      !RESOLVED_STATUSES.includes(updates.status) &&
      updates.status !== "closed"
    ) {
      normalizedUpdates.resolvedAt = null;
      normalizedUpdates.closedAt = null;
    }

    const updated = await supportCaseRepository.updateById(
      caseId,
      normalizedUpdates,
    );

    if (!updated) {
      throw new ApiError("Unable to update support case.", 500);
    }

    return updated;
  }

  async addMessage(
    caseId: string,
    input: AddSupportMessageInput,
    requesterId: string,
    requesterRole: "customer" | "staff" | "admin" | "super_admin",
  ): Promise<ISupportCase> {
    if (!isValidObjectId(requesterId)) {
      throw new ApiError("Invalid requester ID.", 400);
    }

    const existing = await supportCaseRepository.findById(caseId);

    if (!existing) {
      throw new ApiError("Support case not found.", 404);
    }

    const isStaff = requesterRole !== "customer";
    this.assertCanAccessCase(existing, requesterId, isStaff);

    if (
      existing.status === "closed" ||
      existing.status === "resolved"
    ) {
      throw new ApiError(
        "Messages cannot be added to a resolved or closed case.",
        409,
      );
    }

    const message: ISupportMessage = {
      senderId: new Types.ObjectId(requesterId),
      senderRole: isStaff ? requesterRole === "super_admin" ? "admin" : requesterRole : "customer",
      message: input.message.trim(),
      attachments: input.attachments ?? [],
      createdAt: new Date(),
    };

    const updated = await supportCaseRepository.addMessage(
      caseId,
      message,
    );

    if (!updated) {
      throw new ApiError("Unable to add support message.", 500);
    }

    return updated;
  }

  async getCaseCounts(
    filters: SupportCaseListFilters = {},
    requesterId?: string,
    isStaff = false,
  ) {
    const effectiveFilters = { ...filters };

    if (!isStaff) {
      if (!requesterId || !isValidObjectId(requesterId)) {
        throw new ApiError("Authentication is required.", 401);
      }

      effectiveFilters.customerId = requesterId;
      delete effectiveFilters.assignedTo;
    }

    return supportCaseRepository.count(effectiveFilters);
  }

  async deleteCase(caseId: string): Promise<void> {
    const deleted = await supportCaseRepository.deleteById(caseId);

    if (!deleted) {
      throw new ApiError("Support case not found.", 404);
    }
  }

  private assertCanAccessCase(
    supportCase: ISupportCase,
    requesterId?: string,
    isStaff = false,
  ): void {
    if (isStaff) return;

    if (!requesterId || !isValidObjectId(requesterId)) {
      throw new ApiError("Authentication is required.", 401);
    }

    const ownerId = supportCase.customerId?.toString();

    if (!ownerId || ownerId !== requesterId) {
      throw new ApiError("You are not allowed to access this support case.", 403);
    }
  }
}

export const supportService = new SupportService();
