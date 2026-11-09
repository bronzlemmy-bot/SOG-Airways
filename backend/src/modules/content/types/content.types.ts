
import type {
  ContentCategory,
  ContentStatus,
  ContentType,
} from "../models/content-page.model.js";

export interface ContentSeoInput {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
}

export interface CreateContentInput {
  title: string;
  slug: string;
  type?: ContentType;
  category?: ContentCategory;
  excerpt?: string | null;
  body: string;
  imageUrl?: string | null;
  status?: ContentStatus;
  tags?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  author: string;
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  seo?: ContentSeoInput;
}

export interface UpdateContentInput {
  title?: string;
  slug?: string;
  type?: ContentType;
  category?: ContentCategory;
  excerpt?: string | null;
  body?: string;
  imageUrl?: string | null;
  status?: ContentStatus;
  tags?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  scheduledAt?: Date | null;
  expiresAt?: Date | null;
  seo?: ContentSeoInput;
}

export interface ContentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: ContentType;
  category?: ContentCategory;
  status?: ContentStatus;
  isFeatured?: boolean;
  tag?: string;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title" | "sortOrder";
  sortOrder?: "asc" | "desc";
}

export interface PublicContentQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: ContentType;
  category?: ContentCategory;
  isFeatured?: boolean;
  tag?: string;
  sortBy?: "publishedAt" | "title" | "sortOrder";
  sortOrder?: "asc" | "desc";
}

export interface ContentSlugParams {
  slug: string;
}

export interface ContentIdParams {
  contentId: string;
}

export interface ContentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContentListResult<T> {
  items: T[];
  pagination: ContentPagination;
}

export interface ContentCountQuery {
  type?: ContentType;
  category?: ContentCategory;
  status?: ContentStatus;
  isFeatured?: boolean;
}

export interface ContentStats {
  total: number;
  drafts: number;
  published: number;
  archived: number;
  scheduled: number;
  expired: number;
}
