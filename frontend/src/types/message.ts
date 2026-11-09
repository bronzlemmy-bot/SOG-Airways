export type MessageSenderType =
  | "customer"
  | "staff"
  | "system";

export type MessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: MessageSenderType;
  content: string;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  createdAt: string;
  updatedAt?: string;
  readAt?: string;
}