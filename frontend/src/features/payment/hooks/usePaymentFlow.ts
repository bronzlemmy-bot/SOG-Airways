"use client";

import { useCallback, useState } from "react";

import type {
  DemoPaymentOutcome,
  DemoPaymentResult,
} from "@/features/payment/types/paymentFeature";

function createDemoPaymentReference(): string {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `SOG-DEMO-PAY-${suffix}`;
}

function getOutcomeMessage(outcome: DemoPaymentOutcome): string {
  switch (outcome) {
    case "approved":
      return "Simulated approval only. No money was charged or transferred.";
    case "declined":
      return "The simulated payment was declined. No successful payment or ticket was created.";
    case "error":
      return "The simulated payment encountered a technical failure. No successful payment or ticket was created.";
  }
}

export function usePaymentFlow() {
  const [result, setResult] =
    useState<DemoPaymentResult | null>(null);

  const simulatePayment = useCallback(
    (outcome: DemoPaymentOutcome): DemoPaymentResult => {
      const nextResult: DemoPaymentResult = {
        demoOnly: true,
        outcome,
        status: outcome === "approved" ? "successful" : "failed",
        paymentReference: createDemoPaymentReference(),
        message: getOutcomeMessage(outcome),
        processedAt: new Date().toISOString(),
      };

      setResult(nextResult);
      return nextResult;
    },
    [],
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    simulatePayment,
    clearResult,
  };
}