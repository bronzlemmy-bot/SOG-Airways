import {
  isRequired,
  isValidEmail,
  isValidLength,
  isValidPhone,
} from "@/lib/utils";

export interface ContactValidationResult {
  valid: boolean;
  message?: string;
}

export function validateContactName(
  name: string,
): ContactValidationResult {
  const value = name.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Name is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Name must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

export function validateContactEmail(
  email: string,
): ContactValidationResult {
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

export function validateContactPhone(
  phone?: string,
): ContactValidationResult {
  const value = phone?.trim() ?? "";

  // Phone is optional for the contact form.
  if (!value) {
    return { valid: true };
  }

  if (!isValidPhone(value)) {
    return {
      valid: false,
      message: "Please enter a valid phone number.",
    };
  }

  return { valid: true };
}

export function validateContactSubject(
  subject: string,
): ContactValidationResult {
  const value = subject.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Subject is required.",
    };
  }

  if (!isValidLength(value, 3, 150)) {
    return {
      valid: false,
      message: "Subject must be between 3 and 150 characters.",
    };
  }

  return { valid: true };
}

export function validateContactMessage(
  message: string,
): ContactValidationResult {
  const value = message.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Message is required.",
    };
  }

  if (!isValidLength(value, 10, 2000)) {
    return {
      valid: false,
      message: "Message must be between 10 and 2000 characters.",
    };
  }

  return { valid: true };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function validateContactForm(
  data: ContactFormData,
): ContactValidationResult {
  const nameResult = validateContactName(data.name);

  if (!nameResult.valid) {
    return nameResult;
  }

  const emailResult = validateContactEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const phoneResult = validateContactPhone(data.phone);

  if (!phoneResult.valid) {
    return phoneResult;
  }

  const subjectResult = validateContactSubject(data.subject);

  if (!subjectResult.valid) {
    return subjectResult;
  }

  const messageResult = validateContactMessage(data.message);

  if (!messageResult.valid) {
    return messageResult;
  }

  return { valid: true };
}