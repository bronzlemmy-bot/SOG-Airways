import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function InfoCard({
  title,
  description,
  children,
  icon,
  action,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              {icon}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}