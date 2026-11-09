
"use client";

import {
  KeyRound,
  LoaderCircle,
  Pencil,
  Save,
  X,
} from "lucide-react";

interface ProfileActionsProps {
  isEditing: boolean;
  isSaving?: boolean;
  hasChanges?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChangePassword?: () => void;
}

export default function ProfileActions({
  isEditing,
  isSaving = false,
  hasChanges = true,
  onEdit,
  onSave,
  onCancel,
  onChangePassword,
}: ProfileActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            aria-busy={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </>
      ) : (
        <>
          {onChangePassword && (
            <button
              type="button"
              onClick={onChangePassword}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
            >
              <KeyRound className="h-4 w-4" />
              Change Password
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}
