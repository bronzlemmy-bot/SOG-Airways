
import { Types } from "mongoose";

import { Staff } from "../models/staff-profile.model.js";

import type {
  StaffProfileDocumentData,
  StaffProfileFilters,
  StaffPaginationOptions,
} from "../types/staff.types.js";

import type {
  StaffDepartment,
  StaffEmploymentStatus,
} from "../models/staff-profile.model.js";

export class StaffRepository {
  async findById(
    staffId: string,
  ): Promise<StaffProfileDocumentData | null> {
    if (!Types.ObjectId.isValid(staffId)) {
      return null;
    }

    return Staff.findById(staffId)
      .lean<StaffProfileDocumentData>()
      .exec();
  }

  async findByUserId(
    userId: string,
  ): Promise<StaffProfileDocumentData | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return Staff.findOne({ userId: new Types.ObjectId(userId) })
      .lean<StaffProfileDocumentData>()
      .exec();
  }

  async findByEmployeeNumber(
    employeeNumber: string,
  ): Promise<StaffProfileDocumentData | null> {
    return Staff.findOne({
      employeeNumber: employeeNumber.trim().toUpperCase(),
    })
      .lean<StaffProfileDocumentData>()
      .exec();
  }

  async create(data: {
    userId: string;
    employeeNumber: string;
    department: StaffDepartment;
    jobTitle: string;
    hireDate: Date;
    notes?: string;
  }): Promise<StaffProfileDocumentData> {
    if (!Types.ObjectId.isValid(data.userId)) {
      throw new Error("A valid user ID is required.");
    }

    const staff = await Staff.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      employeeNumber: data.employeeNumber.trim().toUpperCase(),
      jobTitle: data.jobTitle.trim(),
      notes: data.notes?.trim(),
    });

    return staff.toObject() as StaffProfileDocumentData;
  }

  async updateById(
    staffId: string,
    data: {
      employeeNumber?: string;
      department?: StaffDepartment;
      jobTitle?: string;
      employmentStatus?: StaffEmploymentStatus;
      hireDate?: Date;
      terminationDate?: Date | null;
      notes?: string | null;
    },
  ): Promise<StaffProfileDocumentData | null> {
    if (!Types.ObjectId.isValid(staffId)) {
      return null;
    }

    const updateData = {
      ...data,
      ...(data.employeeNumber !== undefined
        ? { employeeNumber: data.employeeNumber.trim().toUpperCase() }
        : {}),
      ...(data.jobTitle !== undefined
        ? { jobTitle: data.jobTitle.trim() }
        : {}),
      ...(data.notes !== undefined
        ? { notes: data.notes?.trim() || undefined }
        : {}),
    };

    return Staff.findByIdAndUpdate(
      staffId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    )
      .lean<StaffProfileDocumentData>()
      .exec();
  }

  async findMany(
    filters: StaffProfileFilters,
    pagination: StaffPaginationOptions,
  ): Promise<{
    items: StaffProfileDocumentData[];
    totalItems: number;
  }> {
    const query: Record<string, unknown> = {};

    if (filters.userId) {
      if (!Types.ObjectId.isValid(filters.userId)) {
        return { items: [], totalItems: 0 };
      }

      query.userId = new Types.ObjectId(filters.userId);
    }

    if (filters.employeeNumber) {
      query.employeeNumber = filters.employeeNumber.trim().toUpperCase();
    }

    if (filters.department) {
      query.department = filters.department;
    }

    if (filters.employmentStatus) {
      query.employmentStatus = filters.employmentStatus;
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [items, totalItems] = await Promise.all([
      Staff.find(query)
        .sort({ hireDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(pagination.limit)
        .lean<StaffProfileDocumentData[]>()
        .exec(),

      Staff.countDocuments(query).exec(),
    ]);

    return { items, totalItems };
  }

  async deleteById(staffId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(staffId)) {
      return false;
    }

    const result = await Staff.deleteOne({ _id: staffId }).exec();

    return result.deletedCount > 0;
  }

  async employeeNumberExists(
    employeeNumber: string,
    excludeStaffId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      employeeNumber: employeeNumber.trim().toUpperCase(),
    };

    if (excludeStaffId && Types.ObjectId.isValid(excludeStaffId)) {
      query._id = { $ne: new Types.ObjectId(excludeStaffId) };
    }

    return (await Staff.exists(query).exec()) !== null;
  }

  async count(): Promise<number> {
    return Staff.countDocuments().exec();
  }
}

export const staffRepository = new StaffRepository();
