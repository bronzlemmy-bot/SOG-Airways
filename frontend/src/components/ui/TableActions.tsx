"use client";

import { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import Dropdown, {
  DropdownItem,
} from "./Dropdown";

interface TableActionsProps {
  items: DropdownItem[];
  icon?: ReactNode;
  label?: string;
  className?: string;
}

export default function TableActions({
  items,
  icon,
  label = "Actions",
  className = "",
}: TableActionsProps) {
  return (
    <Dropdown
      className={className}
      trigger={
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
          {icon ?? <MoreHorizontal className="h-5 w-5" />}
          <span className="sr-only">{label}</span>
        </span>
      }
      items={items}
      align="right"
    />
  );
}