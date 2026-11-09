"use client";

import { motion } from "framer-motion";
import { BellOff } from "lucide-react";
import NotificationCard from "./NotificationCard";

export interface Notification {
id: string;
type: "booking" | "flight" | "payment" | "travel";
title: string;
message: string;
time: string;
read: boolean;
actionLabel?: string;
actionHref?: string;
}

interface NotificationListProps {
notifications: Notification[];
onToggleRead?: (id: string) => void;
onDelete?: (id: string) => void;
}

export default function NotificationList({
notifications,
onToggleRead,
onDelete,
}: NotificationListProps) {
if (notifications.length === 0) {
return (
<motion.div
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900"
> <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"> <BellOff className="h-7 w-7" /> </div>

```
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
      No notifications
    </h3>

    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
      You&apos;re all caught up. New booking updates, flight information,
      payments, and travel alerts will appear here.
    </p>
  </motion.div>
);


}

return ( <div className="space-y-3">
{notifications.map((notification, index) => (
<motion.div
key={notification.id}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{
duration: 0.35,
delay: index * 0.05,
}}
> <NotificationCard
         notification={notification}
         onToggleRead={onToggleRead}
         onDelete={onDelete}
       />
</motion.div>
))} </div>
);
}
