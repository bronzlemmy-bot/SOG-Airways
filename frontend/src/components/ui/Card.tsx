import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function Card({
  children,
  title,
  description,
  headerAction,
  footer,
  className = "",
  contentClassName = "",
}: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {(title || description || headerAction) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900">
                {title}
              </h3>
            )}

            {description && (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>

          {headerAction && (
            <div className="shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={`p-5 ${contentClassName}`}>
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-100 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}