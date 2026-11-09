"use client";

import { useState } from "react";
import { MoreHorizontal, Check, CheckCircle2, Trash2 } from "lucide-react";

import type { Notification } from "./NotificationList";

interface NotificationActionProps {
notification: Notification;
onToggleRead?: (id: string) => void;
onDelete?: (id: string) => void;
}

export default function NotificationAction({
notification,
onToggleRead,
onDelete,
}: NotificationActionProps) {
const [open, setOpen] = useState(false);

const handleToggleRead = () => {
onToggleRead?.(notification.id);
setOpen(false);
};

const handleDelete = () => {
onDelete?.(notification.id);
setOpen(false);
};

return ( <div className="relative">
<button
type="button"
aria-label="Notification actions"
aria-expanded={open}
onClick={(event) => {
event.stopPropagation();
setOpen((current) => !current);
}}
className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
> <MoreHorizontal className="h-5 w-5" /> </button>


  {open && (
    <>
      <button
        type="button"
        aria-label="Close notification actions"
        className="fixed inset-0 z-10 cursor-default"
        onClick={() => setOpen(false)}
      />

      <div
        className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleToggleRead}
          disabled={!onToggleRead}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {notification.read ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Check className="h-4 w-4 text-sky-500" />
          )}

          {notification.read ? "Mark as unread" : "Mark as read"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!onDelete}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete notification
        </button>
      </div>
    </>
  )}
</div>


);
}
