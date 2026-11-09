

import { Types } from "mongoose";


import {
  SupportCase,
  type ISupportCase,
} from "../models/support-case.model.js";

import type {
  SupportCaseCountResult,
  SupportCaseListFilters,
} from "../types/support.types.js";

export class SupportCaseRepository {
  async create(
    data: Partial<ISupportCase>,
  ): Promise<ISupportCase> {
    const supportCase = await SupportCase.create(data);
    return supportCase;
  }

  async findById(
    caseId: string,
  ): Promise<ISupportCase | null> {
    if (!Types.ObjectId.isValid(caseId)) {
      return null;
    }

    return SupportCase.findById(caseId).exec();
  }

  async findByCaseNumber(
    caseNumber: string,
  ): Promise<ISupportCase | null> {
    return SupportCase.findOne({ caseNumber }).exec();
  }

  async findMany(
    filters: SupportCaseListFilters,
  ): Promise<{
    items: ISupportCase[];
    total: number;
  }> {
    const {
      customerId,
      customerEmail,
      assignedTo,
      category,
      priority,
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;


const query: Record<string, unknown> = {};
;

    if (customerId && Types.ObjectId.isValid(customerId)) {
      query.customerId = new Types.ObjectId(customerId);
    }

    if (customerEmail) {
      query.customerEmail = customerEmail.toLowerCase();
    }

    if (assignedTo && Types.ObjectId.isValid(assignedTo)) {
      query.assignedTo = new Types.ObjectId(assignedTo);
    }

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      query.$or = [
        { caseNumber: { $regex: escapedSearch, $options: "i" } },
        { customerName: { $regex: escapedSearch, $options: "i" } },
        { customerEmail: { $regex: escapedSearch, $options: "i" } },
        { subject: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [items, total] = await Promise.all([
      SupportCase.find(query)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      SupportCase.countDocuments(query).exec(),
    ]);

    return { items, total };
  }

  async updateById(
    caseId: string,
    updates: Partial<ISupportCase>,
  ): Promise<ISupportCase | null> {
    if (!Types.ObjectId.isValid(caseId)) {
      return null;
    }

    return SupportCase.findByIdAndUpdate(
      caseId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async addMessage(
    caseId: string,
    message: NonNullable<ISupportCase["messages"]>[number],
  ): Promise<ISupportCase | null> {
    if (!Types.ObjectId.isValid(caseId)) {
      return null;
    }

    return SupportCase.findByIdAndUpdate(
      caseId,
      {
        $push: { messages: message },
        $set: {
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async count(
    filters: Omit<
      SupportCaseListFilters,
      "search" | "page" | "limit" | "sortBy" | "sortOrder"
    > = {},
  ): Promise<SupportCaseCountResult> {
    const query: Record<string, unknown> = {};

    if (filters.customerId && Types.ObjectId.isValid(filters.customerId)) {
      query.customerId = new Types.ObjectId(filters.customerId);
    }

    if (filters.customerEmail) {
      query.customerEmail = filters.customerEmail.toLowerCase();
    }

    if (filters.assignedTo && Types.ObjectId.isValid(filters.assignedTo)) {
      query.assignedTo = new Types.ObjectId(filters.assignedTo);
    }

    if (filters.category) query.category = filters.category;
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;

    const [
      total,
      open,
      inProgress,
      waitingForCustomer,
      resolved,
      closed,
    ] = await Promise.all([
      SupportCase.countDocuments(query).exec(),
      SupportCase.countDocuments({ ...query, status: "open" }).exec(),
      SupportCase.countDocuments({
        ...query,
        status: "in_progress",
      }).exec(),
      SupportCase.countDocuments({
        ...query,
        status: "waiting_for_customer",
      }).exec(),
      SupportCase.countDocuments({
        ...query,
        status: "resolved",
      }).exec(),
      SupportCase.countDocuments({ ...query, status: "closed" }).exec(),
    ]);

    return {
      total,
      open,
      inProgress,
      waitingForCustomer,
      resolved,
      closed,
    };
  }

  async deleteById(caseId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(caseId)) {
      return false;
    }

    const result = await SupportCase.deleteOne({
      _id: caseId,
    }).exec();

    return result.deletedCount > 0;
  }
}

export const supportCaseRepository = new SupportCaseRepository();
