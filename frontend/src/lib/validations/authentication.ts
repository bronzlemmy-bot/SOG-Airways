import {
  isRequired,
  isValidEmail,
  isValidLength,
  isStrongPassword,
} from "@/lib/utils";

export interface AuthenticationValidationResult {
  valid: boolean;
  message?: string;
}

export function validateEmail(
  email: unknown,
): AuthenticationValidationResult {
  if (!isRequired(email)) {
    return {
      valid: false,
      message: "Email address is required.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      message: "Please enter a valid email address.",
    };
  }

  return {
    valid: true,
  };
}

export function validatePassword(
  password: unknown,
): AuthenticationValidationResult {
  if (!isRequired(password)) {
    return {
      valid: false,
      message: "Password is required.",
    };
  }

  if (!isStrongPassword(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.",
    };
  }

  return {
    valid: true,
  };
}

export function validateConfirmPassword(
  password: unknown,
  confirmPassword: unknown,
): AuthenticationValidationResult {
  if (!isRequired(confirmPassword)) {
    return {
      valid: false,
      message: "Please confirm your password.",
    };
  }

  if (password !== confirmPassword) {
    return {
      valid: false,
      message: "Passwords do not match.",
    };
  }

  return {
    valid: true,
  };
}

export function validateName(
  name: unknown,
  fieldName = "Name",
): AuthenticationValidationResult {
  if (!isRequired(name)) {
    return {
      valid: false,
      message: `${fieldName} is required.`,
    };
  }

  if (!isValidLength(name, 2, 100)) {
    return {
      valid: false,
      message: `${fieldName} must be between 2 and 100 characters.`,
    };
  }

  return {
    valid: true,
  };
}

export function validateLoginForm(
  email: unknown,
  password: unknown,
): AuthenticationValidationResult {
  const emailResult =
    validateEmail(email);

  if (!emailResult.valid) {
    return emailResult;
  }

  return validatePassword(password);
}

export function validateRegisterForm(
  firstName: unknown,
  lastName: unknown,
  email: unknown,
  password: unknown,
  confirmPassword: unknown,
): AuthenticationValidationResult {
  const firstNameResult =
    validateName(
      firstName,
      "First name",
    );

  if (!firstNameResult.valid) {
    return firstNameResult;
  }

  const lastNameResult =
    validateName(
      lastName,
      "Last name",
    );

  if (!lastNameResult.valid) {
    return lastNameResult;
  }

  const emailResult =
    validateEmail(email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const passwordResult =
    validatePassword(password);

  if (!passwordResult.valid) {
    return passwordResult;
  }

  return validateConfirmPassword(
    password,
    confirmPassword,
  );
}