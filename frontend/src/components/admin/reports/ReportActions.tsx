"use client";

import {
  Download,
  Eye,
} from "lucide-react";

import type { AdminReportRecord } from "./admin-reports-data/ReportsData";

interface ReportActionsProps {
  report: AdminReportRecord;
  onView: (report: AdminReportRecord) => void;
  onExport: (report: AdminReportRecord) => void;
}

export default function ReportActions({
  report,
  onView,
  onExport,
}: ReportActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onView(report)}
        title="View report"
        aria-label={`View ${report.title}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onExport(report)}
        title="Export report"
        aria-label={`Export ${report.title}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}