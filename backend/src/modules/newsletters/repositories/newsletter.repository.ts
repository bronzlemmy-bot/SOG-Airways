
import mongoose, { type SortOrder } from "mongoose";

import { Newsletter } from "../models/newsletter-subscriber.model.js";

import type {
  CreateNewsletterInput,
  NewsletterCountQuery,
  NewsletterListQuery,
  NewsletterStats,
  UpdateNewsletterInput,
} from "../types/newsletter.types.js";

function buildNewsletterFilter(
  query: NewsletterListQuery | NewsletterCountQuery,
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if ("status" in query && query.status) {
    filter.status = query.status;
  }

  if ("source" in query && query.source) {
    filter.source = query.source;
  }

  if ("search" in query && query.search) {
    const escapedSearch = query.search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    filter.$or = [
      { email: { $regex: escapedSearch, $options: "i" } },
      { firstName: { $regex: escapedSearch, $options: "i" } },
      { lastName: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if ("fromDate" in query && query.fromDate) {
    filter.createdAt = {
      ...(filter.createdAt as Record<string, unknown> | undefined),
      $gte: query.fromDate,
    };
  }

  if ("toDate" in query && query.toDate) {
    filter.createdAt = {
      ...(filter.createdAt as Record<string, unknown> | undefined),
      $lte: query.toDate,
    };
  }

  return filter;
}

class NewsletterRepository {
  async create(input: CreateNewsletterInput) {
    const newsletter = await Newsletter.create({
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      source: input.source ?? "website",
      consentGiven: input.consentGiven,
      metadata: input.metadata ?? {},
    });

    return newsletter;
  }

  async findById(newsletterId: string) {
    if (!mongoose.isValidObjectId(newsletterId)) {
      return null;
    }

    return Newsletter.findById(newsletterId).exec();
  }

  async findByEmail(email: string) {
    return Newsletter.findOne({
      email: email.trim().toLowerCase(),
    }).exec();
  }

  async findMany(query: NewsletterListQuery = {}) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const sortOrder: SortOrder =
      query.sortOrder === "asc" ? 1 : -1;

    const filter = buildNewsletterFilter(query);

    const [items, total] = await Promise.all([
      Newsletter.find(filter as any)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Newsletter.countDocuments(filter as any).exec(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    newsletterId: string,
    input: UpdateNewsletterInput,
  ) {
    if (!mongoose.isValidObjectId(newsletterId)) {
      return null;
    }

    const update: Record<string, unknown> = { ...input };

    if (typeof update.email === "string") {
      update.email = update.email.trim().toLowerCase();
    }

    return Newsletter.findByIdAndUpdate(
      newsletterId,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async unsubscribeByEmail(email: string) {
    return Newsletter.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      {
        $set: {
          status: "unsubscribed",
          unsubscribedAt: new Date(),
        },
        $unset: {
          confirmationTokenHash: 1,
          confirmationTokenExpiresAt: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async delete(newsletterId: string) {
    if (!mongoose.isValidObjectId(newsletterId)) {
      return null;
    }

    return Newsletter.findByIdAndDelete(newsletterId).exec();
  }

  async count(query: NewsletterCountQuery = {}) {
    const filter = buildNewsletterFilter(query);

    return Newsletter.countDocuments(filter as any).exec();
  }

  async getStats(): Promise<NewsletterStats> {
    const [total, pending, subscribed, unsubscribed] =
      await Promise.all([
        Newsletter.countDocuments({}).exec(),
        Newsletter.countDocuments({ status: "pending" }).exec(),
        Newsletter.countDocuments({ status: "subscribed" }).exec(),
        Newsletter.countDocuments({ status: "unsubscribed" }).exec(),
      ]);

    return {
      total,
      pending,
      subscribed,
      unsubscribed,
    };
  }
}

export const newsletterRepository = new NewsletterRepository();
