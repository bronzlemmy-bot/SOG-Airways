
import mongoose from "mongoose";
import { ApiError } from "../../../utils/api-error.js";
import { contentRepository } from "../repositories/content.repository.js";
import type {
  ContentListQuery,
  CreateContentInput,
  PublicContentQuery,
  UpdateContentInput,
} from "../types/content.types.js";

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validatePublicationDates(
  scheduledAt?: Date | null,
  expiresAt?: Date | null,
): void {
  if (scheduledAt && expiresAt && expiresAt <= scheduledAt) {
    throw new ApiError(
      "Expiration date must be later than the scheduled publication date.",
      400,
      { code: "INVALID_CONTENT_DATES" },
    );
  }
}

function validateObjectId(contentId: string): void {
  if (!mongoose.isValidObjectId(contentId)) {
    throw new ApiError("Invalid content ID.", 400, {
      code: "INVALID_CONTENT_ID",
    });
  }
}

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "number"
  ) {
    return String(error.code);
  }

  return undefined;
}

async function ensureSlugAvailable(
  slug: string,
  excludedContentId?: string,
): Promise<void> {
  const existing = await contentRepository.findBySlug(slug);

  if (
    existing &&
    (!excludedContentId ||
      existing._id.toString() !== excludedContentId)
  ) {
    throw new ApiError("A content item with this slug already exists.", 409, {
      code: "CONTENT_SLUG_EXISTS",
    });
  }
}

function normalizeCreateInput(
  input: CreateContentInput,
): CreateContentInput {
  const normalized: CreateContentInput = {
    ...input,
    slug: normalizeSlug(input.slug),
    tags: input.tags?.map((tag) => tag.trim()).filter(Boolean),
  };

  if (normalized.status === "published" && normalized.scheduledAt) {
    if (normalized.scheduledAt > new Date()) {
      throw new ApiError(
        "Scheduled content cannot be published before its scheduled time.",
        400,
        { code: "CONTENT_PUBLICATION_NOT_DUE" },
      );
    }
  }

  validatePublicationDates(
    normalized.scheduledAt,
    normalized.expiresAt,
  );

  return normalized;
}

export const contentService = {
  async create(input: CreateContentInput) {
    const normalized = normalizeCreateInput(input);

    if (!normalized.slug) {
      throw new ApiError("A valid content slug is required.", 400, {
        code: "INVALID_CONTENT_SLUG",
      });
    }

    await ensureSlugAvailable(normalized.slug);

    try {
      return await contentRepository.create(normalized);
    } catch (error) {
      if (getErrorCode(error) === "11000") {
        throw new ApiError(
          "A content item with this slug already exists.",
          409,
          { code: "CONTENT_SLUG_EXISTS" },
        );
      }

      throw error;
    }
  },

  async getById(contentId: string) {
    validateObjectId(contentId);

    const content = await contentRepository.findById(contentId);

    if (!content) {
      throw new ApiError("Content not found.", 404, {
        code: "CONTENT_NOT_FOUND",
      });
    }

    return content;
  },

  async getBySlug(slug: string) {
    const normalizedSlug = normalizeSlug(slug);
    const content =
      await contentRepository.findPublishedBySlug(normalizedSlug);

    if (!content) {
      throw new ApiError("Published content not found.", 404, {
        code: "CONTENT_NOT_FOUND",
      });
    }

    return content;
  },

  async update(contentId: string, input: UpdateContentInput) {
    validateObjectId(contentId);

    const existing = await contentRepository.findById(contentId);

    if (!existing) {
      throw new ApiError("Content not found.", 404, {
        code: "CONTENT_NOT_FOUND",
      });
    }

    const updates: UpdateContentInput = { ...input };

    if (updates.slug !== undefined) {
      updates.slug = normalizeSlug(updates.slug);

      if (!updates.slug) {
        throw new ApiError("A valid content slug is required.", 400, {
          code: "INVALID_CONTENT_SLUG",
        });
      }

      await ensureSlugAvailable(updates.slug, contentId);
    }

    if (updates.tags !== undefined) {
      updates.tags = updates.tags.map((tag) => tag.trim()).filter(Boolean);
    }

    const scheduledAt =
      updates.scheduledAt !== undefined
        ? updates.scheduledAt
        : existing.scheduledAt;

    const expiresAt =
      updates.expiresAt !== undefined
        ? updates.expiresAt
        : existing.expiresAt;

    validatePublicationDates(
      scheduledAt as Date | null | undefined,
      expiresAt as Date | null | undefined,
    );

    if (
      updates.status === "published" &&
      scheduledAt instanceof Date &&
      scheduledAt > new Date()
    ) {
      throw new ApiError(
        "Content cannot be published before its scheduled time.",
        400,
        { code: "CONTENT_PUBLICATION_NOT_DUE" },
      );
    }

    if (updates.status === "published") {
      updates.scheduledAt = null;
    }

    try {
      const updated = await contentRepository.updateById(
        contentId,
        updates,
      );

      if (!updated) {
        throw new ApiError("Content not found.", 404, {
          code: "CONTENT_NOT_FOUND",
        });
      }

      return updated;
    } catch (error) {
      if (getErrorCode(error) === "11000") {
        throw new ApiError(
          "A content item with this slug already exists.",
          409,
          { code: "CONTENT_SLUG_EXISTS" },
        );
      }

      throw error;
    }
  },

  async delete(contentId: string) {
    validateObjectId(contentId);

    const deleted = await contentRepository.deleteById(contentId);

    if (!deleted) {
      throw new ApiError("Content not found.", 404, {
        code: "CONTENT_NOT_FOUND",
      });
    }

    return {
      id: contentId,
      deleted: true,
    };
  },

  async list(query: ContentListQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = await contentRepository.list({
      ...query,
      page,
      limit,
    });

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  },

  async listPublic(query: PublicContentQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = await contentRepository.listPublic({
      ...query,
      page,
      limit,
    });

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  },

  async count(query: Parameters<typeof contentRepository.count>[0] = {}) {
    return contentRepository.count(query);
  },

  async getStats() {
    return contentRepository.getStats();
  },
};
