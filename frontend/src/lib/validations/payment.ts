import {
  isNonNegativeNumber,
  isRequired,
  isValidLength,
  isWithinRange,
} from "@/lib/utils";

export interface PaymentValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a cardholder name.
 */
export function validateCardholderName(
  name: string,
): PaymentValidationResult {
  const value = name.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Cardholder name is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Cardholder name must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a card number using the Luhn algorithm.
 */
export function validateCardNumber(
  cardNumber: string,
): PaymentValidationResult {
  const value = cardNumber.replace(/\s|-/g, "");

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Card number is required.",
    };
  }

  if (!/^\d+$/.test(value)) {
    return {
      valid: false,
      message: "Card number must contain only digits.",
    };
  }

  if (value.length < 12 || value.length > 19) {
    return {
      valid: false,
      message: "Card number must be between 12 and 19 digits.",
    };
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return {
      valid: false,
      message: "Please enter a valid card number.",
    };
  }

  return { valid: true };
}

/**
 * Validates card expiry month.
 */
export function validateCardExpiryMonth(
  month: number,
): PaymentValidationResult {
  if (!Number.isInteger(month)) {
    return {
      valid: false,
      message: "Expiry month must be a whole number.",
    };
  }

  if (!isWithinRange(month, 1, 12)) {
    return {
      valid: false,
      message: "Expiry month must be between 1 and 12.",
    };
  }

  return { valid: true };
}

/**
 * Validates card expiry year.
 */
export function validateCardExpiryYear(
  year: number,
): PaymentValidationResult {
  if (!Number.isInteger(year)) {
    return {
      valid: false,
      message: "Expiry year must be a whole number.",
    };
  }

  if (year < new Date().getFullYear()) {
    return {
      valid: false,
      message: "Card expiry year cannot be in the past.",
    };
  }

  return { valid: true };
}

/**
 * Validates a complete card expiry date.
 */
export function validateCardExpiry(
  month: number,
  year: number,
): PaymentValidationResult {
  const monthResult = validateCardExpiryMonth(month);

  if (!monthResult.valid) {
    return monthResult;
  }

  const yearResult = validateCardExpiryYear(year);

  if (!yearResult.valid) {
    return yearResult;
  }

  const currentDate = new Date();
  const expiryDate = new Date(year, month, 0);

  if (expiryDate < currentDate) {
    return {
      valid: false,
      message: "Card has expired.",
    };
  }

  return { valid: true };
}

/**
 * Validates a card CVV/CVC.
 */
export function validateCardCvv(
  cvv: string,
): PaymentValidationResult {
  const value = cvv.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Security code is required.",
    };
  }

  if (!/^\d{3,4}$/.test(value)) {
    return {
      valid: false,
      message: "Security code must contain 3 or 4 digits.",
    };
  }

  return { valid: true };
}

/**
 * Validates a billing address.
 */
export function validateBillingAddress(
  address: string,
): PaymentValidationResult {
  const value = address.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Billing address is required.",
    };
  }

  if (!isValidLength(value, 5, 250)) {
    return {
      valid: false,
      message: "Billing address must be between 5 and 250 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a postal/ZIP code.
 */
export function validatePaymentPostalCode(
  postalCode: string,
): PaymentValidationResult {
  const value = postalCode.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Postal code is required.",
    };
  }

  if (!isValidLength(value, 3, 20)) {
    return {
      valid: false,
      message: "Postal code must be between 3 and 20 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a payment amount.
 */
export function validatePaymentAmount(
  amount: number,
): PaymentValidationResult {
  if (!isNonNegativeNumber(amount)) {
    return {
      valid: false,
      message: "Payment amount must be a valid number.",
    };
  }

  if (amount <= 0) {
    return {
      valid: false,
      message: "Payment amount must be greater than zero.",
    };
  }

  return { valid: true };
}

/**
 * Validates a currency code.
 */
export function validatePaymentCurrency(
  currency: string,
): PaymentValidationResult {
  const value = currency.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Currency is required.",
    };
  }

  if (!/^[A-Z]{3}$/.test(value)) {
    return {
      valid: false,
      message: "Currency must be a valid three-letter currency code.",
    };
  }

  return { valid: true };
}

/**
 * Validates a payment status.
 */
export function validatePaymentStatus(
  status: string,
): PaymentValidationResult {
  const value = status.trim().toLowerCase();

  const validStatuses = [
    "pending",
    "processing",
    "completed",
    "failed",
    "cancelled",
    "refunded",
    "partially-refunded",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Payment status is required.",
    };
  }

  if (!validStatuses.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid payment status.",
    };
  }

  return { valid: true };
}

/**
 * Validates a payment method type.
 */
export function validatePaymentMethodType(
  type: string,
): PaymentValidationResult {
  const value = type.trim().toLowerCase();

  const validTypes = [
    "card",
    "bank-transfer",
    "mobile-money",
    "wallet",
    "cash",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Payment method type is required.",
    };
  }

  if (!validTypes.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid payment method.",
    };
  }

  return { valid: true };
}

export interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  billingAddress: string;
  postalCode: string;
  amount: number;
  currency: string;
}

/**
 * Validates the complete card payment form.
 */
export function validatePaymentForm(
  data: PaymentFormData,
): PaymentValidationResult {
  const nameResult = validateCardholderName(data.cardholderName);

  if (!nameResult.valid) {
    return nameResult;
  }

  const cardNumberResult = validateCardNumber(data.cardNumber);

  if (!cardNumberResult.valid) {
    return cardNumberResult;
  }

  const expiryResult = validateCardExpiry(
    data.expiryMonth,
    data.expiryYear,
  );

  if (!expiryResult.valid) {
    return expiryResult;
  }

  const cvvResult = validateCardCvv(data.cvv);

  if (!cvvResult.valid) {
    return cvvResult;
  }

  const addressResult = validateBillingAddress(
    data.billingAddress,
  );

  if (!addressResult.valid) {
    return addressResult;
  }

  const postalCodeResult = validatePaymentPostalCode(
    data.postalCode,
  );

  if (!postalCodeResult.valid) {
    return postalCodeResult;
  }

  const amountResult = validatePaymentAmount(data.amount);

  if (!amountResult.valid) {
    return amountResult;
  }

  return validatePaymentCurrency(data.currency);
}