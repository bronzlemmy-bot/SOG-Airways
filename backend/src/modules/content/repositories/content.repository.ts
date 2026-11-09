
import { Content } from "../models/content-page.model.js";
import type { ContentRecord } from "../models/content-page.model.js";
import type {
  ContentCountQuery,
  ContentListQuery,
  ContentStats,
  CreateContentInput,
  PublicContentQuery,
  UpdateContentInput,
} from "../types/content.types.js";

type ContentDocument = ContentRecord & {
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type ContentFilter = Record<string, any>;

function buildSearchFilter(search?: string): ContentFilter {
  if (!search) return {};

  return {
    $text: { $search: search },
  };
}

function buildAdminFilter(query: ContentListQuery): ContentFilter {
  const filter: ContentFilter = {
    ...buildSearchFilter(query.search),
  };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured;
  }

  if (query.tag) filter.tags = query.tag;

  return filter;
}

function buildPublicFilter(query: PublicContentQuery): ContentFilter {
  const now = new Date();

  const filter: ContentFilter = {
    status: "published",
    publishedAt: { $lte: now },
    $and: [
      {
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: now } },
        ],
      },
      {
        $or: [
          { scheduledAt: null },
          { scheduledAt: { $lte: now } },
        ],
      },
    ],
    ...buildSearchFilter(query.search),
  };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured;
  }

  if (query.tag) filter.tags = query.tag;

  return filter;
}

function buildSort(
  sortBy: string | undefined,
  sortOrder: "asc" | "desc" | undefined,
  defaultSort: Record<string, 1 | -1>,
): Record<string, 1 | -1> {
  if (!sortBy) return defaultSort;

  return {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
    _id: -1,
  };
}

export const contentRepository = {
  create(input: CreateContentInput) {
    return Content.create(input);
  },

  findById(contentId: string) {
    return Content.findById(contentId).exec();
  },

  findBySlug(slug: string) {
    return Content.findOne({ slug }).exec();
  },

  findPublishedBySlug(slug: string) {
    const now = new Date();

    return Content.findOne({
      slug,
      status: "published",
      publishedAt: { $lte: now },
      $and: [
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: now } },
          ],
        },
        {
          $or: [
            { scheduledAt: null },
            { scheduledAt: { $lte: now } },
          ],
        },
      ],
    }).exec();
  },

  updateById(contentId: string, updates: UpdateContentInput) {
    return Content.findByIdAndUpdate(
      contentId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  },

  deleteById(contentId: string) {
    return Content.findByIdAndDelete(contentId).exec();
  },

  async list(
    query: ContentListQuery,
  ): Promise<{
    items: ContentDocument[];
    total: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = buildAdminFilter(query);

    const sort = buildSort(query.sortBy, query.sortOrder, {
      createdAt: -1,
    });

    const [items, total] = await Promise.all([
      Content.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "firstName lastName email")
        .lean<ContentDocument[]>()
        .exec(),

      Content.countDocuments(filter).exec(),
    ]);

    return { items, total };
  },

  async listPublic(
    query: PublicContentQuery,
  ): Promise<{
    items: ContentDocument[];
    total: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = buildPublicFilter(query);

    const sort = buildSort(query.sortBy, query.sortOrder, {
      publishedAt: -1,
    });

    const [items, total] = await Promise.all([
      Content.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ContentDocument[]>()
        .exec(),

      Content.countDocuments(filter).exec(),
    ]);

    return { items, total };
  },

  count(query: ContentCountQuery = {}) {
    const filter: ContentFilter = {};

    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;

    if (query.isFeatured !== undefined) {
      filter.isFeatured = query.isFeatured;
    }

    return Content.countDocuments(filter).exec();
  },

  async getStats(): Promise<ContentStats> {
    const now = new Date();

    const [total, drafts, published, archived, scheduled, expired] =
      await Promise.all([
        Content.countDocuments().exec(),

        Content.countDocuments({
          status: "draft",
        }).exec(),

        Content.countDocuments({
          status: "published",
          publishedAt: { $lte: now },
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: now } },
          ],
        }).exec(),

        Content.countDocuments({
          status: "archived",
        }).exec(),

        Content.countDocuments({
          status: "published",
          scheduledAt: { $gt: now },
        }).exec(),

        Content.countDocuments({
          expiresAt: { $lte: now },
        }).exec(),
      ]);

    return {
      total,
      drafts,
      published,
      archived,
      scheduled,
      expired,
    };
  },
};
