"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
MoreHorizontal,
Eye,
Pencil,
Trash2,
} from "lucide-react";

interface AirportActionProps {
onView: () => void;
onEdit: () => void;
onDelete: () => void;
}

export default function AirportAction({
onView,
onEdit,
onDelete,
}: AirportActionProps) {
const [isOpen, setIsOpen] = useState(false);

const handleAction = (action: () => void) => {
action();
setIsOpen(false);
};

return ( <div className="relative">
<motion.button
type="button"
onClick={() => setIsOpen((previous) => !previous)}
whileTap={{ scale: 0.95 }}
aria-label="Airport actions"
aria-expanded={isOpen}
className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
> <MoreHorizontal className="h-5 w-5" />
</motion.button>


  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={() => handleAction(onView)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          View Details
        </button>

        <button
          type="button"
          onClick={() => handleAction(onEdit)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Pencil className="h-4 w-4 text-blue-500" />
          Edit Airport
        </button>

        <button
          type="button"
          onClick={() => handleAction(onDelete)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <Trash2 className="h-4 w-4" />
          Delete Airport
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>


);
}
