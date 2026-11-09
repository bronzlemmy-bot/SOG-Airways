export type PaymentGatewayMode = "demo" | "disabled";

export interface InitiatePaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentRequest {
  paymentReference: string;
  providerTransactionId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentGatewayResponse {
  success: boolean;
  provider: PaymentGatewayMode;
  status:
    | "pending"
    | "completed"
    | "failed"
    | "demo_pending"
    | "demo_completed"
    | "disabled";
  transactionId: string;
  reference: string;
  amount: number;
  currency: string;
  message: string;
  providerTransactionId?: string;
  rawResponse?: Record<string, unknown>;
  requiresAction?: boolean;
}

export interface PaymentGatewayProvider {
  readonly mode: PaymentGatewayMode;
  initiatePayment(
    input: InitiatePaymentRequest,
  ): Promise<PaymentGatewayResponse>;
  verifyPayment(
    input: VerifyPaymentRequest,
  ): Promise<PaymentGatewayResponse>;
}

function createDemoTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();

  return `SOG-DEMO-${timestamp}-${randomPart}`;
}

export class DemoPaymentGatewayProvider implements PaymentGatewayProvider {
  readonly mode: PaymentGatewayMode = "demo";

  async initiatePayment(
    input: InitiatePaymentRequest,
  ): Promise<PaymentGatewayResponse> {
    const transactionId = createDemoTransactionId();

    return {
      success: true,
      provider: "demo",
      status: "demo_pending",
      transactionId,
      reference: input.reference,
      amount: input.amount,
      currency: input.currency,
      message:
        "Demo payment authorized. No real card was charged and no real funds were transferred.",
      providerTransactionId: transactionId,
      rawResponse: {
        demoMode: true,
        customerId: input.customerId ?? null,
        reference: input.reference,
      },
      requiresAction: false,
    };
  }

  async verifyPayment(
    input: VerifyPaymentRequest,
  ): Promise<PaymentGatewayResponse> {
    const transactionId =
      input.providerTransactionId ?? createDemoTransactionId();

    return {
      success: true,
      provider: "demo",
      status: "demo_completed",
      transactionId,
      reference: input.paymentReference,
      amount: 0,
      currency: "USD",
      message:
        "Demo payment verification succeeded. No real payment was processed.",
      providerTransactionId: transactionId,
      rawResponse: {
        demoMode: true,
        paymentReference: input.paymentReference,
      },
      requiresAction: false,
    };
  }
}

export const paymentGatewayProvider: PaymentGatewayProvider =
  new DemoPaymentGatewayProvider();

export default paymentGatewayProvider;
