
import { Types } from "mongoose";
import { ApiError } from "../../../utils/api-error.js";
import {
  SETTING_CATEGORIES,
  type ISetting,
  type SettingCategory,
} from "../models/setting.model.js";
import {
  settingRepository,
} from "../repositories/setting.repository.js";
import type {
  CreateSettingInput,
  SettingCountResult,
  SettingListFilters,
  SettingListResult,
  SettingPagination,
  UpdateSettingInput,
} from "../types/setting.types.js";

const PROTECTED_SETTING_CATEGORIES: SettingCategory[] = [
  "security",
  "operations",
];

export class SettingService {
  async createSetting(
    input: CreateSettingInput,
    actorId?: string,
  ): Promise<ISetting> {
    const existing = await settingRepository.findByKey(input.key);

    if (existing) {
      throw new ApiError("A setting with this key already exists.", 409, {
        code: "SETTING_ALREADY_EXISTS",
      });
    }

    if (actorId && !Types.ObjectId.isValid(actorId)) {
      throw new ApiError("The acting user ID is invalid.", 400, {
        code: "INVALID_ACTOR_ID",
      });
    }

    return settingRepository.create({
      key: input.key.trim().toLowerCase(),
      value: input.value,
      description: input.description ?? null,
      category: input.category ?? "general",
      isPublic: input.isPublic ?? false,
      updatedBy: actorId ? new Types.ObjectId(actorId) : null,
    });
  }

  async getSettingById(id: string): Promise<ISetting> {
    const setting = await settingRepository.findById(id);

    if (!setting) {
      throw new ApiError("Setting not found.", 404, {
        code: "SETTING_NOT_FOUND",
      });
    }

    return setting;
  }

  async getSettingByKey(key: string): Promise<ISetting> {
    const setting = await settingRepository.findByKey(key);

    if (!setting) {
      throw new ApiError("Setting not found.", 404, {
        code: "SETTING_NOT_FOUND",
      });
    }

    return setting;
  }

  async listSettings(
    filters: SettingListFilters = {},
    pagination: SettingPagination = { page: 1, limit: 20 },
  ): Promise<SettingListResult> {
    const page = Math.max(1, Math.floor(pagination.page));
    const limit = Math.min(100, Math.max(1, Math.floor(pagination.limit)));

    const repositoryFilters = {
      category: filters.category,
      isPublic: filters.isPublic,
      search: filters.search?.trim() || undefined,
    };

    const [settings, total] = await Promise.all([
      settingRepository.findMany(repositoryFilters, {
        skip: (page - 1) * limit,
        limit,
      }),
      settingRepository.count(repositoryFilters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      settings,
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

  async getPublicSettings(
    category?: SettingCategory,
  ): Promise<Record<string, unknown>> {
    const settings = await settingRepository.findMany({
      isPublic: true,
      category,
    });

    return settings.reduce<Record<string, unknown>>(
      (result, setting) => {
        result[setting.key] = setting.value;
        return result;
      },
      {},
    );
  }

  async updateSetting(
    id: string,
    input: UpdateSettingInput,
    actorId: string,
    isSuperAdmin = false,
  ): Promise<ISetting> {
    if (!Types.ObjectId.isValid(actorId)) {
      throw new ApiError("The acting user ID is invalid.", 400, {
        code: "INVALID_ACTOR_ID",
      });
    }

    const existing = await this.getSettingById(id);

    if (
      !isSuperAdmin &&
      (PROTECTED_SETTING_CATEGORIES.includes(existing.category) ||
        (input.category &&
          PROTECTED_SETTING_CATEGORIES.includes(input.category)))
    ) {
      throw new ApiError(
        "Only a super administrator can modify security or operations settings.",
        403,
        { code: "PROTECTED_SETTING" },
      );
    }

    const updates: Partial<ISetting> = {
      updatedBy: new Types.ObjectId(actorId),
    };

    if (input.value !== undefined) updates.value = input.value;
    if (input.description !== undefined) {
      updates.description = input.description;
    }
    if (input.category !== undefined) updates.category = input.category;
    if (input.isPublic !== undefined) updates.isPublic = input.isPublic;

    const updated = await settingRepository.updateById(id, updates);

    if (!updated) {
      throw new ApiError("Setting not found.", 404, {
        code: "SETTING_NOT_FOUND",
      });
    }

    return updated;
  }

  async deleteSetting(
    id: string,
    isSuperAdmin = false,
  ): Promise<ISetting> {
    const existing = await this.getSettingById(id);

    if (
      !isSuperAdmin &&
      PROTECTED_SETTING_CATEGORIES.includes(existing.category)
    ) {
      throw new ApiError(
        "Only a super administrator can delete security or operations settings.",
        403,
        { code: "PROTECTED_SETTING" },
      );
    }

    const deleted = await settingRepository.deleteById(id);

    if (!deleted) {
      throw new ApiError("Setting not found.", 404, {
        code: "SETTING_NOT_FOUND",
      });
    }

    return deleted;
  }

  async getSettingCounts(): Promise<SettingCountResult> {
    const [total, publicCount, privateCount, byCategory] =
      await Promise.all([
        settingRepository.count(),
        settingRepository.count({ isPublic: true }),
        settingRepository.count({ isPublic: false }),
        settingRepository.countByCategory(),
      ]);

    return {
      total,
      public: publicCount,
      private: privateCount,
      byCategory,
    };
  }

  getCategories(): readonly SettingCategory[] {
    return SETTING_CATEGORIES;
  }
}

export const settingService = new SettingService();
