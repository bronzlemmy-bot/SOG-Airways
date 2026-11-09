

export type MockTripPaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded";

export interface MockTripPayment {
  id: string;
  bookingId: string;
  bookingReference: string;
  paymentReference: string;
  paymentMethod: string;
  status: MockTripPaymentStatus;
  currency: string;
  amount: number;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_TRIP_PAYMENTS: MockTripPayment[] = [
  {
    id: "trip-payment-001",
    bookingId: "booking-sog-001",
    bookingReference: "SOG7K2M",
    paymentReference: "SOG-PAY-2026-0001",
    paymentMethod: "Card",
    status: "paid",
    currency: "NGN",
    amount: 1850000,
    paidAt: "2026-09-20T10:25:00.000Z",
    createdAt: "2026-09-20T10:20:00.000Z",
    updatedAt: "2026-09-20T10:25:00.000Z",
  },
  {
    id: "trip-payment-002",
    bookingId: "booking-sog-002",
    bookingReference: "SOG4P8Q",
    paymentReference: "SOG-PAY-2026-0002",
    paymentMethod: "Bank Transfer",
    status: "paid",
    currency: "NGN",
    amount: 920000,
    paidAt: "2026-09-25T14:10:00.000Z",
    createdAt: "2026-09-25T14:00:00.000Z",
    updatedAt: "2026-09-25T14:10:00.000Z",
  },
  {
    id: "trip-payment-003",
    bookingId: "booking-sog-003",
    bookingReference: "SOG9R5T",
    paymentReference: "SOG-PAY-2026-0003",
    paymentMethod: "Card",
    status: "paid",
    currency: "NGN",
    amount: 245000,
    paidAt: "2026-08-10T07:45:00.000Z",
    createdAt: "2026-08-10T07:35:00.000Z",
    updatedAt: "2026-08-10T07:45:00.000Z",
  },
  {
    id: "trip-payment-004",
    bookingId: "booking-sog-004",
    bookingReference: "SOG2W6N",
    paymentReference: "SOG-PAY-2026-0004",
    paymentMethod: "Card",
    status: "refunded",
    currency: "NGN",
    amount: 680000,
    paidAt: "2026-08-15T11:50:00.000Z",
    createdAt: "2026-08-15T11:40:00.000Z",
    updatedAt: "2026-09-05T09:15:00.000Z",
  },
  {
    id: "trip-payment-005",
    bookingId: "booking-sog-005",
    bookingReference: "SOG5H3X",
    paymentReference: "SOG-PAY-2026-0005",
    paymentMethod: "Bank Transfer",
    status: "pending",
    currency: "NGN",
    amount: 175000,
    createdAt: "2026-10-01T08:15:00.000Z",
    updatedAt: "2026-10-01T08:15:00.000Z",
  },
];

export function getMockTripPaymentByBookingReference(
  bookingReference: string,
): MockTripPayment | undefined {
  const normalizedReference = bookingReference.trim().toUpperCase();

  return MOCK_TRIP_PAYMENTS.find(
    (payment) =>
      payment.bookingReference.toUpperCase() === normalizedReference,
  );
}

export function getMockTripPaymentByBookingId(
  bookingId: string,
): MockTripPayment | undefined {
  return MOCK_TRIP_PAYMENTS.find(
    (payment) => payment.bookingId === bookingId,
  );
}

export function getMockTripPaymentStatus(
  payment: MockTripPayment | undefined,
): "paid" | "pending" | "failed" | "refunded" | "unknown" {
  return payment?.status ?? "unknown";
}

export default MOCK_TRIP_PAYMENTS;