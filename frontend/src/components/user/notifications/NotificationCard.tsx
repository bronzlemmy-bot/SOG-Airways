"use client";

import { motion } from "framer-motion";
import {
AlertTriangle,
CalendarCheck,
CreditCard,
Plane,
} from "lucide-react";

import type { Notification } from "./NotificationList";
import NotificationAction from "./NotificationActions";

interface NotificationCardProps {
notification: Notification;
onToggleRead?: (id: string) => void;
onDelete?: (id: string) => void;
}

const notificationStyles = {
booking: {
icon: CalendarCheck,
iconWrapper:
"bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
},
flight: {
icon: Plane,
iconWrapper:
"bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
},
payment: {
icon: CreditCard,
iconWrapper:
"bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
},
travel: {
icon: AlertTriangle,
iconWrapper:
"bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
},
};

export default function NotificationCard({
notification,
onToggleRead,
onDelete,
}: NotificationCardProps) {
const style = notificationStyles[notification.type];
const Icon = style.icon;

const handleCardClick = () => {
if (!notification.read) {
onToggleRead?.(notification.id);
}
};

return (
<motion.article
layout
onClick={handleCardClick}
whileHover={{ y: -2 }}
transition={{ duration: 0.2 }}
className={`group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-colors sm:p-5 ${
        notification.read
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          : "border-sky-200 bg-sky-50/50 dark:border-sky-500/20 dark:bg-sky-500/5"
      }`}
>
{!notification.read && ( <span
       aria-label="Unread notification"
       className="absolute left-0 top-0 h-full w-1 bg-sky-600"
     />
)}

```
  <div className="flex gap-3 sm:gap-4">
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${style.iconWrapper}`}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate text-sm sm:text-base ${
                notification.read
                  ? "font-semibold text-slate-800 dark:text-slate-200"
                  : "font-bold text-slate-900 dark:text-white"
              }`}
            >
              {notification.title}
            </h3>

            {!notification.read && (
              <span
                aria-label="Unread notification"
                className="h-2 w-2 shrink-0 rounded-full bg-sky-600"
              />
            )}
          </div>

          <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
            {notification.time}
          </p>
        </div>

        <div className="shrink-0">
          <NotificationAction
            notification={notification}
            onToggleRead={onToggleRead}
            onDelete={onDelete}
          />
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {notification.message}
      </p>

      {notification.actionLabel && notification.actionHref && (
        <a
          href={notification.actionHref}
          onClick={(event) => event.stopPropagation()}
          className="mt-3 inline-flex text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          {notification.actionLabel}
        </a>
      )}
    </div>
  </div>
</motion.article>


);
}
