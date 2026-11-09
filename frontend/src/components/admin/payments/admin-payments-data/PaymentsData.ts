"use client";

export type PaymentStatus =
  | "completed"
  | "successful"
  | "pending"
  | "processing"
  | "failed"
  | "refunded"
  | "partially-refunded"
  | "cancelled";

export type PaymentMethod =
  | "card"
  | "bank-transfer"
  | "paypal"
  | "wallet"
  | "cash"
  | "mobile-money"
  | "other";

export type PaymentCurrency = "NGN" | "USD" | "GBP" | "EUR";

export interface AdminPayment {
  id: string;
  paymentId: string;
  bookingId: string;
  passengerId: string;
  passengerName: string;
  passengerEmail: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionReference: string;
  description: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export const adminPaymentData: AdminPayment[] = [
  {
    id: "payment-001",
    paymentId: "PAY-0001",
    bookingId: "SOG-BOOK-1001",
    passengerId: "PSG-0001",
    passengerName: "John Adeyemi",
    passengerEmail: "john.adeyemi@example.com",
    amount: 485000,
    currency: "NGN",
    paymentMethod: "card",
    status: "completed",
    transactionReference: "TXN-SOG-100001",
    description: "Lagos to London round-trip booking",
    paymentDate: "2026-09-24",
    createdAt: "2026-09-24",
    updatedAt: "2026-09-24",
  },
  {
    id: "payment-002",
    paymentId: "PAY-0002",
    bookingId: "SOG-BOOK-1002",
    passengerId: "PSG-0002",
    passengerName: "Sarah Williams",
    passengerEmail: "sarah.williams@example.com",
    amount: 3250,
    currency: "USD",
    paymentMethod: "paypal",
    status: "completed",
    transactionReference: "TXN-SOG-100002",
    description: "London to New York flight booking",
    paymentDate: "2026-09-23",
    createdAt: "2026-09-23",
    updatedAt: "2026-09-23",
  },
  {
    id: "payment-003",
    paymentId: "PAY-0003",
    bookingId: "SOG-BOOK-1003",
    passengerId: "PSG-0003",
    passengerName: "David Okafor",
    passengerEmail: "david.okafor@example.com",
    amount: 210000,
    currency: "NGN",
    paymentMethod: "bank-transfer",
    status: "pending",
    transactionReference: "TXN-SOG-100003",
    description: "Abuja to Dubai flight booking",
    paymentDate: "2026-09-26",
    createdAt: "2026-09-26",
    updatedAt: "2026-09-26",
  },
  {
    id: "payment-004",
    paymentId: "PAY-0004",
    bookingId: "SOG-BOOK-1004",
    passengerId: "PSG-0004",
    passengerName: "Amelia Johnson",
    passengerEmail: "amelia.johnson@example.com",
    amount: 2750,
    currency: "USD",
    paymentMethod: "card",
    status: "completed",
    transactionReference: "TXN-SOG-100004",
    description: "New York to Paris flight booking",
    paymentDate: "2026-09-21",
    createdAt: "2026-09-21",
    updatedAt: "2026-09-21",
  },
  {
    id: "payment-005",
    paymentId: "PAY-0005",
    bookingId: "SOG-BOOK-1005",
    passengerId: "PSG-0005",
    passengerName: "Michael Mensah",
    passengerEmail: "michael.mensah@example.com",
    amount: 180000,
    currency: "NGN",
    paymentMethod: "wallet",
    status: "refunded",
    transactionReference: "TXN-SOG-100005",
    description: "Accra to Lagos flight booking",
    paymentDate: "2026-09-18",
    createdAt: "2026-09-18",
    updatedAt: "2026-09-22",
  },
  {
    id: "payment-006",
    paymentId: "PAY-0006",
    bookingId: "SOG-BOOK-1006",
    passengerId: "PSG-0006",
    passengerName: "Grace Okoro",
    passengerEmail: "grace.okoro@example.com",
    amount: 395000,
    currency: "NGN",
    paymentMethod: "card",
    status: "completed",
    transactionReference: "TXN-SOG-100006",
    description: "Lagos to Johannesburg flight booking",
    paymentDate: "2026-09-20",
    createdAt: "2026-09-20",
    updatedAt: "2026-09-20",
  },
  {
    id: "payment-007",
    paymentId: "PAY-0007",
    bookingId: "SOG-BOOK-1007",
    passengerId: "PSG-0007",
    passengerName: "Daniel Brown",
    passengerEmail: "daniel.brown@example.com",
    amount: 1450,
    currency: "USD",
    paymentMethod: "card",
    status: "failed",
    transactionReference: "TXN-SOG-100007",
    description: "Toronto to London flight booking",
    paymentDate: "2026-09-25",
    createdAt: "2026-09-25",
    updatedAt: "2026-09-25",
  },
  {
    id: "payment-008",
    paymentId: "PAY-0008",
    bookingId: "SOG-BOOK-1008",
    passengerId: "PSG-0008",
    passengerName: "Sophia Martins",
    passengerEmail: "sophia.martins@example.com",
    amount: 1950,
    currency: "EUR",
    paymentMethod: "bank-transfer",
    status: "completed",
    transactionReference: "TXN-SOG-100008",
    description: "Lisbon to Lagos flight booking",
    paymentDate: "2026-09-19",
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
  },
];

export function getAdminPaymentById(
  id: string,
): AdminPayment | undefined {
  return adminPaymentData.find(
    (payment) =>
      payment.id === id || payment.paymentId === id,
  );
}

export function getAdminPaymentsByPassengerId(
  passengerId: string,
): AdminPayment[] {
  return adminPaymentData.filter(
    (payment) => payment.passengerId === passengerId,
  );
}

export function getAdminPaymentsByBookingId(
  bookingId: string,
): AdminPayment[] {
  return adminPaymentData.filter(
    (payment) => payment.bookingId === bookingId,
  );
}

export function formatPaymentAmount(
  amount: number,
  currency: PaymentCurrency,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}