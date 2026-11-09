"use client";

import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";

interface NotificationHeaderProps {
unreadCount?: number;
onMarkAllAsRead?: () => void;
}

export default function NotificationHeader({
unreadCount = 0,
onMarkAllAsRead,
}: NotificationHeaderProps) {
return (
<motion.div
initial={{ opacity: 0, y: -12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
> <div className="flex items-start gap-4"> <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"> <Bell className="h-6 w-6" /> </div>


    <div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        Notifications
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Stay updated with your bookings, flights, payments, and travel
        information.
      </p>

      {unreadCount > 0 && (
        <p className="mt-2 text-sm font-medium text-sky-600 dark:text-sky-400">
          {unreadCount} unread{" "}
          {unreadCount === 1 ? "notification" : "notifications"}
        </p>
      )}
    </div>
  </div>

  {unreadCount > 0 && onMarkAllAsRead && (
    <motion.button
      type="button"
      onClick={onMarkAllAsRead}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto"
    >
      <CheckCheck className="h-4 w-4" />
      Mark all as read
    </motion.button>
  )}
</motion.div>


);
}
