"use client";

export type ReportPeriod =
  | "today"
  | "7-days"
  | "30-days"
  | "90-days"
  | "year";

export type ReportType =
  | "overview"
  | "revenue"
  | "bookings"
  | "passengers"
  | "flights"
  | "payments";

export type ReportStatus =
  | "completed"
  | "pending"
  | "cancelled"
  | "failed"
  | "refunded";

export type ReportCurrency =
  | "NGN"
  | "USD"
  | "GBP"
  | "EUR";

export interface RevenueReportItem {
  id: string;
  date: string;
  revenue: number;
  currency: ReportCurrency;
  bookings: number;
  payments: number;
}

export interface BookingReportItem {
  id: string;
  date: string;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export interface PassengerReportItem {
  id: string;
  date: string;
  total: number;
  newPassengers: number;
  returningPassengers: number;
}

export interface FlightReportItem {
  id: string;
  date: string;
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
}

export interface PaymentReportItem {
  id: string;
  date: string;
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
}

export interface AdminReportRecord {
  id: string;
  reportType: ReportType;
  title: string;
  description: string;
  date: string;
  status: ReportStatus;

  bookings: number;
  passengers: number;
  flights: number;
  payments: number;

  revenue: number;
  currency: ReportCurrency;

  paymentMethod?: string;
  route?: string;
}

export interface ReportSummary {
  totalRevenue: number;
  totalBookings: number;
  totalPassengers: number;
  totalFlights: number;
  totalPayments: number;

  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;

  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;

  completedFlights: number;
  upcomingFlights: number;
  cancelledFlights: number;

  newPassengers: number;
  returningPassengers: number;
}

export const revenueReportData: RevenueReportItem[] = [
  {
    id: "revenue-001",
    date: "2026-09-01",
    revenue: 485000,
    currency: "NGN",
    bookings: 18,
    payments: 16,
  },
  {
    id: "revenue-002",
    date: "2026-09-05",
    revenue: 3250,
    currency: "USD",
    bookings: 12,
    payments: 11,
  },
  {
    id: "revenue-003",
    date: "2026-09-10",
    revenue: 720000,
    currency: "NGN",
    bookings: 25,
    payments: 23,
  },
  {
    id: "revenue-004",
    date: "2026-09-15",
    revenue: 4150,
    currency: "USD",
    bookings: 15,
    payments: 14,
  },
  {
    id: "revenue-005",
    date: "2026-09-20",
    revenue: 395000,
    currency: "NGN",
    bookings: 14,
    payments: 13,
  },
  {
    id: "revenue-006",
    date: "2026-09-25",
    revenue: 1950,
    currency: "EUR",
    bookings: 9,
    payments: 8,
  },
  {
    id: "revenue-007",
    date: "2026-09-30",
    revenue: 610000,
    currency: "NGN",
    bookings: 21,
    payments: 20,
  },
];

export const bookingReportData: BookingReportItem[] = [
  {
    id: "booking-report-001",
    date: "2026-09-01",
    total: 18,
    confirmed: 15,
    pending: 2,
    cancelled: 1,
  },
  {
    id: "booking-report-002",
    date: "2026-09-05",
    total: 22,
    confirmed: 19,
    pending: 2,
    cancelled: 1,
  },
  {
    id: "booking-report-003",
    date: "2026-09-10",
    total: 25,
    confirmed: 22,
    pending: 2,
    cancelled: 1,
  },
  {
    id: "booking-report-004",
    date: "2026-09-15",
    total: 15,
    confirmed: 12,
    pending: 2,
    cancelled: 1,
  },
  {
    id: "booking-report-005",
    date: "2026-09-20",
    total: 14,
    confirmed: 12,
    pending: 1,
    cancelled: 1,
  },
  {
    id: "booking-report-006",
    date: "2026-09-25",
    total: 19,
    confirmed: 16,
    pending: 2,
    cancelled: 1,
  },
  {
    id: "booking-report-007",
    date: "2026-09-30",
    total: 21,
    confirmed: 18,
    pending: 2,
    cancelled: 1,
  },
];

export const passengerReportData: PassengerReportItem[] = [
  {
    id: "passenger-report-001",
    date: "2026-09-01",
    total: 42,
    newPassengers: 25,
    returningPassengers: 17,
  },
  {
    id: "passenger-report-002",
    date: "2026-09-05",
    total: 51,
    newPassengers: 29,
    returningPassengers: 22,
  },
  {
    id: "passenger-report-003",
    date: "2026-09-10",
    total: 63,
    newPassengers: 36,
    returningPassengers: 27,
  },
  {
    id: "passenger-report-004",
    date: "2026-09-15",
    total: 39,
    newPassengers: 21,
    returningPassengers: 18,
  },
  {
    id: "passenger-report-005",
    date: "2026-09-20",
    total: 47,
    newPassengers: 26,
    returningPassengers: 21,
  },
  {
    id: "passenger-report-006",
    date: "2026-09-25",
    total: 58,
    newPassengers: 32,
    returningPassengers: 26,
  },
  {
    id: "passenger-report-007",
    date: "2026-09-30",
    total: 67,
    newPassengers: 38,
    returningPassengers: 29,
  },
];

export const flightReportData: FlightReportItem[] = [
  {
    id: "flight-report-001",
    date: "2026-09-01",
    total: 24,
    completed: 20,
    upcoming: 3,
    cancelled: 1,
  },
  {
    id: "flight-report-002",
    date: "2026-09-05",
    total: 29,
    completed: 24,
    upcoming: 4,
    cancelled: 1,
  },
  {
    id: "flight-report-003",
    date: "2026-09-10",
    total: 31,
    completed: 27,
    upcoming: 3,
    cancelled: 1,
  },
  {
    id: "flight-report-004",
    date: "2026-09-15",
    total: 22,
    completed: 18,
    upcoming: 3,
    cancelled: 1,
  },
  {
    id: "flight-report-005",
    date: "2026-09-20",
    total: 27,
    completed: 23,
    upcoming: 3,
    cancelled: 1,
  },
  {
    id: "flight-report-006",
    date: "2026-09-25",
    total: 30,
    completed: 26,
    upcoming: 3,
    cancelled: 1,
  },
  {
    id: "flight-report-007",
    date: "2026-09-30",
    total: 34,
    completed: 29,
    upcoming: 4,
    cancelled: 1,
  },
];

export const paymentReportData: PaymentReportItem[] = [
  {
    id: "payment-report-001",
    date: "2026-09-01",
    total: 20,
    completed: 17,
    pending: 2,
    failed: 1,
    refunded: 0,
  },
  {
    id: "payment-report-002",
    date: "2026-09-05",
    total: 24,
    completed: 20,
    pending: 2,
    failed: 1,
    refunded: 1,
  },
  {
    id: "payment-report-003",
    date: "2026-09-10",
    total: 28,
    completed: 24,
    pending: 2,
    failed: 1,
    refunded: 1,
  },
  {
    id: "payment-report-004",
    date: "2026-09-15",
    total: 17,
    completed: 14,
    pending: 1,
    failed: 1,
    refunded: 1,
  },
  {
    id: "payment-report-005",
    date: "2026-09-20",
    total: 21,
    completed: 18,
    pending: 1,
    failed: 1,
    refunded: 1,
  },
  {
    id: "payment-report-006",
    date: "2026-09-25",
    total: 26,
    completed: 22,
    pending: 2,
    failed: 1,
    refunded: 1,
  },
  {
    id: "payment-report-007",
    date: "2026-09-30",
    total: 30,
    completed: 26,
    pending: 2,
    failed: 1,
    refunded: 1,
  },
];

export const adminReportData: AdminReportRecord[] = [
  {
    id: "report-001",
    reportType: "bookings",
    title: "Lagos to London Bookings",
    description:
      "Booking activity for the Lagos to London route.",
    date: "2026-09-30",
    status: "completed",
    bookings: 21,
    passengers: 34,
    flights: 8,
    payments: 20,
    revenue: 610000,
    currency: "NGN",
    route: "Lagos → London",
  },
  {
    id: "report-002",
    reportType: "revenue",
    title: "Monthly Revenue Report",
    description:
      "Revenue activity recorded during September.",
    date: "2026-09-30",
    status: "completed",
    bookings: 134,
    passengers: 267,
    flights: 197,
    payments: 128,
    revenue: 2215000,
    currency: "NGN",
  },
  {
    id: "report-003",
    reportType: "passengers",
    title: "Passenger Growth Report",
    description:
      "New and returning passenger activity.",
    date: "2026-09-25",
    status: "completed",
    bookings: 96,
    passengers: 198,
    flights: 84,
    payments: 91,
    revenue: 1450000,
    currency: "NGN",
  },
  {
    id: "report-004",
    reportType: "flights",
    title: "International Flight Activity",
    description:
      "International flight activity and completion report.",
    date: "2026-09-20",
    status: "completed",
    bookings: 88,
    passengers: 176,
    flights: 72,
    payments: 82,
    revenue: 1890000,
    currency: "NGN",
    route: "International Routes",
  },
  {
    id: "report-005",
    reportType: "payments",
    title: "Payment Performance Report",
    description:
      "Payment completion and transaction activity.",
    date: "2026-09-18",
    status: "pending",
    bookings: 73,
    passengers: 141,
    flights: 62,
    payments: 69,
    revenue: 980000,
    currency: "NGN",
  },
];

export const reportSummary: ReportSummary = {
  totalRevenue: 2215000,
  totalBookings: 134,
  totalPassengers: 267,
  totalFlights: 197,
  totalPayments: 128,

  completedPayments: 111,
  pendingPayments: 9,
  failedPayments: 4,
  refundedPayments: 4,

  confirmedBookings: 112,
  pendingBookings: 15,
  cancelledBookings: 7,

  completedFlights: 167,
  upcomingFlights: 23,
  cancelledFlights: 7,

  newPassengers: 187,
  returningPassengers: 80,
};

export function formatReportDate(
  date: string,
): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

export function formatReportNumber(
  value: number,
): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatReportCurrency(
  amount: number,
  currency: ReportCurrency,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getReportTypeLabel(
  type: ReportType,
): string {
  const labels: Record<ReportType, string> = {
    overview: "Overview",
    revenue: "Revenue",
    bookings: "Bookings",
    passengers: "Passengers",
    flights: "Flights",
    payments: "Payments",
  };

  return labels[type];
}

export function getReportStatusLabel(
  status: ReportStatus,
): string {
  const labels: Record<ReportStatus, string> = {
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
    failed: "Failed",
    refunded: "Refunded",
  };

  return labels[status];
}