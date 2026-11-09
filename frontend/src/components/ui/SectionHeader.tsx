import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        centered ? "sm:items-center sm:justify-center" : ""
      } ${className}`}
    >
      <div
        className={`${
          centered ? "mx-auto max-w-2xl text-center" : ""
        }`}
      >
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {eyebrow}
          </p>
        )}

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}