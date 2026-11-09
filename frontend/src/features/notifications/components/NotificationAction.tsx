"use client";

import { motion } from "framer-motion";
import {
  CheckCheck,
  ExternalLink,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react";
import type { Notification } from "@/types";

interface NotificationActionProps {
  notification: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenAction?: (notification: Notification) => void;
  compact?: boolean;
  disabled?: boolean;
}

export default function NotificationAction({
  notification,
  onToggleRead,
  onDelete,
  onOpenAction,
  compact = false,
  disabled = false,
}: NotificationActionProps) {
  const hasAction = Boolean(
    notification.actionLabel &&
      (notification.actionHref || onOpenAction),
  );

  const buttonBase =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-wrap items-center gap-2 ${compact ? "" : "pt-1"}`}
    >
      {hasAction && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onOpenAction?.(notification)}
          className={`${buttonBase} bg-sky-600 text-white hover:bg-sky-700`}
        >
          <ExternalLink size={15} />
          {!compact && (
            <span>{notification.actionLabel ?? "View details"}</span>
          )}
        </button>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => onToggleRead(notification.id)}
        aria-label={
          notification.read
            ? `Mark "${notification.title}" as unread`
            : `Mark "${notification.title}" as read`
        }
        className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800`}
      >
        {notification.read ? (
          <Mail size={16} />
        ) : (
          <MailOpen size={16} />
        )}
        {!compact && (
          <span>{notification.read ? "Mark unread" : "Mark as read"}</span>
        )}
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete(notification.id)}
        aria-label={`Delete "${notification.title}"`}
        className={`${buttonBase} border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60`}
      >
        <Trash2 size={16} />
        {!compact && <span>Delete</span>}
      </button>

      {notification.read && !compact && (
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCheck size={15} />
          Read
        </span>
      )}
    </motion.div>
  );
}