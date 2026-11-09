import {
  isRequired,
  isValidDate,
  isValidLength,
  isValidNumber,
  isWithinRange,
} from "@/lib/utils";

export interface CheckInValidationResult {
  valid: boolean;
  message?: string;
}

const CHECK_IN_STATUSES = [
  "not-checked-in",
  "in-progress",
  "checked-in",
  "cancelled",
] as const;

const BOARDING_STATUSES = [
  "not-boarded",
  "boarding",
  "boarded",
  "missed",
] as const;

const SEAT_CLASSES = [
  "economy",
  "premium-economy",
  "business",
  "first",
] as const;

export function validateCheckInStatus(
  status: unknown,
): CheckInValidationResult {
  if (!isRequired(status)) {
    return {
      valid: false,
      message: "Check-in status is required.",
    };
  }

  if (
    typeof status !== "string" ||
    !CHECK_IN_STATUSES.includes(
      status as (typeof CHECK_IN_STATUSES)[number],
    )
  ) {
    return {
      valid: false,
      message: "Please select a valid check-in status.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBoardingStatus(
  status: unknown,
): CheckInValidationResult {
  if (!isRequired(status)) {
    return {
      valid: false,
      message: "Boarding status is required.",
    };
  }

  if (
    typeof status !== "string" ||
    !BOARDING_STATUSES.includes(
      status as (typeof BOARDING_STATUSES)[number],
    )
  ) {
    return {
      valid: false,
      message: "Please select a valid boarding status.",
    };
  }

  return {
    valid: true,
  };
}

/**
 * Validates a booking reference specifically for check-in.
 *
 * Named differently from validateBookingReference in booking.ts
 * to avoid duplicate exports from validations/index.ts.
 */
export function validateCheckInBookingReference(
  reference: unknown,
): CheckInValidationResult {
  if (!isRequired(reference)) {
    return {
      valid: false,
      message: "Booking reference is required.",
    };
  }

  if (!isValidLength(reference, 3, 30)) {
    return {
      valid: false,
      message:
        "Booking reference must be between 3 and 30 characters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateCheckInPassenger(
  passenger: {
    passengerId: unknown;
    firstName: unknown;
    lastName: unknown;
    seatNumber?: unknown;
    seatClass: unknown;
    checkedIn: unknown;
    boardingPassIssued: unknown;
  },
): CheckInValidationResult {
  if (!isRequired(passenger.passengerId)) {
    return {
      valid: false,
      message: "Passenger ID is required.",
    };
  }

  if (!isRequired(passenger.firstName)) {
    return {
      valid: false,
      message: "Passenger first name is required.",
    };
  }

  if (!isValidLength(passenger.firstName, 2, 100)) {
    return {
      valid: false,
      message:
        "Passenger first name must be between 2 and 100 characters.",
    };
  }

  if (!isRequired(passenger.lastName)) {
    return {
      valid: false,
      message: "Passenger last name is required.",
    };
  }

  if (!isValidLength(passenger.lastName, 2, 100)) {
    return {
      valid: false,
      message:
        "Passenger last name must be between 2 and 100 characters.",
    };
  }

  if (!isRequired(passenger.seatClass)) {
    return {
      valid: false,
      message: "Seat class is required.",
    };
  }

  if (
    typeof passenger.seatClass !== "string" ||
    !SEAT_CLASSES.includes(
      passenger.seatClass as (typeof SEAT_CLASSES)[number],
    )
  ) {
    return {
      valid: false,
      message: "Please select a valid seat class.",
    };
  }

  if (
    passenger.checkedIn !== true &&
    passenger.checkedIn !== false
  ) {
    return {
      valid: false,
      message: "Check-in status must be true or false.",
    };
  }

  if (
    passenger.boardingPassIssued !== true &&
    passenger.boardingPassIssued !== false
  ) {
    return {
      valid: false,
      message:
        "Boarding pass status must be true or false.",
    };
  }

  if (
    passenger.seatNumber !== undefined &&
    passenger.seatNumber !== null &&
    passenger.seatNumber !== ""
  ) {
    if (
      typeof passenger.seatNumber !== "string" ||
      !isValidLength(
        passenger.seatNumber,
        1,
        10,
      )
    ) {
      return {
        valid: false,
        message: "Please enter a valid seat number.",
      };
    }
  }

  return {
    valid: true,
  };
}

export function validateCheckInTime(
  value: unknown,
): CheckInValidationResult {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return {
      valid: true,
    };
  }

  if (!isValidDate(value)) {
    return {
      valid: false,
      message: "Check-in time must be a valid date and time.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBaggageCount(
  count: unknown,
): CheckInValidationResult {
  if (
    count === undefined ||
    count === null
  ) {
    return {
      valid: true,
    };
  }

  if (!isValidNumber(count)) {
    return {
      valid: false,
      message: "Baggage count must be a valid number.",
    };
  }

  if (!isWithinRange(count, 0, 20)) {
    return {
      valid: false,
      message:
        "Baggage count must be between 0 and 20.",
    };
  }

  return {
    valid: true,
  };
}

export function validateCheckInForm(
  checkIn: {
    bookingId: unknown;
    bookingReference: unknown;
    flightId: unknown;
    flightNumber: unknown;
    userId: unknown;
    passengers: unknown;
    status: unknown;
    boardingStatus: unknown;
    checkInTime?: unknown;
    baggageCount?: unknown;
  },
): CheckInValidationResult {
  if (!isRequired(checkIn.bookingId)) {
    return {
      valid: false,
      message: "Booking ID is required.",
    };
  }

  const bookingReferenceResult =
    validateCheckInBookingReference(
      checkIn.bookingReference,
    );

  if (!bookingReferenceResult.valid) {
    return bookingReferenceResult;
  }

  if (!isRequired(checkIn.flightId)) {
    return {
      valid: false,
      message: "Flight ID is required.",
    };
  }

  if (!isRequired(checkIn.flightNumber)) {
    return {
      valid: false,
      message: "Flight number is required.",
    };
  }

  if (!isRequired(checkIn.userId)) {
    return {
      valid: false,
      message: "User ID is required.",
    };
  }

  if (
    !Array.isArray(checkIn.passengers) ||
    checkIn.passengers.length === 0
  ) {
    return {
      valid: false,
      message:
        "At least one passenger is required for check-in.",
    };
  }

  const statusResult =
    validateCheckInStatus(
      checkIn.status,
    );

  if (!statusResult.valid) {
    return statusResult;
  }

  const boardingResult =
    validateBoardingStatus(
      checkIn.boardingStatus,
    );

  if (!boardingResult.valid) {
    return boardingResult;
  }

  const timeResult =
    validateCheckInTime(
      checkIn.checkInTime,
    );

  if (!timeResult.valid) {
    return timeResult;
  }

  return validateBaggageCount(
    checkIn.baggageCount,
  );
}

export function validateSeatNumber(
  seatNumber: unknown,
): CheckInValidationResult {
  if (!isRequired(seatNumber)) {
    return {
      valid: false,
      message: "Seat number is required.",
    };
  }

  if (
    typeof seatNumber !== "string" ||
    !/^[0-9]{1,3}[A-Za-z]$/.test(
      seatNumber.trim(),
    )
  ) {
    return {
      valid: false,
      message:
        "Please enter a valid seat number, such as 12A.",
    };
  }

  return {
    valid: true,
  };
}