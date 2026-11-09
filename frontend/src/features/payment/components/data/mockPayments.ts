import type { Payment } from "@/types/payment";

/**
 * SOG Airways demo payment records.
 *
 * Frontend development only:
 * - No real money is processed.
 * - No browser storage is used.
 * - Records reset when the application reloads.
 * - Replace this mock data with API responses when the backend is ready.
 */

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay_demo_001",
    bookingId: "SOG-BK-10001",
    userId: "user_demo_001",
    paymentReference: "SOG-PAY-DEMO-10001",
    methodId: "method_demo_001",
    methodType: "card",
    status: "successful",
    amount: 285000,
    currency: "NGN",
    transactionFee: 2500,
    paidAt: "2026-10-12T09:30:00.000Z",
    createdAt: "2026-10-12T09:28:00.000Z",
    updatedAt: "2026-10-12T09:30:00.000Z",
  },
  {
    id: "pay_demo_002",
    bookingId: "SOG-BK-10002",
    userId: "user_demo_002",
    paymentReference: "SOG-PAY-DEMO-10002",
    methodId: "method_demo_002",
    methodType: "bank-transfer",
    status: "successful",
    amount: 410000,
    currency: "NGN",
    transactionFee: 0,
    paidAt: "2026-10-12T11:15:00.000Z",
    createdAt: "2026-10-12T11:10:00.000Z",
    updatedAt: "2026-10-12T11:15:00.000Z",
  },
  {
    id: "pay_demo_003",
    bookingId: "SOG-BK-10003",
    userId: "user_demo_003",
    paymentReference: "SOG-PAY-DEMO-10003",
    methodType: "wallet",
    status: "pending",
    amount: 175000,
    currency: "NGN",
    createdAt: "2026-10-13T08:20:00.000Z",
    updatedAt: "2026-10-13T08:20:00.000Z",
  },
  {
    id: "pay_demo_004",
    bookingId: "SOG-BK-10004",
    userId: "user_demo_004",
    paymentReference: "SOG-PAY-DEMO-10004",
    methodId: "method_demo_004",
    methodType: "card",
    status: "failed",
    amount: 320000,
    currency: "NGN",
    failureReason: "Demo payment validation was unsuccessful.",
    createdAt: "2026-10-13T10:45:00.000Z",
    updatedAt: "2026-10-13T10:46:00.000Z",
  },
  {
    id: "pay_demo_005",
    bookingId: "SOG-BK-10005",
    userId: "user_demo_005",
    paymentReference: "SOG-PAY-DEMO-10005",
    methodId: "method_demo_005",
    methodType: "card",
    status: "partially-refunded",
    amount: 500000,
    currency: "NGN",
    transactionFee: 3500,
    refundAmount: 100000,
    paidAt: "2026-10-10T13:00:00.000Z",
    refundedAt: "2026-10-13T14:30:00.000Z",
    createdAt: "2026-10-10T12:55:00.000Z",
    updatedAt: "2026-10-13T14:30:00.000Z",
  },
  {
    id: "pay_demo_006",
    bookingId: "SOG-BK-10006",
    userId: "user_demo_006",
    paymentReference: "SOG-PAY-DEMO-10006",
    methodType: "mobile-money",
    status: "processing",
    amount: 95000,
    currency: "NGN",
    createdAt: "2026-10-14T07:00:00.000Z",
    updatedAt: "2026-10-14T07:00:00.000Z",
  },
  {
    id: "pay_demo_007",
    bookingId: "SOG-BK-10007",
    userId: "user_demo_007",
    paymentReference: "SOG-PAY-DEMO-10007",
    methodType: "card",
    status: "refunded",
    amount: 220000,
    currency: "NGN",
    transactionFee: 1500,
    refundAmount: 220000,
    paidAt: "2026-10-09T15:00:00.000Z",
    refundedAt: "2026-10-11T12:00:00.000Z",
    createdAt: "2026-10-09T14:55:00.000Z",
    updatedAt: "2026-10-11T12:00:00.000Z",
  },
];

/**
 * Return a fresh array so callers cannot accidentally change
 * the exported seed array by sorting or filtering it in place.
 *
 * Individual payment records should also be copied before
 * mutating them in a demo workflow.
 */
export function getMockPayments(): Payment[] {
  return MOCK_PAYMENTS.map((payment) => ({ ...payment }));
}