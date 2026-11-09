"use client";

import { useCallback, useMemo, useState } from "react";

import type { Notification, NotificationType } from "@/types";

export type NotificationReadFilter = "all" | "read" | "unread";

export interface NotificationFilters {
  type: NotificationType | "all";
  read: NotificationReadFilter;
  search: string;
}

interface UseNotificationsState {
  notifications: Notification[];
  selectedNotification: Notification | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    userId: "user-001",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking has been confirmed. Review your itinerary before departure.",
    priority: "high",
    read: false,
    actionLabel: "View Booking",
    actionHref: "/user/bookings",
    createdAt: "2026-10-12T08:30:00.000Z",
  },
  {
    id: "notif-002",
    userId: "user-001",
    type: "flight",
    title: "Flight Schedule Reminder",
    message: "Review your upcoming flight details and travel date.",
    priority: "high",
    read: false,
    actionLabel: "View Trip",
    actionHref: "/user/manage-trip",
    createdAt: "2026-10-12T07:45:00.000Z",
  },
  {
    id: "notif-003",
    userId: "user-001",
    type: "payment",
    title: "Payment Successful",
    message: "Your payment has been recorded successfully.",
    priority: "normal",
    read: false,
    actionLabel: "View Payment",
    actionHref: "/user/payment-method",
    createdAt: "2026-10-12T07:15:00.000Z",
  },
  {
    id: "notif-004",
    userId: "user-001",
    type: "check-in",
    title: "Online Check-in Reminder",
    message: "Review your booking details and check in when available.",
    priority: "high",
    read: false,
    actionLabel: "Check In",
    actionHref: "/user/check-in",
    createdAt: "2026-10-11T16:20:00.000Z",
  },
  {
    id: "notif-005",
    userId: "user-001",
    type: "travel",
    title: "Travel Documents Reminder",
    message: "Ensure your passport and any required travel documents are valid.",
    priority: "normal",
    read: true,
    actionLabel: "Travel Information",
    actionHref: "/travel-information",
    createdAt: "2026-10-11T12:00:00.000Z",
    updatedAt: "2026-10-11T12:30:00.000Z",
    readAt: "2026-10-11T12:30:00.000Z",
  },
  {
    id: "notif-006",
    userId: "user-001",
    type: "booking",
    title: "Booking Details Updated",
    message: "Review your saved passenger and journey information.",
    priority: "normal",
    read: true,
    actionLabel: "Manage Booking",
    actionHref: "/user/manage-trip",
    createdAt: "2026-10-10T14:10:00.000Z",
    updatedAt: "2026-10-10T14:30:00.000Z",
    readAt: "2026-10-10T14:30:00.000Z",
  },
  {
    id: "notif-007",
    userId: "user-001",
    type: "system",
    title: "Welcome to SOG Airways",
    message: "Visit your dashboard to review trips and manage your account.",
    priority: "normal",
    read: true,
    actionLabel: "Open Dashboard",
    actionHref: "/user/dashboard",
    createdAt: "2026-10-09T09:00:00.000Z",
  },
];

function createInitialNotifications(): Notification[] {
  return INITIAL_NOTIFICATIONS.map((notification) => ({ ...notification }));
}

export function useNotifications() {
  const [state, setState] = useState<UseNotificationsState>(() => ({
    notifications: createInitialNotifications(),
    selectedNotification: null,
    loading: false,
    error: null,
  }));

  const [filters, setFilters] = useState<NotificationFilters>({
    type: "all",
    read: "all",
    search: "",
  });

  const filteredNotifications = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    return state.notifications
      .filter((notification) => {
        const matchesType =
          filters.type === "all" || notification.type === filters.type;

        const matchesRead =
          filters.read === "all" ||
          (filters.read === "read" && notification.read) ||
          (filters.read === "unread" && !notification.read);

        const matchesSearch =
          !searchTerm ||
          notification.title.toLowerCase().includes(searchTerm) ||
          notification.message.toLowerCase().includes(searchTerm) ||
          notification.type.toLowerCase().includes(searchTerm);

        return matchesType && matchesRead && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [state.notifications, filters]);

  const unreadCount = useMemo(
    () => state.notifications.filter((notification) => !notification.read).length,
    [state.notifications],
  );

  const fetchNotifications = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    const data = createInitialNotifications();

    setState((previous) => ({
      ...previous,
      notifications: data,
      loading: false,
      error: null,
    }));

    return data;
  }, []);

  const updateFilters = useCallback(
    (updates: Partial<NotificationFilters>) => {
      setFilters((previous) => ({ ...previous, ...updates }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({ type: "all", read: "all", search: "" });
  }, []);

  const getNotificationById = useCallback(
    async (id: string) => {
      const notification =
        state.notifications.find((item) => item.id === id) ?? null;

      setState((previous) => ({
        ...previous,
        selectedNotification: notification,
        error: notification ? null : "Notification not found.",
      }));

      return notification;
    },
    [state.notifications],
  );

  const markAsRead = useCallback(async (id: string) => {
    const timestamp = new Date().toISOString();
    let updatedNotification: Notification | null = null;

    setState((previous) => {
      const notifications = previous.notifications.map((notification) => {
        if (notification.id !== id) return notification;

        updatedNotification = {
          ...notification,
          read: true,
          readAt: notification.readAt ?? timestamp,
          updatedAt: timestamp,
        };

        return updatedNotification;
      });

      return {
        ...previous,
        notifications,
        selectedNotification:
          previous.selectedNotification?.id === id
            ? updatedNotification
            : previous.selectedNotification,
        error: null,
      };
    });

    return updatedNotification;
  }, []);

  const markAsUnread = useCallback(async (id: string) => {
    const timestamp = new Date().toISOString();
    let updatedNotification: Notification | null = null;

    setState((previous) => {
      const notifications = previous.notifications.map((notification) => {
        if (notification.id !== id) return notification;

        updatedNotification = {
          ...notification,
          read: false,
          readAt: undefined,
          updatedAt: timestamp,
        };

        return updatedNotification;
      });

      return {
        ...previous,
        notifications,
        selectedNotification:
          previous.selectedNotification?.id === id
            ? updatedNotification
            : previous.selectedNotification,
        error: null,
      };
    });

    return updatedNotification;
  }, []);

  const toggleReadStatus = useCallback(
    async (id: string) => {
      const notification = state.notifications.find((item) => item.id === id);

      if (!notification) return null;

      return notification.read ? markAsUnread(id) : markAsRead(id);
    },
    [state.notifications, markAsRead, markAsUnread],
  );

  const markAllAsRead = useCallback(async () => {
    const timestamp = new Date().toISOString();

    setState((previous) => ({
      ...previous,
      notifications: previous.notifications.map((notification) => ({
        ...notification,
        read: true,
        readAt: notification.readAt ?? timestamp,
        updatedAt: timestamp,
      })),
      selectedNotification: previous.selectedNotification
        ? {
            ...previous.selectedNotification,
            read: true,
            readAt: previous.selectedNotification.readAt ?? timestamp,
            updatedAt: timestamp,
          }
        : null,
      error: null,
    }));

    return true;
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    setState((previous) => ({
      ...previous,
      notifications: previous.notifications.filter(
        (notification) => notification.id !== id,
      ),
      selectedNotification:
        previous.selectedNotification?.id === id
          ? null
          : previous.selectedNotification,
      error: null,
    }));

    return true;
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    setState((previous) => ({
      ...previous,
      notifications: [],
      selectedNotification: null,
      error: null,
    }));

    return true;
  }, []);

  const clearSelectedNotification = useCallback(() => {
    setState((previous) => ({ ...previous, selectedNotification: null }));
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({ ...previous, error: null }));
  }, []);

  const resetNotifications = useCallback(() => {
    setState({
      notifications: createInitialNotifications(),
      selectedNotification: null,
      loading: false,
      error: null,
    });

    resetFilters();
  }, [resetFilters]);

  return {
    notifications: state.notifications,
    filteredNotifications,
    selectedNotification: state.selectedNotification,
    loading: state.loading,
    error: state.error,
    filters,
    unreadCount,
    readCount: state.notifications.length - unreadCount,
    totalCount: state.notifications.length,
    fetchNotifications,
    getNotificationById,
    updateFilters,
    resetFilters,
    markAsRead,
    markAsUnread,
    toggleReadStatus,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    clearSelectedNotification,
    clearError,
    resetNotifications,
  };
}