import { ReactNode } from "react";

interface DividerProps {
  label?: ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function Divider({
  label,
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        aria-hidden="true"
        className={`h-full w-px bg-slate-200 ${className}`}
      />
    );
  }

  if (!label) {
    return (
      <div
        aria-hidden="true"
        className={`h-px w-full bg-slate-200 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-slate-200" />

      <span className="shrink-0 text-sm text-slate-500">
        {label}
      </span>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}