import {
  isNonNegativeNumber,
  isRequired,
  isValidDate,
  isValidEmail,
  isValidLength,
  isValidPhone,
} from "@/lib/utils";

export interface PassengerValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a passenger's first name.
 */
export function validatePassengerFirstName(
  firstName: string,
): PassengerValidationResult {
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
export function validatePassengerLastName(
  lastName: string,
): PassengerValidationResult {
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
 * Validates a passenger's email address.
 */
export function validatePassengerEmail(
  email: string,
): PassengerValidationResult {
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
 * Validates a passenger's phone number.
 */
export function validatePassengerPhone(
  phone: string,
): PassengerValidationResult {
  const value = phone.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Phone number is required.",
    };
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
 * Validates a passenger date of birth.
 */
export function validatePassengerDateOfBirth(
  dateOfBirth: string | Date,
): PassengerValidationResult {
  if (!isValidDate(dateOfBirth)) {
    return {
      valid: false,
      message: "Please provide a valid date of birth.",
    };
  }

  const date = new Date(dateOfBirth);

  if (date >= new Date()) {
    return {
      valid: false,
      message: "Date of birth must be in the past.",
    };
  }

  return { valid: true };
}

/**
 * Validates a passport number when supplied.
 */
export function validatePassengerPassportNumber(
  passportNumber?: string,
): PassengerValidationResult {
  const value = passportNumber?.trim() ?? "";

  if (!value) {
    return { valid: true };
  }

  if (!isValidLength(value, 5, 30)) {
    return {
      valid: false,
      message: "Passport number must be between 5 and 30 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a passenger nationality.
 */
export function validatePassengerNationality(
  nationality: string,
): PassengerValidationResult {
  const value = nationality.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Nationality is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Nationality must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates passenger gender.
 */
export function validatePassengerGender(
  gender: string,
): PassengerValidationResult {
  const value = gender.trim().toLowerCase();

  const validGenders = [
    "male",
    "female",
    "other",
    "prefer-not-to-say",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Gender is required.",
    };
  }

  if (!validGenders.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid gender.",
    };
  }

  return { valid: true };
}

/**
 * Validates passenger type.
 */
export function validatePassengerType(
  passengerType: string,
): PassengerValidationResult {
  const value = passengerType.trim().toLowerCase();

  const validTypes = [
    "adult",
    "child",
    "infant",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Passenger type is required.",
    };
  }

  if (!validTypes.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid passenger type.",
    };
  }

  return { valid: true };
}

/**
 * Validates a passenger status.
 */
export function validatePassengerStatus(
  status: string,
): PassengerValidationResult {
  const value = status.trim().toLowerCase();

  const validStatuses = [
    "active",
    "inactive",
    "blocked",
    "pending",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Passenger status is required.",
    };
  }

  if (!validStatuses.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid passenger status.",
    };
  }

  return { valid: true };
}

/**
 * Validates the number of passengers.
 */
export function validatePassengerCount(
  count: number,
): PassengerValidationResult {
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

export interface PassengerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | Date;
  passportNumber?: string;
  nationality: string;
  gender: string;
  passengerType: string;
  status: string;
}

/**
 * Validates the complete passenger form.
 */
export function validatePassengerForm(
  data: PassengerFormData,
): PassengerValidationResult {
  const firstNameResult = validatePassengerFirstName(
    data.firstName,
  );

  if (!firstNameResult.valid) {
    return firstNameResult;
  }

  const lastNameResult = validatePassengerLastName(
    data.lastName,
  );

  if (!lastNameResult.valid) {
    return lastNameResult;
  }

  const emailResult = validatePassengerEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const phoneResult = validatePassengerPhone(data.phone);

  if (!phoneResult.valid) {
    return phoneResult;
  }

  const dateOfBirthResult = validatePassengerDateOfBirth(
    data.dateOfBirth,
  );

  if (!dateOfBirthResult.valid) {
    return dateOfBirthResult;
  }

  const passportResult = validatePassengerPassportNumber(
    data.passportNumber,
  );

  if (!passportResult.valid) {
    return passportResult;
  }

  const nationalityResult = validatePassengerNationality(
    data.nationality,
  );

  if (!nationalityResult.valid) {
    return nationalityResult;
  }

  const genderResult = validatePassengerGender(data.gender);

  if (!genderResult.valid) {
    return genderResult;
  }

  const passengerTypeResult = validatePassengerType(
    data.passengerType,
  );

  if (!passengerTypeResult.valid) {
    return passengerTypeResult;
  }

  return validatePassengerStatus(data.status);
}