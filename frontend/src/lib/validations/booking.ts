import {
  isRequired,
  isValidDate,
  isValidLength,
  isValidNumber,
  isWithinRange,
} from "@/lib/utils";

export interface BookingValidationResult {
  valid: boolean;
  message?: string;
}

export function validateBookingReference(
  reference: unknown,
): BookingValidationResult {
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

export function validateBookingType(
  type: unknown,
): BookingValidationResult {
  const validTypes = [
    "one-way",
    "round-trip",
    "multi-city",
  ];

  if (!isRequired(type)) {
    return {
      valid: false,
      message: "Booking type is required.",
    };
  }

  if (
    typeof type !== "string" ||
    !validTypes.includes(type)
  ) {
    return {
      valid: false,
      message: "Please select a valid booking type.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingStatus(
  status: unknown,
): BookingValidationResult {
  const validStatuses = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "refunded",
  ];

  if (!isRequired(status)) {
    return {
      valid: false,
      message: "Booking status is required.",
    };
  }

  if (
    typeof status !== "string" ||
    !validStatuses.includes(status)
  ) {
    return {
      valid: false,
      message: "Please select a valid booking status.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingClass(
  bookingClass: unknown,
): BookingValidationResult {
  const validClasses = [
    "economy",
    "premium-economy",
    "business",
    "first",
  ];

  if (!isRequired(bookingClass)) {
    return {
      valid: false,
      message: "Booking class is required.",
    };
  }

  if (
    typeof bookingClass !== "string" ||
    !validClasses.includes(bookingClass)
  ) {
    return {
      valid: false,
      message: "Please select a valid booking class.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingPassengerCount(
  count: unknown,
): BookingValidationResult {
  if (!isRequired(count)) {
    return {
      valid: false,
      message: "Passenger count is required.",
    };
  }

  if (!isValidNumber(count)) {
    return {
      valid: false,
      message: "Passenger count must be a valid number.",
    };
  }

  if (
    !isWithinRange(
      count,
      1,
      20,
    )
  ) {
    return {
      valid: false,
      message:
        "Passenger count must be between 1 and 20.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingAmount(
  amount: unknown,
): BookingValidationResult {
  if (!isRequired(amount)) {
    return {
      valid: false,
      message: "Booking amount is required.",
    };
  }

  if (!isValidNumber(amount)) {
    return {
      valid: false,
      message: "Booking amount must be a valid number.",
    };
  }

  if (Number(amount) < 0) {
    return {
      valid: false,
      message: "Booking amount cannot be negative.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingDate(
  date: unknown,
  fieldName = "Booking date",
): BookingValidationResult {
  if (!isRequired(date)) {
    return {
      valid: false,
      message: `${fieldName} is required.`,
    };
  }

  if (!isValidDate(date)) {
    return {
      valid: false,
      message: `${fieldName} must be a valid date.`,
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingPassenger(
  passenger: {
    passengerId: unknown;
    firstName: unknown;
    lastName: unknown;
    passengerType: unknown;
    seatNumber?: unknown;
    ticketNumber?: unknown;
  },
): BookingValidationResult {
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

  const passengerTypes = [
    "adult",
    "child",
    "infant",
  ];

  if (
    !isRequired(passenger.passengerType) ||
    typeof passenger.passengerType !== "string" ||
    !passengerTypes.includes(
      passenger.passengerType,
    )
  ) {
    return {
      valid: false,
      message: "Please select a valid passenger type.",
    };
  }

  return {
    valid: true,
  };
}

export function validateBookingFlight(
  flight: {
    flightId: unknown;
    flightNumber: unknown;
    departureAirport: unknown;
    arrivalAirport: unknown;
    departureDate: unknown;
    departureTime: unknown;
    arrivalDate: unknown;
    arrivalTime: unknown;
    cabinClass: unknown;
  },
): BookingValidationResult {
  if (!isRequired(flight.flightId)) {
    return {
      valid: false,
      message: "Flight ID is required.",
    };
  }

  if (!isRequired(flight.flightNumber)) {
    return {
      valid: false,
      message: "Flight number is required.",
    };
  }

  if (!isRequired(flight.departureAirport)) {
    return {
      valid: false,
      message: "Departure airport is required.",
    };
  }

  if (!isRequired(flight.arrivalAirport)) {
    return {
      valid: false,
      message: "Arrival airport is required.",
    };
  }

  const departureDateResult =
    validateBookingDate(
      flight.departureDate,
      "Departure date",
    );

  if (!departureDateResult.valid) {
    return departureDateResult;
  }

  const arrivalDateResult =
    validateBookingDate(
      flight.arrivalDate,
      "Arrival date",
    );

  if (!arrivalDateResult.valid) {
    return arrivalDateResult;
  }

  if (!isRequired(flight.departureTime)) {
    return {
      valid: false,
      message: "Departure time is required.",
    };
  }

  if (!isRequired(flight.arrivalTime)) {
    return {
      valid: false,
      message: "Arrival time is required.",
    };
  }

  return validateBookingClass(
    flight.cabinClass,
  );
}

export function validateBookingForm(
  booking: {
    bookingReference: unknown;
    userId: unknown;
    type: unknown;
    status: unknown;
    flights: unknown;
    passengers: unknown;
    totalPassengers: unknown;
    currency: unknown;
    subtotal: unknown;
    taxes: unknown;
    fees: unknown;
    totalAmount: unknown;
    bookedAt: unknown;
  },
): BookingValidationResult {
  const referenceResult =
    validateBookingReference(
      booking.bookingReference,
    );

  if (!referenceResult.valid) {
    return referenceResult;
  }

  if (!isRequired(booking.userId)) {
    return {
      valid: false,
      message: "User ID is required.",
    };
  }

  const typeResult =
    validateBookingType(
      booking.type,
    );

  if (!typeResult.valid) {
    return typeResult;
  }

  const statusResult =
    validateBookingStatus(
      booking.status,
    );

  if (!statusResult.valid) {
    return statusResult;
  }

  if (
    !Array.isArray(booking.flights) ||
    booking.flights.length === 0
  ) {
    return {
      valid: false,
      message: "At least one flight is required.",
    };
  }

  if (
    !Array.isArray(booking.passengers) ||
    booking.passengers.length === 0
  ) {
    return {
      valid: false,
      message: "At least one passenger is required.",
    };
  }

  const passengerCountResult =
    validateBookingPassengerCount(
      booking.totalPassengers,
    );

  if (!passengerCountResult.valid) {
    return passengerCountResult;
  }

  if (!isRequired(booking.currency)) {
    return {
      valid: false,
      message: "Currency is required.",
    };
  }

  const subtotalResult =
    validateBookingAmount(
      booking.subtotal,
    );

  if (!subtotalResult.valid) {
    return subtotalResult;
  }

  const taxesResult =
    validateBookingAmount(
      booking.taxes,
    );

  if (!taxesResult.valid) {
    return taxesResult;
  }

  const feesResult =
    validateBookingAmount(
      booking.fees,
    );

  if (!feesResult.valid) {
    return feesResult;
  }

  const totalResult =
    validateBookingAmount(
      booking.totalAmount,
    );

  if (!totalResult.valid) {
    return totalResult;
  }

  return validateBookingDate(
    booking.bookedAt,
    "Booking date",
  );
}