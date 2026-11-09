
import type {
  MESSAGE_PRIORITIES,
  MESSAGE_STATUSES,
  MESSAGE_TYPES,
} from "../models/message.model.js";

export type MessageType = (typeof MESSAGE_TYPES)[number];
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
export type MessagePriority = (typeof MESSAGE_PRIORITIES)[number];

export interface MessageAttachmentInput {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface CreateMessageInput {
  conversationId: string;
  sender: string;
  recipient?: string | null;
  subject?: string | null;
  body: string;
  type?: MessageType;
  status?: MessageStatus;
  priority?: MessagePriority;
  booking?: string | null;
  attachments?: MessageAttachmentInput[];
  metadata?: Record<string, unknown>;
}

export interface UpdateMessageInput {
  subject?: string | null;
  body?: string;
  status?: MessageStatus;
  priority?: MessagePriority;
  attachments?: MessageAttachmentInput[];
  readAt?: Date | null;
  deliveredAt?: Date | null;
  failedReason?: string | null;
  metadata?: Record<string, unknown>;
}

export interface MessageListQuery {
  page?: number;
  limit?: number;
  conversationId?: string;
  sender?: string;
  recipient?: string;
  booking?: string;
  type?: MessageType;
  status?: MessageStatus;
  priority?: MessagePriority;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  sortOrder?: "asc" | "desc";
}

export interface MessageIdParams {
  messageId: string;
}

export interface MessagePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MessageListResult<T> {
  items: T[];
  pagination: MessagePagination;
}

export interface MessageCountQuery {
  conversationId?: string;
  sender?: string;
  recipient?: string;
  type?: MessageType;
  status?: MessageStatus;
  priority?: MessagePriority;
}

export interface MessageStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  unread: number;
}
