"use client";

import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";

interface AircraftActionProps {
onView: () => void;
onEdit: () => void;
onDelete: () => void;
}

export default function AircraftAction({
onView,
onEdit,
onDelete,
}: AircraftActionProps) {
const [open, setOpen] = useState(false);

const handleAction = (action: () => void) => {
setOpen(false);
action();
};

return ( <div className="relative">
<button
type="button"
onClick={() => setOpen((current) => !current)}
aria-label="Aircraft actions"
aria-expanded={open}
className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-sky-800 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
> <MoreHorizontal className="h-4 w-4" /> </button>


  {open && (
    <>
      <button
        type="button"
        aria-label="Close aircraft actions"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-10 cursor-default"
      />

      <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => handleAction(onView)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Eye className="h-4 w-4 text-slate-400" />
          View details
        </button>

        <button
          type="button"
          onClick={() => handleAction(onEdit)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Pencil className="h-4 w-4 text-slate-400" />
          Edit aircraft
        </button>

        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

        <button
          type="button"
          onClick={() => handleAction(onDelete)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <Trash2 className="h-4 w-4" />
          Delete aircraft
        </button>
      </div>
    </>
  )}
</div>


);
}
