
import { Types } from "mongoose";
import { Setting } from "../models/setting.model.js";
import type {
  ISetting,
  SettingCategory,
} from "../models/setting.model.js";

export interface SettingRepositoryFilters {
  category?: SettingCategory;
  isPublic?: boolean;
  search?: string;
}

export interface SettingRepositoryPagination {
  skip: number;
  limit: number;
}

export class SettingRepository {
  async create(
    data: Partial<ISetting>,
  ): Promise<ISetting> {
    const setting = await Setting.create(data);
    return setting.toObject() as ISetting;
  }

  async findById(id: string): Promise<ISetting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Setting.findById(id).lean<ISetting>().exec();
  }

  async findByKey(key: string): Promise<ISetting | null> {
    return Setting.findOne({ key: key.toLowerCase() })
      .lean<ISetting>()
      .exec();
  }

  async findMany(
    filters: SettingRepositoryFilters = {},
    pagination?: SettingRepositoryPagination,
  ): Promise<ISetting[]> {
    const query: Record<string, unknown> = {};

    if (filters.category !== undefined) {
      query.category = filters.category;
    }

    if (filters.isPublic !== undefined) {
      query.isPublic = filters.isPublic;
    }

    if (filters.search) {
      const escapedSearch = filters.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      query.$or = [
        { key: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    let request = Setting.find(query).sort({ category: 1, key: 1 });

    if (pagination) {
      request = request
        .skip(Math.max(0, pagination.skip))
        .limit(Math.max(1, pagination.limit));
    }

    return request.lean<ISetting[]>().exec();
  }

  async updateById(
    id: string,
    updates: Partial<ISetting>,
  ): Promise<ISetting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Setting.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    )
      .lean<ISetting>()
      .exec();
  }

  async deleteById(id: string): Promise<ISetting | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Setting.findByIdAndDelete(id).lean<ISetting>().exec();
  }

  async count(
    filters: SettingRepositoryFilters = {},
  ): Promise<number> {
    const query: Record<string, unknown> = {};

    if (filters.category !== undefined) {
      query.category = filters.category;
    }

    if (filters.isPublic !== undefined) {
      query.isPublic = filters.isPublic;
    }

    if (filters.search) {
      const escapedSearch = filters.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      query.$or = [
        { key: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    return Setting.countDocuments(query).exec();
  }

  async countByCategory(): Promise<
    Partial<Record<SettingCategory, number>>
  > {
    const results = await Setting.aggregate<{
      _id: SettingCategory;
      count: number;
    }>([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]).exec();

    return results.reduce<
      Partial<Record<SettingCategory, number>>
    >((counts, item) => {
      counts[item._id] = item.count;
      return counts;
    }, {});
  }
}

export const settingRepository = new SettingRepository();
