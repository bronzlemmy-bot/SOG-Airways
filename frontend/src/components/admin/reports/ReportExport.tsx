"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";

import type { AdminReportRecord } from "./admin-reports-data/ReportsData";

interface ReportExportProps {
  reports: AdminReportRecord[];
  fileName?: string;
  label?: string;
}

export default function ReportExport({
  reports,
  fileName = "sog-airways-reports.csv",
  label = "Export Reports",
}: ReportExportProps) {
  const handleExport = () => {
    if (reports.length === 0) {
      return;
    }

    const headers = [
      "Report ID",
      "Title",
      "Type",
      "Description",
      "Date",
      "Status",
      "Bookings",
      "Passengers",
      "Flights",
      "Payments",
      "Revenue",
      "Currency",
      "Payment Method",
      "Route",
    ];

    const rows = reports.map((report) => [
      report.id,
      report.title,
      report.reportType,
      report.description,
      report.date,
      report.status,
      report.bookings,
      report.passengers,
      report.flights,
      report.payments,
      report.revenue,
      report.currency,
      report.paymentMethod ?? "",
      report.route ?? "",
    ]);

    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const disabled = reports.length === 0;

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={handleExport}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <FileSpreadsheet className="h-4 w-4" />

      <span>{label}</span>

      <Download className="h-4 w-4" />
    </motion.button>
  );
}

function escapeCsvValue(value: unknown) {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}