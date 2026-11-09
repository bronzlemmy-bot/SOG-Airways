"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Notification, NotificationType } from "@/types";
import {
  NotificationHeader,
  NotificationFilters,
  NotificationList,
} from "@/features/notifications/components";
import type { NotificationReadFilter } from "@/features/notifications/components";
import notificationData from "@/features/notifications/data/NotificationData";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<Notification[]>(notificationData);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] =
    useState<NotificationType | "all">("all");
  const [readFilter, setReadFilter] =
    useState<NotificationReadFilter>("all");

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesSearch =
        !normalizedSearch ||
        notification.title.toLowerCase().includes(normalizedSearch) ||
        notification.message.toLowerCase().includes(normalizedSearch);

      const matchesType =
        selectedType === "all" || notification.type === selectedType;

      const matchesReadStatus =
        readFilter === "all" ||
        (readFilter === "read" && notification.read) ||
        (readFilter === "unread" && !notification.read);

      return matchesSearch && matchesType && matchesReadStatus;
    });
  }, [notifications, search, selectedType, readFilter]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setSelectedType("all");
    setReadFilter("all");
  }, []);

  const handleToggleRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) => {
        if (notification.id !== id) return notification;

        const nextRead = !notification.read;
        const now = new Date().toISOString();

        return {
          ...notification,
          read: nextRead,
          ...(nextRead
            ? { readAt: notification.readAt ?? now, updatedAt: now }
            : { readAt: undefined, updatedAt: now }),
        };
      }),
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    const now = new Date().toISOString();

    setNotifications((current) =>
      current.map((notification) =>
        notification.read
          ? notification
          : {
              ...notification,
              read: true,
              readAt: now,
              updatedAt: now,
            },
      ),
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const handleClearAll = useCallback(() => {
    if (notifications.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications? This action cannot be undone.",
    );

    if (confirmed) {
      setNotifications([]);
    }
  }, [notifications.length]);

  const handleAction = useCallback(
    (notification: Notification) => {
      if (!notification.actionHref) return;

      if (!notification.read) {
        const now = new Date().toISOString();

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                  readAt: now,
                  updatedAt: now,
                }
              : item,
          ),
        );
      }

      router.push(notification.actionHref);
    },
    [router],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <NotificationHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
        />

        <NotificationFilters
          search={search}
          selectedType={selectedType}
          readFilter={readFilter}
          onSearchChange={setSearch}
          onTypeChange={setSelectedType}
          onReadFilterChange={setReadFilter}
          onReset={resetFilters}
          resultCount={filteredNotifications.length}
        />

        <NotificationList
          notifications={filteredNotifications}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
          onAction={handleAction}
          onResetFilters={resetFilters}
          search={search}
        />
      </div>
    </main>
  );
}