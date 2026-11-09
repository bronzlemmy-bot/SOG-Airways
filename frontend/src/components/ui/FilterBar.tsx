import { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
}

export default function FilterBar({
  children,
  title,
  action,
  className = "",
}: FilterBarProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {title && (
            <h3 className="text-sm font-semibold text-slate-900">
              {title}
            </h3>
          )}

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        {children}
      </div>
    </div>
  );
}