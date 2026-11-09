"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
Eye,
MoreHorizontal,
Pencil,
Trash2,
} from "lucide-react";
import { useState } from "react";

interface FlightActionProps {
onView: () => void;
onEdit: () => void;
onDelete: () => void;
}

export default function FlightAction({
onView,
onEdit,
onDelete,
}: FlightActionProps) {
const [isOpen, setIsOpen] = useState(false);

const handleAction = (action: () => void) => {
action();
setIsOpen(false);
};

return ( <div className="relative">
<button
type="button"
onClick={() => setIsOpen((current) => !current)}
aria-label="Open flight actions"
aria-expanded={isOpen}
className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
> <MoreHorizontal className="h-5 w-5" /> </button>

```
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: -4,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: -4,
        }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-10 z-30 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={() =>
            handleAction(onView)
          }
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Eye className="h-4 w-4 text-sky-500" />
          View
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(onEdit)
          }
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Pencil className="h-4 w-4 text-amber-500" />
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(onDelete)
          }
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>


);
}
