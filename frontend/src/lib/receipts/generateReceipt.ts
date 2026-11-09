import type {
  Booking,
  Payment,
  Passenger,
} from "@/types";

export interface ReceiptData {
  receiptNumber: string;
  bookingReference: string;
  paymentReference: string;
  passengerName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  bookingDate: string;
  generatedAt: string;
}

export interface GenerateReceiptInput {
  booking: Booking;
  payment: Payment;
  passenger?: Passenger;
  receiptNumber?: string;
  generatedAt?: string;
}

function formatPassengerName(
  passenger?: Passenger,
): string {
  if (!passenger) {
    return "Passenger";
  }

  const name = [
    passenger.firstName,
    passenger.middleName,
    passenger.lastName,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");

  return name || "Passenger";
}

function createReceiptNumber(
  bookingReference: string,
): string {
  const normalizedReference =
    bookingReference.trim().toUpperCase();

  return `SOG-REC-${normalizedReference}-${Date.now()}`;
}

function normalizeCurrency(
  currency?: string,
): string {
  return currency?.trim().toUpperCase() || "NGN";
}

function normalizePaymentMethod(
  method?: string,
): string {
  if (!method) {
    return "Unknown";
  }

  return method
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function normalizePaymentStatus(
  status?: string,
): string {
  if (!status) {
    return "Unknown";
  }

  return status
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function generateReceipt({
  booking,
  payment,
  passenger,
  receiptNumber,
  generatedAt,
}: GenerateReceiptInput): ReceiptData {
  return {
    receiptNumber:
      receiptNumber?.trim() ||
      createReceiptNumber(
        booking.bookingReference,
      ),

    bookingReference:
      booking.bookingReference
        .trim()
        .toUpperCase(),

    paymentReference:
      payment.paymentReference
        .trim()
        .toUpperCase(),

    passengerName:
      formatPassengerName(passenger),

    amount: payment.amount,

    currency:
      normalizeCurrency(payment.currency),

    paymentMethod:
      normalizePaymentMethod(
        payment.methodType,
      ),

    paymentStatus:
      normalizePaymentStatus(
        payment.status,
      ),

    bookingDate: booking.bookedAt,

    generatedAt:
      generatedAt || new Date().toISOString(),
  };
}