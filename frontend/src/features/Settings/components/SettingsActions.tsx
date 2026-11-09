
"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  LoaderCircle,
  Pencil,
  Save,
  X,
} from "lucide-react";

interface SettingsActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  onEdit: () => void;
  onSave: () => void | Promise<void>;
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
  const buttonBase =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
    >
      {!isEditing ? (
        <button
          type="button"
          onClick={onEdit}
          className={`${buttonBase} border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
        >
          <Pencil className="h-4 w-4" />
          Edit Settings
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className={`${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void onSave()}
            disabled={isSaving || saveSuccess}
            className={`${buttonBase} border border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 focus:ring-blue-500 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500`}
          >
            {isSaving ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </>
      )}
    </motion.div>
  );
}
