export type DemoPaymentOutcome =
  | "approved"
  | "declined"
  | "error";

export interface DemoPaymentResult {
  demoOnly: true;
  outcome: DemoPaymentOutcome;
  status: "successful" | "failed";
  paymentReference: string;
  message: string;
  processedAt: string;
}