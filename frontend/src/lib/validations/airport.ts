import {
  isRequired,
  isValidEmail,
  isValidLength,
  isValidNumber,
  isWithinRange,
} from "@/lib/utils";

export interface AirportValidationResult {
  valid: boolean;
  message?: string;
}

export function validateAirportName(
  name: unknown,
): AirportValidationResult {
  if (!isRequired(name)) {
    return {
      valid: false,
      message: "Airport name is required.",
    };
  }

  if (!isValidLength(name, 2, 150)) {
    return {
      valid: false,
      message:
        "Airport name must be between 2 and 150 characters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateAirportCode(
  code: unknown,
): AirportValidationResult {
  if (!isRequired(code)) {
    return {
      valid: false,
      message: "Airport code is required.",
    };
  }

  if (!isValidLength(code, 3, 3)) {
    return {
      valid: false,
      message:
        "Airport code must contain exactly 3 characters.",
    };
  }

  if (
    typeof code !== "string" ||
    !/^[A-Za-z]{3}$/.test(code.trim())
  ) {
    return {
      valid: false,
      message:
        "Airport code must contain only letters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateIataCode(
  code: unknown,
): AirportValidationResult {
  return validateAirportCode(code);
}

export function validateIcaoCode(
  code: unknown,
): AirportValidationResult {
  if (!isRequired(code)) {
    return {
      valid: false,
      message: "ICAO code is required.",
    };
  }

  if (!isValidLength(code, 4, 4)) {
    return {
      valid: false,
      message:
        "ICAO code must contain exactly 4 characters.",
    };
  }

  if (
    typeof code !== "string" ||
    !/^[A-Za-z]{4}$/.test(code.trim())
  ) {
    return {
      valid: false,
      message:
        "ICAO code must contain only letters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateCity(
  city: unknown,
): AirportValidationResult {
  if (!isRequired(city)) {
    return {
      valid: false,
      message: "City is required.",
    };
  }

  if (!isValidLength(city, 2, 100)) {
    return {
      valid: false,
      message:
        "City must be between 2 and 100 characters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateCountry(
  country: unknown,
): AirportValidationResult {
  if (!isRequired(country)) {
    return {
      valid: false,
      message: "Country is required.",
    };
  }

  if (!isValidLength(country, 2, 100)) {
    return {
      valid: false,
      message:
        "Country must be between 2 and 100 characters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateCountryCode(
  countryCode: unknown,
): AirportValidationResult {
  if (!isRequired(countryCode)) {
    return {
      valid: false,
      message: "Country code is required.",
    };
  }

  if (
    typeof countryCode !== "string" ||
    !/^[A-Za-z]{2}$/.test(
      countryCode.trim(),
    )
  ) {
    return {
      valid: false,
      message:
        "Country code must contain exactly 2 letters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateTimezone(
  timezone: unknown,
): AirportValidationResult {
  if (!isRequired(timezone)) {
    return {
      valid: false,
      message: "Timezone is required.",
    };
  }

  if (!isValidLength(timezone, 2, 100)) {
    return {
      valid: false,
      message:
        "Timezone must be between 2 and 100 characters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateTerminalCount(
  terminalCount: unknown,
): AirportValidationResult {
  if (terminalCount === undefined || terminalCount === null) {
    return {
      valid: true,
    };
  }

  if (!isValidNumber(terminalCount)) {
    return {
      valid: false,
      message: "Terminal count must be a valid number.",
    };
  }

  if (
    !isWithinRange(
      terminalCount,
      1,
      100,
    )
  ) {
    return {
      valid: false,
      message:
        "Terminal count must be between 1 and 100.",
    };
  }

  return {
    valid: true,
  };
}

export function validateLatitude(
  latitude: unknown,
): AirportValidationResult {
  if (latitude === undefined || latitude === null) {
    return {
      valid: true,
    };
  }

  if (!isValidNumber(latitude)) {
    return {
      valid: false,
      message: "Latitude must be a valid number.",
    };
  }

  if (
    !isWithinRange(
      latitude,
      -90,
      90,
    )
  ) {
    return {
      valid: false,
      message:
        "Latitude must be between -90 and 90.",
    };
  }

  return {
    valid: true,
  };
}

export function validateLongitude(
  longitude: unknown,
): AirportValidationResult {
  if (longitude === undefined || longitude === null) {
    return {
      valid: true,
    };
  }

  if (!isValidNumber(longitude)) {
    return {
      valid: false,
      message: "Longitude must be a valid number.",
    };
  }

  if (
    !isWithinRange(
      longitude,
      -180,
      180,
    )
  ) {
    return {
      valid: false,
      message:
        "Longitude must be between -180 and 180.",
    };
  }

  return {
    valid: true,
  };
}

export function validateAirportEmail(
  email: unknown,
): AirportValidationResult {
  if (
    email === undefined ||
    email === null ||
    email === ""
  ) {
    return {
      valid: true,
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      message:
        "Please enter a valid airport email address.",
    };
  }

  return {
    valid: true,
  };
}

export function validateAirportAddress(
  address: unknown,
): AirportValidationResult {
  if (
    address === undefined ||
    address === null ||
    address === ""
  ) {
    return {
      valid: true,
    };
  }

  if (!isValidLength(address, 3, 250)) {
    return {
      valid: false,
      message:
        "Address must be between 3 and 250 characters.",
    };
  }

  return {
    valid: true,
  };
}

export function validateAirportForm(
  airport: {
    name: unknown;
    iataCode: unknown;
    icaoCode?: unknown;
    city: unknown;
    country: unknown;
    countryCode: unknown;
    timezone: unknown;
    terminalCount?: unknown;
    latitude?: unknown;
    longitude?: unknown;
    email?: unknown;
    address?: unknown;
  },
): AirportValidationResult {
  const nameResult =
    validateAirportName(airport.name);

  if (!nameResult.valid) {
    return nameResult;
  }

  const iataResult =
    validateIataCode(
      airport.iataCode,
    );

  if (!iataResult.valid) {
    return iataResult;
  }

  if (
    airport.icaoCode !== undefined &&
    airport.icaoCode !== null &&
    airport.icaoCode !== ""
  ) {
    const icaoResult =
      validateIcaoCode(
        airport.icaoCode,
      );

    if (!icaoResult.valid) {
      return icaoResult;
    }
  }

  const cityResult =
    validateCity(airport.city);

  if (!cityResult.valid) {
    return cityResult;
  }

  const countryResult =
    validateCountry(
      airport.country,
    );

  if (!countryResult.valid) {
    return countryResult;
  }

  const countryCodeResult =
    validateCountryCode(
      airport.countryCode,
    );

  if (!countryCodeResult.valid) {
    return countryCodeResult;
  }

  const timezoneResult =
    validateTimezone(
      airport.timezone,
    );

  if (!timezoneResult.valid) {
    return timezoneResult;
  }

  const terminalResult =
    validateTerminalCount(
      airport.terminalCount,
    );

  if (!terminalResult.valid) {
    return terminalResult;
  }

  const latitudeResult =
    validateLatitude(
      airport.latitude,
    );

  if (!latitudeResult.valid) {
    return latitudeResult;
  }

  const longitudeResult =
    validateLongitude(
      airport.longitude,
    );

  if (!longitudeResult.valid) {
    return longitudeResult;
  }

  const emailResult =
    validateAirportEmail(
      airport.email,
    );

  if (!emailResult.valid) {
    return emailResult;
  }

  return validateAirportAddress(
    airport.address,
  );
}