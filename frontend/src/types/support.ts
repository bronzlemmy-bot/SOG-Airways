export type SupportTicketStatus =
  | "open"
  | "in-progress"
  | "waiting-for-customer"
  | "resolved"
  | "closed";

export type SupportTicketPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export type SupportApiCategory =
  | "booking"
  | "payment"
  | "cancellation"
  | "refund"
  | "check_in"
  | "baggage"
  | "flight"
  | "account"
  | "technical"
  | "other";

export type SupportApiPriority = "low" | "medium" | "high" | "urgent";

export type SupportApiStatus =
  | "open"
  | "in_progress"
  | "waiting_for_customer"
  | "resolved"
  | "closed";

export type SupportCategory =
  | "booking"
  | "flight"
  | "payment"
  | "check-in"
  | "baggage"
  | "refund"
  | "technical"
  | "other";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  category: SupportCategory;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assignedStaffId?: string;
  messages: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface SupportCaseRecord {
  _id: string;
  caseNumber: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: SupportApiCategory;
  status: SupportApiStatus;
  priority: SupportApiPriority;
  messages: Array<{
    senderId: string | null;
    senderRole: "customer" | "staff" | "admin" | "system";
    message: string;
    attachments: string[];
    createdAt: string;
  }>;
  resolution?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportCategoryOption {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface SupportResponse {
  ticketId: string;
  messageId: string;
  senderId: string;
  senderType: "customer" | "staff";
  message: string;
  createdAt: string;
}