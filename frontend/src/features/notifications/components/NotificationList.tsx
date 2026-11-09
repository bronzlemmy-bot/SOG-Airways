"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellOff,
  Inbox,
  RefreshCw,
  Search,
} from "lucide-react";
import type { Notification } from "@/types";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (notification: Notification) => void;
  onResetFilters?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  error?: string | null;
  search?: string;
}

export default function NotificationList({
  notifications,
  onToggleRead,
  onDelete,
  onAction,
  onResetFilters,
  onRefresh,
  isLoading = false,
  error = null,
  search = "",
}: NotificationListProps) {
  if (isLoading) {
    return (
      <section
        aria-label="Loading notifications"
        aria-busy="true"
        className="space-y-3"
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/60 dark:bg-rose-950/20 sm:p-10"
        role="alert"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
          <BellOff size={26} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          We couldnt&apos load your notifications
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
          {error}
        </p>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        )}
      </motion.section>
    );
  }

  if (notifications.length === 0) {
    const hasSearch = search.trim().length > 0;

    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-10 sm:py-16"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
          {hasSearch ? <Search size={28} /> : <Inbox size={28} />}
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
          {hasSearch
            ? "No matching notifications"
            : "You're all caught up"}
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
          {hasSearch
            ? "Try a different search term or reset your filters to see more notifications."
            : "There are no notifications matching your current filters. New travel updates will appear here."}
        </p>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Bell size={16} />
            Show all notifications
          </button>
        )}
      </motion.section>
    );
  }

  return (
    <section aria-label="Your notifications" className="space-y-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {notifications.length}
          </span>{" "}
          {notifications.length === 1 ? "notification" : "notifications"}
        </p>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Latest updates
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              index={index}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              onAction={onAction}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 py-4 text-xs text-slate-500 dark:text-slate-400"
      >
        <Bell size={14} />
        Youre&apos viewing your available notifications.
      </motion.div>
    </section>
  );
}