import type { Payment } from "@/types/payment";
import type { DemoPaymentOutcome } from "@/features/payment/types/paymentFeature";

import type { FundingRecord } from "@/features/payment/components/admin/FundingHistory";
import {
     getMockFundingHistory, 
     getMockPayments,
      MOCK_PAYMENT_BALANCE }
       from "./components/data";

export interface PaymentStoreSnapshot {
  balance: number;
  currency: string;
  payments: Payment[];
  fundingHistory: FundingRecord[];
  lastReplenishedAt: string | null;
}

type StoreListener = () => void;

function createInitialSnapshot(): PaymentStoreSnapshot {
  const payments = getMockPayments();
  const fundingHistory = getMockFundingHistory();

  return {
    balance: MOCK_PAYMENT_BALANCE.initialBalance,
    currency: MOCK_PAYMENT_BALANCE.currency,
    payments,
    fundingHistory,
    lastReplenishedAt:
      fundingHistory
        .filter(
          (record) =>
            record.type === "replenishment" &&
            record.status === "successful",
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )[0]?.createdAt ?? null,
  };
}

/**
 * Create an isolated store instance for a client-side provider.
 * This avoids a mutable module-level singleton being shared
 * across server-rendered requests.
 */
export function createPaymentStore() {
  let snapshot = createInitialSnapshot();
  const listeners = new Set<StoreListener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const getSnapshot = () => snapshot;

  const subscribe = (listener: StoreListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const updateSnapshot = (next: PaymentStoreSnapshot) => {
    snapshot = next;
    notify();
  };

  const replenish = (description = "Automatic demo balance replenishment") => {
    if (!MOCK_PAYMENT_BALANCE.automaticReplenishmentEnabled) {
      return { success: false as const, message: "Demo replenishment is disabled." };
    }

    const now = new Date().toISOString();
    const record: FundingRecord = {
      id: `fund_demo_${Date.now()}`,
      reference: `SOG-FUND-DEMO-${Date.now()}`,
      type: "replenishment",
      amount: MOCK_PAYMENT_BALANCE.replenishmentAmount,
      currency: snapshot.currency,
      description,
      createdAt: now,
      status: "successful",
    };

    updateSnapshot({
      ...snapshot,
      balance: snapshot.balance + record.amount,
      fundingHistory: [record, ...snapshot.fundingHistory],
      lastReplenishedAt: now,
    });

    return { success: true as const, record };
  };

  const ensureBalance = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false as const, message: "Enter a valid positive amount." };
    }

    if (snapshot.balance - amount < MOCK_PAYMENT_BALANCE.minimumBalance) {
      const result = replenish();

      if (!result.success) return result;
    }

    return { success: true as const };
  };

  const simulateBookingPayment = (input: {
    bookingId: string;
    userId: string;
    amount: number;
    outcome: DemoPaymentOutcome;
    currency?: string;
    methodType?: Payment["methodType"];
  }) => {
    if (!input.bookingId.trim() || !input.userId.trim()) {
      return { success: false as const, message: "Booking and user IDs are required." };
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      return { success: false as const, message: "Enter a valid booking amount." };
    }

    const existing = snapshot.payments.find(
      (payment) =>
        payment.bookingId === input.bookingId &&
        payment.status === "successful",
    );

    if (existing) {
      return {
        success: false as const,
        message: "This booking already has a successful demo payment.",
        payment: existing,
      };
    }

    const currency = input.currency ?? snapshot.currency;

    if (currency !== snapshot.currency) {
      return {
        success: false as const,
        message: "This demo balance only supports its configured currency.",
      };
    }

    if (input.outcome !== "approved") {
      const now = new Date().toISOString();
      const payment: Payment = {
        id: `pay_demo_${Date.now()}`,
        bookingId: input.bookingId,
        userId: input.userId,
        paymentReference: `SOG-DEMO-PAY-${Date.now()}`,
        methodType: input.methodType ?? "wallet",
        status: "failed",
        amount: input.amount,
        currency,
        failureReason:
          input.outcome === "declined"
            ? "Simulated payment declined."
            : "Simulated payment experienced a technical failure.",
        createdAt: now,
        updatedAt: now,
      };

      updateSnapshot({
        ...snapshot,
        payments: [payment, ...snapshot.payments],
      });

      return {
        success: false as const,
        outcome: input.outcome,
        message: payment.failureReason,
        payment,
      };
    }

    const balanceCheck = ensureBalance(input.amount);

    if (!balanceCheck.success) return balanceCheck;

    const now = new Date().toISOString();
    const reference = `SOG-PAY-DEMO-${Date.now()}`;

    const payment: Payment = {
      id: `pay_demo_${Date.now()}`,
      bookingId: input.bookingId,
      userId: input.userId,
      paymentReference: reference,
      methodType: input.methodType ?? "wallet",
      status: "successful",
      amount: input.amount,
      currency,
      paidAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const charge: FundingRecord = {
      id: `fund_demo_${Date.now()}_charge`,
      reference,
      type: "booking-charge",
      amount: input.amount,
      currency,
      description: `Demo charge for booking ${input.bookingId}`,
      createdAt: now,
      status: "successful",
    };

    updateSnapshot({
      ...snapshot,
      balance: snapshot.balance - input.amount,
      payments: [payment, ...snapshot.payments],
      fundingHistory: [charge, ...snapshot.fundingHistory],
    });

    return {
      success: true as const,
      outcome: input.outcome,
      payment,
      record: charge,
    };
  };

  const refundPayment = (paymentId: string, amount?: number) => {
    const payment = snapshot.payments.find((item) => item.id === paymentId);

    if (!payment || payment.status !== "successful" && payment.status !== "partially-refunded") {
      return { success: false as const, message: "Payment is not eligible for a demo refund." };
    }

    const alreadyRefunded = payment.refundAmount ?? 0;
    const remaining = payment.amount - alreadyRefunded;
    const refundAmount = amount ?? remaining;

    if (!Number.isFinite(refundAmount) || refundAmount <= 0 || refundAmount > remaining) {
      return { success: false as const, message: "Refund amount is invalid or exceeds the refundable balance." };
    }

    if (payment.currency !== snapshot.currency) {
      return { success: false as const, message: "This demo store cannot refund a different currency." };
    }

    const now = new Date().toISOString();
    const fullyRefunded = alreadyRefunded + refundAmount >= payment.amount;

    const updatedPayment: Payment = {
      ...payment,
      refundAmount: alreadyRefunded + refundAmount,
      refundedAt: now,
      status: fullyRefunded ? "refunded" : "partially-refunded",
      updatedAt: now,
    };

    const record: FundingRecord = {
      id: `fund_demo_${Date.now()}_refund`,
      reference: `SOG-REFUND-DEMO-${Date.now()}`,
      type: "refund",
      amount: refundAmount,
      currency: payment.currency,
      description: `Demo refund for booking ${payment.bookingId}`,
      createdAt: now,
      status: "successful",
    };

    updateSnapshot({
      ...snapshot,
      balance: snapshot.balance + refundAmount,
      payments: snapshot.payments.map((item) =>
        item.id === paymentId ? updatedPayment : item,
      ),
      fundingHistory: [record, ...snapshot.fundingHistory],
    });

    return { success: true as const, payment: updatedPayment, record };
  };

  return {
    getSnapshot,
    subscribe,
    replenish,
    simulateBookingPayment,
    refundPayment,
  };
}

export type PaymentStore = ReturnType<typeof createPaymentStore>;