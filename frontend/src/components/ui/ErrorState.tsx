import { AlertTriangle, X } from "lucide-react";
import { ReactNode } from "react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  action,
  onDismiss,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-200 bg-red-50 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-red-800">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-red-700">
            {message}
          </p>

          {action && <div className="mt-4">{action}</div>}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="rounded-lg p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}