"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Edit3,
  Eye,
  Power,
  Trash2,
} from "lucide-react";

import {
  AdminStaff,
  StaffStatus,
} from "./admin-staff-data/StaffData";

interface StaffActionsProps {
  staff: AdminStaff;
  onView: (staff: AdminStaff) => void;
  onEdit: (staff: AdminStaff) => void;
  onStatusChange: (
    staff: AdminStaff,
    status: StaffStatus,
  ) => void;
  onDelete: (staff: AdminStaff) => void;
}

export default function StaffActions({
  staff,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: StaffActionsProps) {
  const isActive = staff.status === "active";
  const isSuspended = staff.status === "suspended";

  return (
    <div className="flex items-center justify-end gap-1.5">
      <ActionButton
        label="View staff"
        onClick={() => onView(staff)}
      >
        <Eye className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        label="Edit staff"
        onClick={() => onEdit(staff)}
      >
        <Edit3 className="h-4 w-4" />
      </ActionButton>

      {!isActive && (
        <ActionButton
          label="Activate staff"
          onClick={() => onStatusChange(staff, "active")}
          className="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
        >
          <CheckCircle2 className="h-4 w-4" />
        </ActionButton>
      )}

      {isActive && (
        <ActionButton
          label="Deactivate staff"
          onClick={() => onStatusChange(staff, "inactive")}
          className="text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
        >
          <Power className="h-4 w-4" />
        </ActionButton>
      )}

      {isSuspended && (
        <ActionButton
          label="Reactivate staff"
          onClick={() => onStatusChange(staff, "active")}
          className="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
        >
          <CheckCircle2 className="h-4 w-4" />
        </ActionButton>
      )}

      <ActionButton
        label="Delete staff"
        onClick={() => onDelete(staff)}
        className="text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
      >
        <Trash2 className="h-4 w-4" />
      </ActionButton>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function ActionButton({
  label,
  onClick,
  children,
  className = "",
}: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white ${className}`}
    >
      {children}
    </motion.button>
  );
}