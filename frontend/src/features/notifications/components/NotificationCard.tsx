"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CalendarCheck,
  Check,
  CheckCheck,
  CircleAlert,
  Clock3,
  CreditCard,
  ExternalLink,
  Luggage,
  Plane,
  Settings2,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Notification } from "@/types";

interface NotificationCardProps {
  notification: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction?: (notification: Notification) => void;
  index?: number;
}

const categoryConfig: Record<
  Notification["type"],
  { label: string; icon: LucideIcon; styles: string }
> = {
  booking: {
    label: "Booking",
    icon: CalendarCheck,
    styles:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  flight: {
    label: "Flight",
    icon: Plane,
    styles:
      "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  },
  payment: {
    label: "Payment",
    icon: CreditCard,
    styles:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  travel: {
    label: "Travel",
    icon: Luggage,
    styles:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  "check-in": {
    label: "Check-in",
    icon: UserRoundCheck,
    styles:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  },
  system: {
    label: "System",
    icon: Settings2,
    styles:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

const priorityConfig: Record<
  Notification["priority"],
  { label: string; styles: string }
> = {
  low: {
    label: "Low priority",
    styles: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  normal: {
    label: "Normal priority",
    styles: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  },
  high: {
    label: "High priority",
    styles:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  urgent: {
    label: "Urgent",
    styles: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  },
};

function formatNotificationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  const now = new Date();
  const elapsed = now.getTime() - date.getTime();

  if (elapsed >= 0 && elapsed < 60_000) {
    return "Just now";
  }

  if (elapsed >= 60_000 && elapsed < 3_600_000) {
    const minutes = Math.floor(elapsed / 60_000);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (elapsed >= 3_600_000 && elapsed < 86_400_000) {
    const hours = Math.floor(elapsed / 3_600_000);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (elapsed >= 86_400_000 && elapsed < 172_800_000) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function NotificationCard({
  notification,
  onToggleRead,
  onDelete,
  onAction,
  index = 0,
}: NotificationCardProps) {
  const category = categoryConfig[notification.type];
  const CategoryIcon = category.icon;
  const priority = priorityConfig[notification.priority];

  const hasAction = Boolean(
    notification.actionLabel && (notification.actionHref || onAction),
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.035, 0.2),
      }}
      className={`group relative overflow-hidden rounded-2xl border transition-colors ${
        notification.read
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          : "border-sky-200 bg-sky-50/50 dark:border-sky-900/70 dark:bg-sky-950/20"
      }`}
    >
      {!notification.read && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-1 bg-sky-500"
        />
      )}

      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:gap-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${category.styles}`}
        >
          <CategoryIcon size={23} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.styles}`}
            >
              {category.label}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${priority.styles}`}
            >
              {priority.label}
            </span>

            {!notification.read && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                New
              </span>
            )}
          </div>

          <h3
            className={`mt-3 text-base leading-6 ${
              notification.read
                ? "font-semibold text-slate-800 dark:text-slate-200"
                : "font-bold text-slate-950 dark:text-white"
            }`}
          >
            {notification.title}
          </h3>

          <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-400">
            {notification.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              <time dateTime={notification.createdAt}>
                {formatNotificationDate(notification.createdAt)}
              </time>
            </span>

            {notification.read && notification.readAt && (
              <span className="inline-flex items-center gap-1.5">
                <CheckCheck size={14} />
                Read
              </span>
            )}

            {notification.priority === "urgent" && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-300">
                <CircleAlert size={14} />
                Requires attention
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {hasAction && (
              <button
                type="button"
                onClick={() => onAction?.(notification)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                {notification.actionLabel}
                <ExternalLink size={15} />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleRead(notification.id)}
              aria-label={
                notification.read
                  ? `Mark ${notification.title} as unread`
                  : `Mark ${notification.title} as read`
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {notification.read ? (
                <>
                  <Bell size={15} />
                  Mark unread
                </>
              ) : (
                <>
                  <Check size={15} />
                  Mark as read
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              aria-label={`Delete ${notification.title}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-rose-900/60 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-950/30"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}