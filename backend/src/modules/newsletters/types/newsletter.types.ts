
import type {
  NEWSLETTER_SOURCES,
  NEWSLETTER_STATUSES,
} from "../models/newsletter-subscriber.model.js";

export type NewsletterStatus =
  (typeof NEWSLETTER_STATUSES)[number];

export type NewsletterSource =
  (typeof NEWSLETTER_SOURCES)[number];

export interface CreateNewsletterInput {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: NewsletterSource;
  consentGiven: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateNewsletterInput {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  status?: NewsletterStatus;
  source?: NewsletterSource;
  consentGiven?: boolean;
  metadata?: Record<string, unknown>;
}

export interface NewsletterListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: NewsletterStatus;
  source?: NewsletterSource;
  fromDate?: Date;
  toDate?: Date;
  sortOrder?: "asc" | "desc";
}

export interface NewsletterIdParams {
  newsletterId: string;
}

export interface NewsletterPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NewsletterListResult<T> {
  items: T[];
  pagination: NewsletterPagination;
}

export interface NewsletterCountQuery {
  status?: NewsletterStatus;
  source?: NewsletterSource;
  fromDate?: Date;
  toDate?: Date;
}

export interface NewsletterStats {
  total: number;
  pending: number;
  subscribed: number;
  unsubscribed: number;
}
