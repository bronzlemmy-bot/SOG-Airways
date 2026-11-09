
import { User } from "../../users/models/user.model.js";
import { ApiError } from "../../../utils/api-error.js";
import { staffRepository } from "../repositories/staff.repository.js";

import type {
  CreateStaffInput,
  UpdateStaffInput,
  StaffProfileDocumentData,
  StaffProfileResponse,
  StaffProfileFilters,
  StaffPaginationOptions,
  PaginatedStaffProfiles,
} from "../types/staff.types.js";

import type {
  StaffDepartment,
  StaffEmploymentStatus,
} from "../models/staff-profile.model.js";

interface StaffRepositoryUpdateData {
  employeeNumber?: string;
  department?: StaffDepartment;
  jobTitle?: string;
  employmentStatus?: StaffEmploymentStatus;
  hireDate?: Date;
  terminationDate?: Date | null;
  notes?: string | null;
}

function toStaffProfileResponse(
  staff: StaffProfileDocumentData,
): StaffProfileResponse {
  return {
    id: staff._id.toString(),
    userId: staff.userId.toString(),
    employeeNumber: staff.employeeNumber,
    department: staff.department,
    jobTitle: staff.jobTitle,
    employmentStatus: staff.employmentStatus,
    hireDate: staff.hireDate.toISOString(),
    terminationDate: staff.terminationDate
      ? staff.terminationDate.toISOString()
      : null,
    notes: staff.notes ?? null,
    createdAt: staff.createdAt.toISOString(),
    updatedAt: staff.updatedAt.toISOString(),
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function parseDate(value: string, fieldName: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new ApiError(`Invalid ${fieldName}.`, 400, {
      code: "INVALID_STAFF_DATE",
    });
  }

  return date;
}

export class StaffService {
  async createStaffProfile(
    input: CreateStaffInput,
  ): Promise<StaffProfileResponse> {
    const user = await User.findById(input.userId)
      .select("role status")
      .lean()
      .exec();

    if (!user) {
      throw new ApiError("The referenced user account was not found.", 404, {
        code: "STAFF_USER_NOT_FOUND",
      });
    }

    if (user.role !== "staff") {
      throw new ApiError(
        "A staff profile can only be created for a user with the staff role.",
        400,
        { code: "USER_IS_NOT_STAFF" },
      );
    }

    if (user.status !== "active") {
      throw new ApiError(
        "The user account must be active before a staff profile can be created.",
        403,
        { code: "STAFF_USER_NOT_ACTIVE" },
      );
    }

    const existingProfile = await staffRepository.findByUserId(input.userId);

    if (existingProfile) {
      throw new ApiError(
        "A staff profile already exists for this user.",
        409,
        { code: "STAFF_PROFILE_ALREADY_EXISTS" },
      );
    }

    const employeeNumberExists =
      await staffRepository.employeeNumberExists(input.employeeNumber);

    if (employeeNumberExists) {
      throw new ApiError("This employee number is already assigned.", 409, {
        code: "EMPLOYEE_NUMBER_ALREADY_EXISTS",
      });
    }

    const hireDate = parseDate(input.hireDate, "hire date");

    if (hireDate.getTime() > Date.now()) {
      throw new ApiError("Hire date cannot be in the future.", 400, {
        code: "INVALID_HIRE_DATE",
      });
    }

    try {
      const staff = await staffRepository.create({
        ...input,
        hireDate,
      });

      return toStaffProfileResponse(staff);
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ApiError(
          "A staff profile or employee number already exists.",
          409,
          { code: "STAFF_DUPLICATE_RECORD" },
        );
      }

      throw error;
    }
  }

  async getStaffProfileById(
    staffId: string,
  ): Promise<StaffProfileResponse> {
    const staff = await staffRepository.findById(staffId);

    if (!staff) {
      throw new ApiError("Staff profile not found.", 404, {
        code: "STAFF_PROFILE_NOT_FOUND",
      });
    }

    return toStaffProfileResponse(staff);
  }

  async getStaffProfileByUserId(
    userId: string,
  ): Promise<StaffProfileResponse> {
    const staff = await staffRepository.findByUserId(userId);

    if (!staff) {
      throw new ApiError("Staff profile not found.", 404, {
        code: "STAFF_PROFILE_NOT_FOUND",
      });
    }

    return toStaffProfileResponse(staff);
  }

  async updateStaffProfile(
    staffId: string,
    input: UpdateStaffInput,
  ): Promise<StaffProfileResponse> {
    const existing = await staffRepository.findById(staffId);

    if (!existing) {
      throw new ApiError("Staff profile not found.", 404, {
        code: "STAFF_PROFILE_NOT_FOUND",
      });
    }

    if (input.employeeNumber !== undefined) {
      const exists = await staffRepository.employeeNumberExists(
        input.employeeNumber,
        staffId,
      );

      if (exists) {
        throw new ApiError("This employee number is already assigned.", 409, {
          code: "EMPLOYEE_NUMBER_ALREADY_EXISTS",
        });
      }
    }

    const hireDate =
      input.hireDate !== undefined
        ? parseDate(input.hireDate, "hire date")
        : existing.hireDate;

    if (hireDate.getTime() > Date.now()) {
      throw new ApiError("Hire date cannot be in the future.", 400, {
        code: "INVALID_HIRE_DATE",
      });
    }

    let terminationDate: Date | null;

    if (input.terminationDate === null) {
      terminationDate = null;
    } else if (input.terminationDate !== undefined) {
      terminationDate = parseDate(
        input.terminationDate,
        "termination date",
      );
    } else {
      terminationDate = existing.terminationDate ?? null;
    }

    if (
      terminationDate !== null &&
      terminationDate.getTime() < hireDate.getTime()
    ) {
      throw new ApiError(
        "Termination date cannot be earlier than the hire date.",
        400,
        { code: "INVALID_TERMINATION_DATE" },
      );
    }

    if (terminationDate && terminationDate.getTime() > Date.now()) {
      throw new ApiError("Termination date cannot be in the future.", 400, {
        code: "INVALID_TERMINATION_DATE",
      });
    }

    if (
      input.employmentStatus === "terminated" &&
      !terminationDate
    ) {
      throw new ApiError(
        "A termination date is required when employment status is terminated.",
        400,
        { code: "TERMINATION_DATE_REQUIRED" },
      );
    }

    if (
      terminationDate &&
      input.employmentStatus !== undefined &&
      input.employmentStatus !== "terminated"
    ) {
      throw new ApiError(
        "A termination date can only be set when employment status is terminated.",
        400,
        { code: "TERMINATION_STATUS_MISMATCH" },
      );
    }

    // Explicitly build the payload using the repository's expected types.
    // Date strings are converted before they reach the repository.
    const updateData: StaffRepositoryUpdateData = {};

    if (input.employeeNumber !== undefined) {
      updateData.employeeNumber = input.employeeNumber;
    }

    if (input.department !== undefined) {
      updateData.department = input.department;
    }

    if (input.jobTitle !== undefined) {
      updateData.jobTitle = input.jobTitle;
    }

    if (input.employmentStatus !== undefined) {
      updateData.employmentStatus = input.employmentStatus;
    }

    if (input.hireDate !== undefined) {
      updateData.hireDate = hireDate;
    }

    if (input.terminationDate !== undefined) {
      updateData.terminationDate = terminationDate;
    }

    if (input.notes !== undefined) {
      updateData.notes = input.notes;
    }

    try {
      const updated = await staffRepository.updateById(
        staffId,
        updateData,
      );

      if (!updated) {
        throw new ApiError("Staff profile not found.", 404, {
          code: "STAFF_PROFILE_NOT_FOUND",
        });
      }

      return toStaffProfileResponse(updated);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (isDuplicateKeyError(error)) {
        throw new ApiError("This employee number is already assigned.", 409, {
          code: "EMPLOYEE_NUMBER_ALREADY_EXISTS",
        });
      }

      throw error;
    }
  }

  async listStaffProfiles(
    filters: StaffProfileFilters,
    pagination: StaffPaginationOptions,
  ): Promise<PaginatedStaffProfiles> {
    const { items, totalItems } = await staffRepository.findMany(
      filters,
      pagination,
    );

    return {
      items: items.map(toStaffProfileResponse),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / pagination.limit),
      },
    };
  }

  async deleteStaffProfile(staffId: string): Promise<void> {
    const deleted = await staffRepository.deleteById(staffId);

    if (!deleted) {
      throw new ApiError("Staff profile not found.", 404, {
        code: "STAFF_PROFILE_NOT_FOUND",
      });
    }
  }

  async countStaffProfiles(): Promise<number> {
    return staffRepository.count();
  }
}

export const staffService = new StaffService();
