export type NotificationType =
  | "booking"
  | "flight"
  | "payment"
  | "travel"
  | "check-in"
  | "system";

export type NotificationPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
  createdAt: string;
  updatedAt?: string;
  readAt?: string;
}