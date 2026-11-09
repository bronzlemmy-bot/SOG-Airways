import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ReactNode } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 overflow-x-auto text-sm"
        >
          <Link
            href="/"
            className="flex shrink-0 items-center text-slate-400 transition hover:text-slate-700"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>

          {breadcrumbs.map((breadcrumb, index) => (
            <div
              key={`${breadcrumb.label}-${index}`}
              className="flex shrink-0 items-center gap-2"
            >
              <ChevronRight className="h-4 w-4 text-slate-300" />

              {breadcrumb.href ? (
                <Link
                  href={breadcrumb.href}
                  className="text-slate-500 transition hover:text-slate-900"
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-700">
                  {breadcrumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {title}
          </h1>

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
    </div>
  );
}

export type { Breadcrumb };