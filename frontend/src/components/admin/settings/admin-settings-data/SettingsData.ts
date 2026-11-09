"use client";

export type SettingsTab =
  | "general"
  | "security"
  | "notifications"
  | "booking"
  | "payment"
  | "flight";

export type CurrencyCode =
  | "NGN"
  | "USD"
  | "GBP"
  | "EUR"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CNY"
  | "INR"
  | "AED"
  | "ZAR"
  | "GHS"
  | "KES";

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed";

export type PaymentMethod =
  | "card"
  | "bank-transfer"
  | "paypal"
  | "wallet"
  | "cash";

export interface GeneralSettings {
  airlineName: string;
  airlineCode: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  defaultCurrency: CurrencyCode;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12-hour" | "24-hour";
}

export interface SecuritySettings {
  twoFactorAuthentication: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  maxLoginAttempts: number;
  requireStrongPassword: boolean;
  allowRememberDevice: boolean;
}

export interface NotificationSettings {
  bookingNotifications: boolean;
  paymentNotifications: boolean;
  flightNotifications: boolean;
  cancellationNotifications: boolean;
  checkInNotifications: boolean;
  promotionalNotifications: boolean;
  adminAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface BookingSettings {
  allowOnlineBooking: boolean;
  allowGuestBooking: boolean;
  requirePassengerEmail: boolean;
  requirePassengerPhone: boolean;
  autoConfirmBookings: boolean;
  allowBookingCancellation: boolean;
  cancellationWindow: number;
  minimumBookingAge: number;
  maximumPassengersPerBooking: number;
  bookingReferencePrefix: string;
}

export interface PaymentSettings {
  enabledMethods: PaymentMethod[];
  defaultCurrency: CurrencyCode;
  allowPartialPayment: boolean;
  allowRefunds: boolean;
  refundWindow: number;
  requirePaymentConfirmation: boolean;
  automaticPaymentCapture: boolean;
  paymentTimeout: number;
}

export interface FlightSettings {
  allowOnlineCheckIn: boolean;
  checkInOpeningHours: number;
  checkInClosingHours: number;
  allowFlightChanges: boolean;
  flightChangeWindow: number;
  allowSeatSelection: boolean;
  allowExtraBaggage: boolean;
  maximumBaggageWeight: number;
  minimumConnectionTime: number;
  defaultFlightDuration: number;
}

export interface AdminSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  booking: BookingSettings;
  payment: PaymentSettings;
  flight: FlightSettings;
}

export const currencyOptions: {
  value: CurrencyCode;
  label: string;
  symbol: string;
}[] = [
  { value: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { value: "INR", label: "Indian Rupee", symbol: "₹" },
  { value: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { value: "ZAR", label: "South African Rand", symbol: "R" },
  { value: "GHS", label: "Ghanaian Cedi", symbol: "₵" },
  { value: "KES", label: "Kenyan Shilling", symbol: "KSh" },
];

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
];

export const timezoneOptions = [
  { value: "Africa/Lagos", label: "Lagos — West Africa Time (WAT)" },
  { value: "Africa/Accra", label: "Accra — Greenwich Mean Time (GMT)" },
  { value: "Africa/Cairo", label: "Cairo — Eastern European Time (EET)" },
  { value: "Africa/Johannesburg", label: "Johannesburg — South Africa Time (SAST)" },
  { value: "Europe/London", label: "London — Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Paris — Central European Time (CET)" },
  { value: "Europe/Berlin", label: "Berlin — Central European Time (CET)" },
  { value: "Europe/Moscow", label: "Moscow — Moscow Standard Time (MSK)" },
  { value: "Asia/Dubai", label: "Dubai — Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "Kolkata — India Standard Time (IST)" },
  { value: "Asia/Shanghai", label: "Shanghai — China Standard Time (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo — Japan Standard Time (JST)" },
  { value: "Asia/Singapore", label: "Singapore — Singapore Standard Time (SGT)" },
  { value: "Australia/Sydney", label: "Sydney — Australian Eastern Time (AET)" },
  { value: "Pacific/Auckland", label: "Auckland — New Zealand Time (NZST)" },
  { value: "America/New_York", label: "New York — Eastern Time (ET)" },
  { value: "America/Chicago", label: "Chicago — Central Time (CT)" },
  { value: "America/Denver", label: "Denver — Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles — Pacific Time (PT)" },
  { value: "America/Toronto", label: "Toronto — Eastern Time (ET)" },
  { value: "America/Sao_Paulo", label: "São Paulo — Brasília Time (BRT)" },
];

export const dateFormatOptions = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "DD MMM YYYY", label: "DD MMM YYYY" },
  { value: "MMM DD, YYYY", label: "MMM DD, YYYY" },
];

export const defaultAdminSettings: AdminSettings = {
  general: {
    airlineName: "SOG Airways",
    airlineCode: "SOG",
    supportEmail: "bronzlemmy@gmail.com",
    supportPhone: "07038915140",
    website: "https://sogairways.com",
    defaultCurrency: "NGN",
    language: "en",
    timezone: "Africa/Lagos",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
  },

  security: {
    twoFactorAuthentication: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    allowRememberDevice: true,
  },

  notifications: {
    bookingNotifications: true,
    paymentNotifications: true,
    flightNotifications: true,
    cancellationNotifications: true,
    checkInNotifications: true,
    promotionalNotifications: true,
    adminAlerts: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  },

  booking: {
    allowOnlineBooking: true,
    allowGuestBooking: true,
    requirePassengerEmail: true,
    requirePassengerPhone: true,
    autoConfirmBookings: true,
    allowBookingCancellation: true,
    cancellationWindow: 24,
    minimumBookingAge: 2,
    maximumPassengersPerBooking: 9,
    bookingReferencePrefix: "SOG",
  },

  payment: {
    enabledMethods: [
      "card",
      "bank-transfer",
      "paypal",
      "wallet",
    ],
    defaultCurrency: "NGN",
    allowPartialPayment: false,
    allowRefunds: true,
    refundWindow: 30,
    requirePaymentConfirmation: true,
    automaticPaymentCapture: true,
    paymentTimeout: 15,
  },

  flight: {
    allowOnlineCheckIn: true,
    checkInOpeningHours: 24,
    checkInClosingHours: 1,
    allowFlightChanges: true,
    flightChangeWindow: 2,
    allowSeatSelection: true,
    allowExtraBaggage: true,
    maximumBaggageWeight: 32,
    minimumConnectionTime: 90,
    defaultFlightDuration: 180,
  },
};

export const paymentMethodOptions: {
  value: PaymentMethod;
  label: string;
}[] = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "wallet", label: "Digital Wallet" },
  { value: "cash", label: "Cash" },
];

export const bookingStatusOptions: {
  value: BookingStatus;
  label: string;
}[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export function getCurrencyLabel(currency: CurrencyCode) {
  return (
    currencyOptions.find((option) => option.value === currency)?.label ??
    currency
  );
}

export function getCurrencySymbol(currency: CurrencyCode) {
  return (
    currencyOptions.find((option) => option.value === currency)?.symbol ??
    currency
  );
}

export function getTimezoneLabel(timezone: string) {
  return (
    timezoneOptions.find((option) => option.value === timezone)?.label ??
    timezone
  );
}

export function getPaymentMethodLabel(method: PaymentMethod) {
  return (
    paymentMethodOptions.find((option) => option.value === method)?.label ??
    method
  );
}