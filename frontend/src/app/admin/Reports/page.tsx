"use client";

import { useMemo, useState } from "react";

import BookingReport from "@/components/admin/reports/BookingReport";
import FlightReport from "@/components/admin/reports/FlightReport";
import PassengerReport from "@/components/admin/reports/PassengerReport";
import PaymentReport from "@/components/admin/reports/PaymentReport";
import ReportCard from "@/components/admin/reports/ReportCard";
import ReportDetails from "@/components/admin/reports/ReportDetails";
import ReportFilters, {
  type ReportFilterValues,
} from "@/components/admin/reports/ReportFilters";
import ReportHeader from "@/components/admin/reports/ReportHeader";
import ReportStats from "@/components/admin/reports/ReportStats";
import ReportTable from "@/components/admin/reports/ReportTable";
import RevenueReport from "@/components/admin/reports/RevenueReport";

import {
  adminReportData,
  bookingReportData,
  flightReportData,
  passengerReportData,
  paymentReportData,
  reportSummary,
  revenueReportData,
  type AdminReportRecord,
} from "@/components/admin/reports/admin-reports-data/ReportsData";

const defaultFilters: ReportFilterValues = {
  search: "",
  reportType: "all",
  status: "all",
  period: "all",
  sortBy: "newest",
};

export default function ReportsPage() {
  const [filters, setFilters] =
    useState<ReportFilterValues>(defaultFilters);

  const [selectedReport, setSelectedReport] =
    useState<AdminReportRecord | null>(null);

  const filteredReports = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const latestReportDate = adminReportData.reduce(
      (latest, report) =>
        new Date(report.date) > new Date(latest)
          ? report.date
          : latest,
      adminReportData[0]?.date ?? new Date().toISOString(),
    );

    const latestDate = new Date(latestReportDate);

    const results = adminReportData
      .filter((report) => {
        const matchesSearch =
          !search ||
          report.title.toLowerCase().includes(search) ||
          report.description.toLowerCase().includes(search) ||
          report.reportType.toLowerCase().includes(search) ||
          report.route?.toLowerCase().includes(search);

        const matchesType =
          filters.reportType === "all" ||
          report.reportType === filters.reportType;

        const matchesStatus =
          filters.status === "all" ||
          report.status === filters.status;

        let matchesPeriod = true;

        if (filters.period !== "all") {
          const reportDate = new Date(report.date);

          if (filters.period === "year") {
            matchesPeriod =
              reportDate.getFullYear() === latestDate.getFullYear();
          } else if (filters.period === "today") {
            matchesPeriod =
              reportDate.toDateString() === latestDate.toDateString();
          } else {
            const days =
              filters.period === "7-days"
                ? 7
                : filters.period === "30-days"
                  ? 30
                  : 90;

            const startDate = new Date(latestDate);
            startDate.setDate(startDate.getDate() - days);

            matchesPeriod =
              reportDate >= startDate &&
              reportDate <= latestDate;
          }
        }

        return (
          matchesSearch &&
          matchesType &&
          matchesStatus &&
          matchesPeriod
        );
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "oldest":
            return (
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
            );

          case "title-asc":
            return a.title.localeCompare(b.title);

          case "title-desc":
            return b.title.localeCompare(a.title);

          case "revenue-high":
            return b.revenue - a.revenue;

          case "revenue-low":
            return a.revenue - b.revenue;

          case "newest":
          default:
            return (
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
            );
        }
      });

    return results;
  }, [filters]);

  const handleExportReport = (report: AdminReportRecord) => {
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

    const row = [
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
    ];

    const csv = [
      headers.map(escapeCsvValue).join(","),
      row.map(escapeCsvValue).join(","),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${createFileName(report.title)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <ReportHeader
          totalReports={filteredReports.length}
          reports={filteredReports}
        />

        <ReportStats summary={reportSummary} />

        <ReportFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />

        <section className="space-y-6">
          <RevenueReport data={revenueReportData} />

          <div className="grid gap-6 xl:grid-cols-2">
            <BookingReport data={bookingReportData} />
            <PassengerReport data={passengerReportData} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <FlightReport data={flightReportData} />
            <PaymentReport data={paymentReportData} />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Generated Reports
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Browse, inspect, and export individual administrative
              reports.
            </p>
          </div>

          <div className="hidden lg:block">
            <ReportTable
              reports={filteredReports}
              onView={setSelectedReport}
              onExport={handleExportReport}
            />
          </div>

          <div className="lg:hidden">
            <ReportCard
              reports={filteredReports}
              onView={setSelectedReport}
              onExport={handleExportReport}
            />
          </div>
        </section>
      </div>

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Report details"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedReport(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto">
            <ReportDetails
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function createFileName(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "report"
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