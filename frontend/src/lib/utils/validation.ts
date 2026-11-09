export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function isRequired(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

export function isValidEmail(
  value: unknown,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const email = value.trim();

  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

export function isValidPhone(
  value: unknown,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const phone = value.trim();

  if (!phone) {
    return false;
  }

  const normalized = phone.replace(
    /[\s\-().]/g,
    "",
  );

  return /^\+?\d{7,15}$/.test(
    normalized,
  );
}

export function isValidLength(
  value: unknown,
  minimum: number,
  maximum?: number,
): boolean {
  if (
    typeof value !== "string" &&
    !Array.isArray(value)
  ) {
    return false;
  }

  const length = value.length;

  if (length < minimum) {
    return false;
  }

  if (
    maximum !== undefined &&
    length > maximum
  ) {
    return false;
  }

  return true;
}

export function isValidNumber(
  value: unknown,
): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    return Number.isFinite(
      Number(value),
    );
  }

  return false;
}

export function isPositiveNumber(
  value: unknown,
): boolean {
  if (!isValidNumber(value)) {
    return false;
  }

  return Number(value) > 0;
}

export function isNonNegativeNumber(
  value: unknown,
): boolean {
  if (!isValidNumber(value)) {
    return false;
  }

  return Number(value) >= 0;
}

export function isWithinRange(
  value: unknown,
  minimum: number,
  maximum: number,
): boolean {
  if (!isValidNumber(value)) {
    return false;
  }

  const number = Number(value);

  return (
    number >= minimum &&
    number <= maximum
  );
}

export function isValidDate(
  value: unknown,
): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(
      value.getTime(),
    );
  }

  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(
    date.getTime(),
  );
}

export function isStrongPassword(
  value: unknown,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export function isValidPostalCode(
  value: unknown,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const postalCode = value.trim();

  return (
    postalCode.length >= 3 &&
    postalCode.length <= 12 &&
    /^[A-Za-z0-9\s-]+$/.test(
      postalCode,
    )
  );
}

export function validateRequired(
  value: unknown,
  message = "This field is required.",
): ValidationResult {
  return isRequired(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}

export function validateEmail(
  value: unknown,
  message = "Please enter a valid email address.",
): ValidationResult {
  return isValidEmail(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}

export function validatePhone(
  value: unknown,
  message = "Please enter a valid phone number.",
): ValidationResult {
  return isValidPhone(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}

export function validateLength(
  value: unknown,
  minimum: number,
  maximum?: number,
  message?: string,
): ValidationResult {
  if (
    isValidLength(
      value,
      minimum,
      maximum,
    )
  ) {
    return { valid: true };
  }

  return {
    valid: false,
    message:
      message ||
      `Value must be between ${minimum} and ${
        maximum ?? "the maximum"
      } characters.`,
  };
}

export function validateNumber(
  value: unknown,
  message = "Please enter a valid number.",
): ValidationResult {
  return isValidNumber(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}

export function validateDate(
  value: unknown,
  message = "Please enter a valid date.",
): ValidationResult {
  return isValidDate(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}

export function validatePassword(
  value: unknown,
  message = "Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.",
): ValidationResult {
  return isStrongPassword(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}