
import type { Types } from "mongoose";
import { Contact } from "../models/contact-inquiry.model.js";
import type {
  ContactCategory,
  ContactStatus,
} from "../models/contact-inquiry.model.js";
import type {
  ContactCountResult,
  ContactFilters,
  ContactPaginationOptions,
  ContactRepositoryUpdateData,
  CreateContactInput,
  PaginatedContacts,
} from "../types/contact.types.js";

type ContactFilterQuery = Record<string, any>;

interface ContactCountFilters {
  customer?: string;
  assignedTo?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

interface AggregatedCount {
  _id: string;
  count: number;
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildDateFilter = (
  createdFrom?: Date,
  createdTo?: Date,
): ContactFilterQuery => {
  if (!createdFrom && !createdTo) {
    return {};
  }

  const createdAt: ContactFilterQuery = {};

  if (createdFrom) {
    createdAt.$gte = createdFrom;
  }

  if (createdTo) {
    createdAt.$lte = createdTo;
  }

  return { createdAt };
};

const buildContactFilter = (
  filters: ContactFilters = {},
): ContactFilterQuery => {
  const query: ContactFilterQuery = {};

  if (filters.reference) {
    query.reference = {
      $regex: escapeRegex(filters.reference),
      $options: "i",
    };
  }

  if (filters.name) {
    query.name = {
      $regex: escapeRegex(filters.name),
      $options: "i",
    };
  }

  if (filters.email) {
    query.email = {
      $regex: escapeRegex(filters.email),
      $options: "i",
    };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.customer) {
    query.customer = filters.customer;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters.search) {
    const searchPattern = {
      $regex: escapeRegex(filters.search),
      $options: "i",
    };

    query.$or = [
      { reference: searchPattern },
      { name: searchPattern },
      { email: searchPattern },
      { subject: searchPattern },
      { message: searchPattern },
    ];
  }

  Object.assign(
    query,
    buildDateFilter(filters.createdFrom, filters.createdTo),
  );

  return query;
};

const buildCountFilter = (
  filters: ContactCountFilters = {},
): ContactFilterQuery => {
  const query: ContactFilterQuery = {};

  if (filters.customer) {
    query.customer = filters.customer;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  Object.assign(
    query,
    buildDateFilter(filters.createdFrom, filters.createdTo),
  );

  return query;
};

class ContactRepository {
  async create(input: CreateContactInput) {
    return Contact.create(input);
  }

  async findById(id: string) {
    return Contact.findById(id).exec();
  }

  async findByReference(reference: string) {
    return Contact.findOne({
      reference: reference.trim().toUpperCase(),
    }).exec();
  }

  async findByEmail(email: string) {
    return Contact.find({
      email: email.trim().toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findMany(
    filters: ContactFilters = {},
    pagination: ContactPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  ): Promise<PaginatedContacts<Awaited<ReturnType<typeof Contact.findById>>>> {
    const page = Math.max(1, Math.floor(pagination.page));
    const limit = Math.min(100, Math.max(1, Math.floor(pagination.limit)));
    const skip = (page - 1) * limit;
    const sortBy = pagination.sortBy ?? "createdAt";
    const sortOrder = pagination.sortOrder === "asc" ? 1 : -1;
    const query = buildContactFilter(filters);

    const [items, total] = await Promise.all([
      Contact.find(query)
        .sort({ [sortBy]: sortOrder, _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Contact.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1 && total > 0,
      },
    };
  }

  async updateById(
    id: string,
    updates: ContactRepositoryUpdateData,
  ) {
    const updateData: Record<string, unknown> = { ...updates };

    if (updates.status === "resolved" && !updates.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    if (updates.status === "closed" && !updates.closedAt) {
      updateData.closedAt = new Date();
    }

    if (updates.status && updates.status !== "resolved") {
      updateData.resolvedAt = null;
    }

    if (updates.status && updates.status !== "closed") {
      updateData.closedAt = null;
    }

    return Contact.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async deleteById(id: string) {
    return Contact.findByIdAndDelete(id).exec();
  }

  async existsById(id: string): Promise<boolean> {
    const contact = await Contact.exists({ _id: id }).exec();
    return contact !== null;
  }

  async count(filters: ContactCountFilters = {}): Promise<number> {
    return Contact.countDocuments(buildCountFilter(filters)).exec();
  }

  async getCounts(
    filters: ContactCountFilters = {},
  ): Promise<ContactCountResult> {
    const query = buildCountFilter(filters);

    const [total, statusCounts, categoryCounts] = await Promise.all([
      Contact.countDocuments(query).exec(),
      Contact.aggregate<AggregatedCount>([
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).exec(),
      Contact.aggregate<AggregatedCount>([
        { $match: query },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]).exec(),
    ]);

    const byStatus: Partial<Record<ContactStatus, number>> = {};
    const byCategory: Partial<Record<ContactCategory, number>> = {};

    for (const entry of statusCounts) {
      byStatus[entry._id as ContactStatus] = entry.count;
    }

    for (const entry of categoryCounts) {
      byCategory[entry._id as ContactCategory] = entry.count;
    }

    return {
      total,
      byStatus,
      byCategory,
    };
  }

  async countByStatus(
    status: ContactStatus,
    filters: ContactCountFilters = {},
  ): Promise<number> {
    return Contact.countDocuments({
      ...buildCountFilter(filters),
      status,
    }).exec();
  }

  async countByCategory(
    category: ContactCategory,
    filters: ContactCountFilters = {},
  ): Promise<number> {
    return Contact.countDocuments({
      ...buildCountFilter(filters),
      category,
    }).exec();
  }

  async assignToStaff(
    id: string,
    staffUserId: string | Types.ObjectId,
  ) {
    return Contact.findByIdAndUpdate(
      id,
      { $set: { assignedTo: staffUserId } },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async unassignStaff(id: string) {
    return Contact.findByIdAndUpdate(
      id,
      { $set: { assignedTo: null } },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }
}

export const contactRepository = new ContactRepository();
