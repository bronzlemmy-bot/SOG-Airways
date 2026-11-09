import {
  isNonNegativeNumber,
  isRequired,
  isValidDate,
  isValidEmail,
  isValidLength,
  isValidPhone,
} from "@/lib/utils";

export interface ManageBookingValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a booking reference / PNR.
 */
export function validateManageBookingReference(
  reference: string,
): ManageBookingValidationResult {
  const value = reference.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Booking reference is required.",
    };
  }

  if (!isValidLength(value, 5, 20)) {
    return {
      valid: false,
      message: "Booking reference must be between 5 and 20 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates the passenger's last name used to retrieve a booking.
 */
export function validateManageBookingLastName(
  lastName: string,
): ManageBookingValidationResult {
  const value = lastName.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Passenger last name is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Last name must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates an email address when it is supplied.
 */
export function validateManageBookingEmail(
  email?: string,
): ManageBookingValidationResult {
  const value = email?.trim() ?? "";

  if (!value) {
    return { valid: true };
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
 * Validates a phone number when it is supplied.
 */
export function validateManageBookingPhone(
  phone?: string,
): ManageBookingValidationResult {
  const value = phone?.trim() ?? "";

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

/**
 * Validates a passenger's first name.
 */
export function validateManageBookingFirstName(
  firstName: string,
): ManageBookingValidationResult {
  const value = firstName.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "First name is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "First name must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a passenger's last name.
 */
export function validateManageBookingPassengerLastName(
  lastName: string,
): ManageBookingValidationResult {
  const value = lastName.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Last name is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Last name must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a booking change date.
 */
export function validateManageBookingDate(
  date: string | Date,
): ManageBookingValidationResult {
  if (!isValidDate(date)) {
    return {
      valid: false,
      message: "Please provide a valid date.",
    };
  }

  return { valid: true };
}

/**
 * Validates the number of passengers involved in a booking.
 */
export function validateManageBookingPassengerCount(
  count: number,
): ManageBookingValidationResult {
  if (!isNonNegativeNumber(count)) {
    return {
      valid: false,
      message: "Passenger count must be a valid number.",
    };
  }

  if (!Number.isInteger(count) || count <= 0) {
    return {
      valid: false,
      message: "Passenger count must be a positive whole number.",
    };
  }

  return { valid: true };
}

/**
 * Validates a cancellation reason when supplied.
 */
export function validateCancellationReason(
  reason?: string,
): ManageBookingValidationResult {
  const value = reason?.trim() ?? "";

  if (!value) {
    return {
      valid: false,
      message: "Cancellation reason is required.",
    };
  }

  if (!isValidLength(value, 3, 500)) {
    return {
      valid: false,
      message: "Cancellation reason must be between 3 and 500 characters.",
    };
  }

  return { valid: true };
}

/**
 * Data used to retrieve a booking.
 */
export interface ManageBookingLookupData {
  bookingReference: string;
  lastName: string;
}

/**
 * Validates the Manage Booking lookup form.
 */
export function validateManageBookingLookup(
  data: ManageBookingLookupData,
): ManageBookingValidationResult {
  const referenceResult = validateManageBookingReference(
    data.bookingReference,
  );

  if (!referenceResult.valid) {
    return referenceResult;
  }

  return validateManageBookingLastName(data.lastName);
}

/**
 * Data used when updating passenger information.
 */
export interface ManageBookingPassengerData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

/**
 * Validates passenger information being updated.
 */
export function validateManageBookingPassenger(
  data: ManageBookingPassengerData,
): ManageBookingValidationResult {
  const firstNameResult = validateManageBookingFirstName(data.firstName);

  if (!firstNameResult.valid) {
    return firstNameResult;
  }

  const lastNameResult = validateManageBookingPassengerLastName(
    data.lastName,
  );

  if (!lastNameResult.valid) {
    return lastNameResult;
  }

  const emailResult = validateManageBookingEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  return validateManageBookingPhone(data.phone);
}

/**
 * Data used for cancelling a booking.
 */
export interface ManageBookingCancellationData {
  bookingReference: string;
  reason: string;
}

/**
 * Validates the cancellation form.
 */
export function validateManageBookingCancellation(
  data: ManageBookingCancellationData,
): ManageBookingValidationResult {
  const referenceResult = validateManageBookingReference(
    data.bookingReference,
  );

  if (!referenceResult.valid) {
    return referenceResult;
  }

  return validateCancellationReason(data.reason);
}