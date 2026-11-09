import {
  isNonNegativeNumber,
  isRequired,
  isValidDate,
  isValidLength,
  
} from "@/lib/utils";

export interface FlightValidationResult {
  valid: boolean;
  message?: string;
}

export function validateFlightNumber(
  flightNumber: string,
): FlightValidationResult {
  const value = flightNumber.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Flight number is required.",
    };
  }

  if (!isValidLength(value, 2, 20)) {
    return {
      valid: false,
      message: "Flight number must be between 2 and 20 characters.",
    };
  }

  return { valid: true };
}

export function validateFlightCode(
  code: string,
): FlightValidationResult {
  const value = code.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Flight code is required.",
    };
  }

  if (!isValidLength(value, 2, 10)) {
    return {
      valid: false,
      message: "Flight code must be between 2 and 10 characters.",
    };
  }

  return { valid: true };
}

export function validateFlightDate(
  date: string | Date,
): FlightValidationResult {
  if (!isValidDate(date)) {
    return {
      valid: false,
      message: "Please provide a valid flight date.",
    };
  }

  return { valid: true };
}

export function validateFlightTime(
  time: string,
): FlightValidationResult {
  const value = time.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Flight time is required.",
    };
  }

  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timePattern.test(value)) {
    return {
      valid: false,
      message: "Flight time must use the HH:MM format.",
    };
  }

  return { valid: true };
}

export function validateFlightDuration(
  duration: number,
): FlightValidationResult {
  if (!isNonNegativeNumber(duration)) {
    return {
      valid: false,
      message: "Flight duration must be a valid non-negative number.",
    };
  }

  if (duration <= 0) {
    return {
      valid: false,
      message: "Flight duration must be greater than zero.",
    };
  }

  return { valid: true };
}

export function validateFlightCapacity(
  capacity: number,
): FlightValidationResult {
  if (!isNonNegativeNumber(capacity)) {
    return {
      valid: false,
      message: "Flight capacity must be a valid non-negative number.",
    };
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    return {
      valid: false,
      message: "Flight capacity must be a positive whole number.",
    };
  }

  return { valid: true };
}

export function validateFlightPrice(
  price: number,
): FlightValidationResult {
  if (!isNonNegativeNumber(price)) {
    return {
      valid: false,
      message: "Flight price must be a valid non-negative number.",
    };
  }

  if (price <= 0) {
    return {
      valid: false,
      message: "Flight price must be greater than zero.",
    };
  }

  return { valid: true };
}

export function validateFlightStatus(
  status: string,
): FlightValidationResult {
  const value = status.trim().toLowerCase();

  const validStatuses = [
    "scheduled",
    "boarding",
    "departed",
    "in-flight",
    "landed",
    "delayed",
    "cancelled",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Flight status is required.",
    };
  }

  if (!validStatuses.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid flight status.",
    };
  }

  return { valid: true };
}

export function validateAvailableSeats(
  availableSeats: number,
  capacity: number,
): FlightValidationResult {
  if (!isNonNegativeNumber(availableSeats)) {
    return {
      valid: false,
      message: "Available seats must be a valid non-negative number.",
    };
  }

  if (!Number.isInteger(availableSeats)) {
    return {
      valid: false,
      message: "Available seats must be a whole number.",
    };
  }

  if (availableSeats > capacity) {
    return {
      valid: false,
      message: "Available seats cannot exceed flight capacity.",
    };
  }

  return { valid: true };
}

export function validateFlightRoute(
  departureAirport: string,
  arrivalAirport: string,
): FlightValidationResult {
  const departure = departureAirport.trim();
  const arrival = arrivalAirport.trim();

  if (!isRequired(departure)) {
    return {
      valid: false,
      message: "Departure airport is required.",
    };
  }

  if (!isRequired(arrival)) {
    return {
      valid: false,
      message: "Arrival airport is required.",
    };
  }

  if (departure.toLowerCase() === arrival.toLowerCase()) {
    return {
      valid: false,
      message: "Departure and arrival airports must be different.",
    };
  }

  return { valid: true };
}

export interface FlightFormData {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string | Date;
  departureTime: string;
  duration: number;
  capacity: number;
  availableSeats: number;
  price: number;
  status: string;
}

export function validateFlightForm(
  data: FlightFormData,
): FlightValidationResult {
  const flightNumberResult = validateFlightNumber(data.flightNumber);

  if (!flightNumberResult.valid) {
    return flightNumberResult;
  }

  const routeResult = validateFlightRoute(
    data.departureAirport,
    data.arrivalAirport,
  );

  if (!routeResult.valid) {
    return routeResult;
  }

  const dateResult = validateFlightDate(data.departureDate);

  if (!dateResult.valid) {
    return dateResult;
  }

  const timeResult = validateFlightTime(data.departureTime);

  if (!timeResult.valid) {
    return timeResult;
  }

  const durationResult = validateFlightDuration(data.duration);

  if (!durationResult.valid) {
    return durationResult;
  }

  const capacityResult = validateFlightCapacity(data.capacity);

  if (!capacityResult.valid) {
    return capacityResult;
  }

  const availableSeatsResult = validateAvailableSeats(
    data.availableSeats,
    data.capacity,
  );

  if (!availableSeatsResult.valid) {
    return availableSeatsResult;
  }

  const priceResult = validateFlightPrice(data.price);

  if (!priceResult.valid) {
    return priceResult;
  }

  const statusResult = validateFlightStatus(data.status);

  if (!statusResult.valid) {
    return statusResult;
  }

  return { valid: true };
}