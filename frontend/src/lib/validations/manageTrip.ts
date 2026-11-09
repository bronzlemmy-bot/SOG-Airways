import {
  isNonNegativeNumber,
  isRequired,
  isValidDate,
  isValidLength,
} from "@/lib/utils";

export interface ManageTripValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a trip ID.
 */
export function validateTripId(
  tripId: string,
): ManageTripValidationResult {
  const value = tripId.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Trip ID is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Trip ID must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a trip title or name.
 */
export function validateTripName(
  name: string,
): ManageTripValidationResult {
  const value = name.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Trip name is required.",
    };
  }

  if (!isValidLength(value, 2, 150)) {
    return {
      valid: false,
      message: "Trip name must be between 2 and 150 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a departure or arrival location.
 */
export function validateTripLocation(
  location: string,
): ManageTripValidationResult {
  const value = location.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Location is required.",
    };
  }

  if (!isValidLength(value, 2, 150)) {
    return {
      valid: false,
      message: "Location must be between 2 and 150 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a trip date.
 */
export function validateTripDate(
  date: string | Date,
): ManageTripValidationResult {
  if (!isValidDate(date)) {
    return {
      valid: false,
      message: "Please provide a valid trip date.",
    };
  }

  return { valid: true };
}

/**
 * Validates the number of travellers on a trip.
 */
export function validateTripPassengerCount(
  count: number,
): ManageTripValidationResult {
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
 * Validates the trip status.
 */
export function validateTripStatus(
  status: string,
): ManageTripValidationResult {
  const value = status.trim().toLowerCase();

  const validStatuses = [
    "upcoming",
    "active",
    "completed",
    "cancelled",
    "pending",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Trip status is required.",
    };
  }

  if (!validStatuses.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid trip status.",
    };
  }

  return { valid: true };
}

/**
 * Validates a trip type.
 */
export function validateTripType(
  type: string,
): ManageTripValidationResult {
  const value = type.trim().toLowerCase();

  const validTypes = [
    "one-way",
    "round-trip",
    "multi-city",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Trip type is required.",
    };
  }

  if (!validTypes.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid trip type.",
    };
  }

  return { valid: true };
}

/**
 * Validates a trip reference.
 */
export function validateTripReference(
  reference: string,
): ManageTripValidationResult {
  const value = reference.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Trip reference is required.",
    };
  }

  if (!isValidLength(value, 4, 30)) {
    return {
      valid: false,
      message: "Trip reference must be between 4 and 30 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a trip note or description when supplied.
 */
export function validateTripNotes(
  notes?: string,
): ManageTripValidationResult {
  const value = notes?.trim() ?? "";

  if (!value) {
    return { valid: true };
  }

  if (!isValidLength(value, 3, 1000)) {
    return {
      valid: false,
      message: "Trip notes must be between 3 and 1000 characters.",
    };
  }

  return { valid: true };
}

/**
 * Data used by the Manage Trip form.
 */
export interface ManageTripFormData {
  tripId: string;
  tripName: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: string | Date;
  arrivalDate: string | Date;
  passengerCount: number;
  status: string;
  type: string;
  reference: string;
  notes?: string;
}

/**
 * Validates the complete Manage Trip form.
 */
export function validateManageTripForm(
  data: ManageTripFormData,
): ManageTripValidationResult {
  const tripIdResult = validateTripId(data.tripId);

  if (!tripIdResult.valid) {
    return tripIdResult;
  }

  const tripNameResult = validateTripName(data.tripName);

  if (!tripNameResult.valid) {
    return tripNameResult;
  }

  const departureResult = validateTripLocation(
    data.departureLocation,
  );

  if (!departureResult.valid) {
    return departureResult;
  }

  const arrivalResult = validateTripLocation(
    data.arrivalLocation,
  );

  if (!arrivalResult.valid) {
    return arrivalResult;
  }

  if (
    data.departureLocation.trim().toLowerCase() ===
    data.arrivalLocation.trim().toLowerCase()
  ) {
    return {
      valid: false,
      message: "Departure and arrival locations must be different.",
    };
  }

  const departureDateResult = validateTripDate(
    data.departureDate,
  );

  if (!departureDateResult.valid) {
    return departureDateResult;
  }

  const arrivalDateResult = validateTripDate(
    data.arrivalDate,
  );

  if (!arrivalDateResult.valid) {
    return arrivalDateResult;
  }

  const passengerCountResult = validateTripPassengerCount(
    data.passengerCount,
  );

  if (!passengerCountResult.valid) {
    return passengerCountResult;
  }

  const statusResult = validateTripStatus(data.status);

  if (!statusResult.valid) {
    return statusResult;
  }

  const typeResult = validateTripType(data.type);

  if (!typeResult.valid) {
    return typeResult;
  }

  const referenceResult = validateTripReference(data.reference);

  if (!referenceResult.valid) {
    return referenceResult;
  }

  return validateTripNotes(data.notes);
}