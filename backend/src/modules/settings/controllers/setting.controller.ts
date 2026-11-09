
import type { Request, Response } from "express";
import { ApiError } from "../../../utils/api-error.js";
import { settingService } from "../services/setting.service.js";
import type {
  CreateSettingValidatedInput,
  ListSettingsValidatedQuery,
  PublicSettingsValidatedQuery,
  SettingCountValidatedQuery,
  SettingIdParams,
  SettingKeyParams,
  UpdateSettingValidatedInput,
} from "../validations/setting.validation.js";

interface AuthenticatedUser {
  id?: string;
  _id?: string;
  role: string;
}

interface ValidatedRequestData {
  body?: unknown;
  params?: unknown;
  query?: unknown;
}

function getValidatedData<T>(res: Response): T {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  if (!validated) {
    throw new ApiError("Validated request data is missing.", 500, {
      code: "VALIDATED_DATA_MISSING",
    });
  }

  return validated as T;
}

function getAuthenticatedUser(res: Response): AuthenticatedUser {
  const user = res.locals.authenticatedUser as
    | AuthenticatedUser
    | undefined;

  if (!user) {
    throw new ApiError("Authentication is required.", 401, {
      code: "UNAUTHENTICATED",
    });
  }

  return user;
}

function getUserId(user: AuthenticatedUser): string {
  const id = user.id ?? user._id;

  if (!id) {
    throw new ApiError("Authenticated user ID is missing.", 401, {
      code: "USER_ID_MISSING",
    });
  }

  return id;
}

function isSuperAdmin(user: AuthenticatedUser): boolean {
  return user.role === "super_admin";
}

export const createSetting = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { body } = getValidatedData<{
    body: CreateSettingValidatedInput;
  }>(res);

  const user = getAuthenticatedUser(res);

  const setting = await settingService.createSetting(
    body,
    getUserId(user),
  );

  res.status(201).json({
    success: true,
    message: "Setting created successfully.",
    data: setting,
  });
};

export const getSettingById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { params } = getValidatedData<{
    params: SettingIdParams;
  }>(res);

  const setting = await settingService.getSettingById(params.settingId);

  if (!setting.isPublic) {
    const user = getAuthenticatedUser(res);

    if (
      user.role !== "admin" &&
      !isSuperAdmin(user) &&
      user.role !== "staff"
    ) {
      throw new ApiError("You cannot access this setting.", 403, {
        code: "SETTING_ACCESS_DENIED",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: setting,
  });
};

export const getSettingByKey = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { params } = getValidatedData<{
    params: SettingKeyParams;
  }>(res);

  const setting = await settingService.getSettingByKey(params.key);

  if (!setting.isPublic) {
    const user = getAuthenticatedUser(res);

    if (
      user.role !== "admin" &&
      !isSuperAdmin(user) &&
      user.role !== "staff"
    ) {
      throw new ApiError("You cannot access this setting.", 403, {
        code: "SETTING_ACCESS_DENIED",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: setting,
  });
};

export const listSettings = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { query } = getValidatedData<{
    query: ListSettingsValidatedQuery;
  }>(res);

  const user = getAuthenticatedUser(res);

  const result = await settingService.listSettings(
    {
      category: query.category,
      isPublic: query.isPublic,
      search: query.search,
    },
    {
      page: query.page,
      limit: query.limit,
    },
  );

  if (user.role !== "admin" && !isSuperAdmin(user)) {
    result.settings = result.settings.filter(
      (setting) => setting.isPublic,
    );
  }

  res.status(200).json({
    success: true,
    data: result.settings,
    pagination: result.pagination,
  });
};

export const updateSetting = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { params, body } = getValidatedData<{
    params: SettingIdParams;
    body: UpdateSettingValidatedInput;
  }>(res);

  const user = getAuthenticatedUser(res);

  if (user.role !== "admin" && !isSuperAdmin(user)) {
    throw new ApiError("You are not allowed to update settings.", 403, {
      code: "SETTING_UPDATE_FORBIDDEN",
    });
  }

  const setting = await settingService.updateSetting(
    params.settingId,
    body,
    getUserId(user),
    isSuperAdmin(user),
  );

  res.status(200).json({
    success: true,
    message: "Setting updated successfully.",
    data: setting,
  });
};

export const deleteSetting = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { params } = getValidatedData<{
    params: SettingIdParams;
  }>(res);

  const user = getAuthenticatedUser(res);

  if (!isSuperAdmin(user)) {
    throw new ApiError(
      "Only a super administrator can delete settings.",
      403,
      { code: "SETTING_DELETE_FORBIDDEN" },
    );
  }

  const setting = await settingService.deleteSetting(
    params.settingId,
    true,
  );

  res.status(200).json({
    success: true,
    message: "Setting deleted successfully.",
    data: setting,
  });
};

export const getSettingCounts = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const user = getAuthenticatedUser(res);

  if (user.role !== "admin" && !isSuperAdmin(user)) {
    throw new ApiError("You cannot access setting statistics.", 403, {
      code: "SETTING_COUNTS_FORBIDDEN",
    });
  }

  const counts = await settingService.getSettingCounts();

  res.status(200).json({
    success: true,
    data: counts,
  });
};

export const getPublicSettings = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { query } = getValidatedData<{
    query: PublicSettingsValidatedQuery;
  }>(res);

  const settings = await settingService.getPublicSettings(
    query.category,
  );

  res.status(200).json({
    success: true,
    data: settings,
  });
};

export const getSettingCategories = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).json({
    success: true,
    data: settingService.getCategories(),
  });
};

export const getSettingCountByCategory = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { query } = getValidatedData<{
    query: SettingCountValidatedQuery;
  }>(res);

  const user = getAuthenticatedUser(res);

  if (user.role !== "admin" && !isSuperAdmin(user)) {
    throw new ApiError(
      "You cannot access setting statistics.",
      403,
      { code: "SETTING_COUNTS_FORBIDDEN" },
    );
  }

  const counts = await settingService.getSettingCounts();

  const categoryCount = query.category
    ? counts.byCategory[query.category] ?? 0
    : counts.total;

  res.status(200).json({
    success: true,
    data: {
      category: query.category ?? null,
      count: categoryCount,
    },
  });
};
