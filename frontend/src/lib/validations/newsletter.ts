import {
  isRequired,
  isValidEmail,
  isValidLength,
} from "@/lib/utils";

export interface NewsletterValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a newsletter subscriber's email address.
 */
export function validateNewsletterEmail(
  email: string,
): NewsletterValidationResult {
  const value = email.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Email address is required.",
    };
  }

  if (!isValidEmail(value)) {
    return {
      valid: false,
      message: "Please enter a valid email address.",
    };
  }

  return { valid: true };
}

/**
 * Validates a subscriber's name when supplied.
 */
export function validateNewsletterName(
  name?: string,
): NewsletterValidationResult {
  const value = name?.trim() ?? "";

  // Name is optional for a simple newsletter subscription.
  if (!value) {
    return { valid: true };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Name must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates newsletter consent.
 */
export function validateNewsletterConsent(
  consent: boolean,
): NewsletterValidationResult {
  if (!consent) {
    return {
      valid: false,
      message: "You must agree to receive newsletter updates.",
    };
  }

  return { valid: true };
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  consent: boolean;
}

/**
 * Validates the complete newsletter subscription form.
 */
export function validateNewsletterForm(
  data: NewsletterFormData,
): NewsletterValidationResult {
  const emailResult = validateNewsletterEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const nameResult = validateNewsletterName(data.name);

  if (!nameResult.valid) {
    return nameResult;
  }

  return validateNewsletterConsent(data.consent);
}