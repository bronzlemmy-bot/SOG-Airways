
import type {
  CONVERSATION_CHANNELS,
  CONVERSATION_PRIORITIES,
  CONVERSATION_STATUSES,
} from "../models/conversation.model.js";

export type ConversationStatus =
  (typeof CONVERSATION_STATUSES)[number];

export type ConversationPriority =
  (typeof CONVERSATION_PRIORITIES)[number];

export type ConversationChannel =
  (typeof CONVERSATION_CHANNELS)[number];

export interface CreateConversationInput {
  subject: string;
  participants: string[];
  createdBy: string;
  assignedTo?: string | null;
  booking?: string | null;
  status?: ConversationStatus;
  priority?: ConversationPriority;
  channel?: ConversationChannel;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationInput {
  subject?: string;
  participants?: string[];
  assignedTo?: string | null;
  booking?: string | null;
  status?: ConversationStatus;
  priority?: ConversationPriority;
  channel?: ConversationChannel;
  tags?: string[];
  unreadCount?: number;
  metadata?: Record<string, unknown>;
}

export interface ConversationListQuery {
  page?: number;
  limit?: number;
  search?: string;
  participant?: string;
  createdBy?: string;
  assignedTo?: string;
  booking?: string;
  status?: ConversationStatus;
  priority?: ConversationPriority;
  channel?: ConversationChannel;
  tag?: string;
  fromDate?: Date;
  toDate?: Date;
  sortOrder?: "asc" | "desc";
}

export interface ConversationIdParams {
  conversationId: string;
}

export interface ConversationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ConversationListResult<T> {
  items: T[];
  pagination: ConversationPagination;
}

export interface ConversationCountQuery {
  participant?: string;
  createdBy?: string;
  assignedTo?: string;
  status?: ConversationStatus;
  priority?: ConversationPriority;
  channel?: ConversationChannel;
}

export interface ConversationStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
  closed: number;
  urgent: number;
  unassigned: number;
}
