import {
  isRequired,
  isValidEmail,
  isValidLength,
} from "@/lib/utils";

export interface SupportValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a support ticket subject.
 */
export function validateSupportSubject(
  subject: string,
): SupportValidationResult {
  const value = subject.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Support subject is required.",
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

/**
 * Validates a support message.
 */
export function validateSupportMessage(
  message: string,
): SupportValidationResult {
  const value = message.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Support message is required.",
    };
  }

  if (!isValidLength(value, 10, 5000)) {
    return {
      valid: false,
      message: "Message must be between 10 and 5000 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a support ticket category.
 */
export function validateSupportCategory(
  category: string,
): SupportValidationResult {
  const value = category.trim().toLowerCase();

  const validCategories = [
    "booking",
    "flight",
    "payment",
    "check-in",
    "baggage",
    "manage-booking",
    "technical",
    "general",
    "other",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Support category is required.",
    };
  }

  if (!validCategories.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid support category.",
    };
  }

  return { valid: true };
}

/**
 * Validates ticket priority.
 */
export function validateSupportPriority(
  priority: string,
): SupportValidationResult {
  const value = priority.trim().toLowerCase();

  const validPriorities = [
    "low",
    "medium",
    "high",
    "urgent",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Ticket priority is required.",
    };
  }

  if (!validPriorities.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid ticket priority.",
    };
  }

  return { valid: true };
}

/**
 * Validates a support ticket status.
 */
export function validateSupportTicketStatus(
  status: string,
): SupportValidationResult {
  const value = status.trim().toLowerCase();

  const validStatuses = [
    "open",
    "pending",
    "in-progress",
    "resolved",
    "closed",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Ticket status is required.",
    };
  }

  if (!validStatuses.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid ticket status.",
    };
  }

  return { valid: true };
}

/**
 * Validates a support ticket reference.
 */
export function validateSupportTicketReference(
  reference: string,
): SupportValidationResult {
  const value = reference.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Ticket reference is required.",
    };
  }

  if (!isValidLength(value, 4, 50)) {
    return {
      valid: false,
      message: "Ticket reference must be between 4 and 50 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates the support customer's name.
 */
export function validateSupportName(
  name: string,
): SupportValidationResult {
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

/**
 * Validates the support customer's email.
 */
export function validateSupportEmail(
  email: string,
): SupportValidationResult {
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

export interface SupportTicketFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  priority: string;
}

/**
 * Validates the complete support ticket form.
 */
export function validateSupportTicketForm(
  data: SupportTicketFormData,
): SupportValidationResult {
  const nameResult = validateSupportName(data.name);

  if (!nameResult.valid) {
    return nameResult;
  }

  const emailResult = validateSupportEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const categoryResult = validateSupportCategory(data.category);

  if (!categoryResult.valid) {
    return categoryResult;
  }

  const subjectResult = validateSupportSubject(data.subject);

  if (!subjectResult.valid) {
    return subjectResult;
  }

  const messageResult = validateSupportMessage(data.message);

  if (!messageResult.valid) {
    return messageResult;
  }

  return validateSupportPriority(data.priority);
}

/**
 * Validates a reply/message sent to an existing support ticket.
 */
export function validateSupportReply(
  message: string,
): SupportValidationResult {
  return validateSupportMessage(message);
}