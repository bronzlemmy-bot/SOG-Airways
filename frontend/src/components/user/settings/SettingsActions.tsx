"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit3, RotateCcw, Save } from "lucide-react";

interface SettingsActionsProps {
isEditing: boolean;
isSaving: boolean;
saveSuccess: boolean;
onEdit: () => void;
onSave: () => void;
onCancel: () => void;
}

export default function SettingsActions({
isEditing,
isSaving,
saveSuccess,
onEdit,
onSave,
onCancel,
}: SettingsActionsProps) {
return ( <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"> <AnimatePresence mode="wait">
{!isEditing ? (
<motion.button
key="edit"
type="button"
onClick={onEdit}
initial={{ opacity: 0, y: 6 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -6 }}
transition={{ duration: 0.2 }}
className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-offset-slate-950"
> <Edit3 className="h-4 w-4" />
Edit Settings
</motion.button>
) : (
<motion.div
key="editing"
initial={{ opacity: 0, y: 6 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -6 }}
transition={{ duration: 0.2 }}
className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
> <button
           type="button"
           onClick={onCancel}
           disabled={isSaving}
           className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
         > <RotateCcw className="h-4 w-4" />
Cancel </button>


        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-offset-slate-950"
        >
          {isSaving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900"
              />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>


);
}
