export type PaymentStatus =
  | "pending"
  | "processing"
  | "successful"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially-refunded";

export type PaymentMethodType =
  | "card"
  | "bank-transfer"
  | "mobile-money"
  | "wallet"
  | "other";

export type CardBrand =
  | "visa"
  | "mastercard"
  | "verve"
  | "amex"
  | "other";

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  cardBrand?: CardBrand;
  lastFourDigits?: string;
  cardholderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  paymentReference: string;
  methodId?: string;
  methodType: PaymentMethodType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionFee?: number;
  refundAmount?: number;
  paidAt?: string;
  refundedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}