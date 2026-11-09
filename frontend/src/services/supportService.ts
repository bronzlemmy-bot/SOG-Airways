import { apiService } from "./api";

import type {
  SupportApiCategory,
  SupportApiPriority,
  SupportApiStatus,
  SupportCaseRecord,
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types";

export interface SupportTicketFilters {
  status?: SupportTicketStatus | SupportApiStatus;
  userId?: string;
  category?: SupportApiCategory;
  priority?: SupportApiPriority | SupportTicketPriority;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateSupportTicketData {
  customerName: string;
  customerEmail: string;
  subject: string;
  category?: SupportApiCategory;
  priority?: SupportApiPriority;
  description: string;
  attachments?: string[];
}

export interface UpdateSupportTicketData {
  subject?: string;
  description?: string;
  category?: SupportApiCategory;
  priority?: SupportApiPriority;
  status?: SupportApiStatus;
}

export interface CreateSupportMessageData {
  ticketId: string;
  message: string;
}

function toSupportTicket(record: SupportCaseRecord): SupportTicket {
  const categories: Record<SupportApiCategory, SupportTicket["category"]> = {
    booking: "booking",
    payment: "payment",
    cancellation: "other",
    refund: "refund",
    check_in: "check-in",
    baggage: "baggage",
    flight: "flight",
    account: "other",
    technical: "technical",
    other: "other",
  };
  const statuses: Record<SupportApiStatus, SupportTicketStatus> = {
    open: "open",
    in_progress: "in-progress",
    waiting_for_customer: "waiting-for-customer",
    resolved: "resolved",
    closed: "closed",
  };

  return {
    id: record._id,
    ticketNumber: record.caseNumber,
    userId: record.customerId ?? "",
    subject: record.subject,
    description: record.description,
    category: categories[record.category],
    status: statuses[record.status],
    priority: record.priority === "medium" ? "normal" : record.priority,
    messages: record.messages.map((message) => message.message),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    resolvedAt: record.resolvedAt ?? undefined,
    closedAt: record.closedAt ?? undefined,
  };
}

export const supportService = {
  async getTickets(): Promise<SupportTicket[]> {
    const records = await apiService.get<SupportCaseRecord[]>("/support");
    return records.map(toSupportTicket);
  },

  async getTicketById(
    id: string,
  ): Promise<SupportTicket> {
    const record = await apiService.get<SupportCaseRecord>(
      `/support/${encodeURIComponent(id)}`,
    );
    return toSupportTicket(record);
  },

  async getTicketsByUser(): Promise<SupportTicket[]> {
    return this.getTickets();
  },

  async getTicketsByFilters(
    filters: SupportTicketFilters,
  ): Promise<SupportTicket[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set("status", filters.status.replaceAll("-", "_"));
    }

    if (filters.userId) {
      params.set("customerId", filters.userId);
    }

    if (filters.category) {
      params.set(
        "category",
        filters.category.replaceAll("-", "_"),
      );
    }

    if (filters.priority) {
      params.set(
        "priority",
        filters.priority === "normal" ? "medium" : filters.priority,
      );
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }

    const query = params.toString();

    const records = await apiService.get<SupportCaseRecord[]>(
      `/support${query ? `?${query}` : ""}`,
    );
    return records.map(toSupportTicket);
  },

  async createTicket(
    data: CreateSupportTicketData,
  ): Promise<SupportTicket> {
    const record = await apiService.post<SupportCaseRecord>(
      "/support",
      data,
    );
    return toSupportTicket(record);
  },

  async updateTicket(
    id: string,
    data: UpdateSupportTicketData,
  ): Promise<SupportTicket> {
    const record = await apiService.patch<SupportCaseRecord>(
      `/support/${encodeURIComponent(id)}`,
      data,
    );
    return toSupportTicket(record);
  },

  async updateTicketStatus(
    id: string,
    status: SupportTicketStatus,
  ): Promise<SupportTicket> {
    const record = await apiService.patch<SupportCaseRecord>(
      `/support/${encodeURIComponent(id)}`,
      { status: status.replaceAll("-", "_") },
    );
    return toSupportTicket(record);
  },

  async addMessage(
    data: CreateSupportMessageData,
  ): Promise<void> {
    await apiService.post(
      `/support/${encodeURIComponent(data.ticketId)}/messages`,
      { message: data.message },
    );
  },

  async closeTicket(
    id: string,
  ): Promise<SupportTicket> {
    return this.updateTicket(id, { status: "closed" });
  },

  async deleteTicket(
    id: string,
  ): Promise<void> {
    await apiService.delete(
      `/support/${encodeURIComponent(id)}`,
    );
  },
};