"use client";

import { motion } from "framer-motion";
import { Check, Edit3, X } from "lucide-react";

interface ProfileActionsProps {
isEditing: boolean;
onEdit: () => void;
onSave: () => void;
onCancel: () => void;
}

export default function ProfileActions({
isEditing,
onEdit,
onSave,
onCancel,
}: ProfileActionsProps) {
return (
<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
className="flex flex-col gap-3 sm:flex-row sm:justify-end"
>
{!isEditing ? (
<motion.button
type="button"
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
onClick={onEdit}
className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
> <Edit3 className="h-4 w-4" />
Edit Profile
</motion.button>
) : (
<>
<motion.button
type="button"
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
onClick={onCancel}
className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900"
> <X className="h-4 w-4" />
Cancel
</motion.button>

```
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        <Check className="h-4 w-4" />
        Save Changes
      </motion.button>
    </>
  )}
</motion.div>


);
}
