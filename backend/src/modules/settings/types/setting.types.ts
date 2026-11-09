
import type { Types } from "mongoose";
import type {
  ISetting,
  SettingCategory,
} from "../models/setting.model.js";

export type {
  ISetting,
  SettingCategory,
} from "../models/setting.model.js";

export interface CreateSettingInput {
  key: string;
  value: unknown;
  description?: string | null;
  category?: SettingCategory;
  isPublic?: boolean;
}

export interface UpdateSettingInput {
  value?: unknown;
  description?: string | null;
  category?: SettingCategory;
  isPublic?: boolean;
}

export interface SettingListFilters {
  category?: SettingCategory;
  isPublic?: boolean;
  search?: string;
}

export interface SettingPagination {
  page: number;
  limit: number;
}

export interface SettingListResult {
  settings: ISetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SettingCountResult {
  total: number;
  public: number;
  private: number;
  byCategory: Partial<Record<SettingCategory, number>>;
}

export interface SettingResponse {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  category: SettingCategory;
  isPublic: boolean;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicSettingsResponse {
  settings: Record<string, unknown>;
}

export interface SettingAuditContext {
  updatedBy: string;
}
