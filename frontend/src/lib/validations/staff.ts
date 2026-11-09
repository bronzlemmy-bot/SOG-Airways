import {
  isRequired,
  isValidEmail,
  isValidLength,
  isValidPhone,
  isStrongPassword,
} from "@/lib/utils";

export interface StaffValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a staff member's first name.
 */
export function validateStaffFirstName(
  firstName: string,
): StaffValidationResult {
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
 * Validates a staff member's last name.
 */
export function validateStaffLastName(
  lastName: string,
): StaffValidationResult {
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
 * Validates a staff email address.
 */
export function validateStaffEmail(
  email: string,
): StaffValidationResult {
  const value = email.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Staff email is required.",
    };
  }

  if (!isValidEmail(value)) {
    return {
      valid: false,
      message: "Please enter a valid staff email address.",
    };
  }

  return { valid: true };
}

/**
 * Validates a staff phone number.
 */
export function validateStaffPhone(
  phone: string,
): StaffValidationResult {
  const value = phone.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Staff phone number is required.",
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
 * Validates a staff employee ID.
 */
export function validateStaffEmployeeId(
  employeeId: string,
): StaffValidationResult {
  const value = employeeId.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Employee ID is required.",
    };
  }

  if (!isValidLength(value, 2, 50)) {
    return {
      valid: false,
      message: "Employee ID must be between 2 and 50 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a staff role.
 */
export function validateStaffRole(
  role: string,
): StaffValidationResult {
  const value = role.trim().toLowerCase();

  const validRoles = [
    "admin",
    "manager",
    "staff",
    "agent",
    "support",
    "operations",
    "finance",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Staff role is required.",
    };
  }

  if (!validRoles.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid staff role.",
    };
  }

  return { valid: true };
}

/**
 * Validates a staff department.
 */
export function validateStaffDepartment(
  department: string,
): StaffValidationResult {
  const value = department.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Department is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Department must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a staff status.
 */
export function validateStaffStatus(
  status: string,
): StaffValidationResult {
  const value = status.trim().toLowerCase();

  const validStatuses = [
    "active",
    "inactive",
    "suspended",
    "pending",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Staff status is required.",
    };
  }

  if (!validStatuses.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid staff status.",
    };
  }

  return { valid: true };
}

/**
 * Validates a staff password.
 */
export function validateStaffPassword(
  password: string,
): StaffValidationResult {
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
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    };
  }

  return { valid: true };
}

/**
 * Validates password confirmation.
 */
export function validateStaffPasswordConfirmation(
  password: string,
  confirmation: string,
): StaffValidationResult {
  if (!isRequired(confirmation)) {
    return {
      valid: false,
      message: "Password confirmation is required.",
    };
  }

  if (password !== confirmation) {
    return {
      valid: false,
      message: "Passwords do not match.",
    };
  }

  return { valid: true };
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  role: string;
  department: string;
  status: string;
  password?: string;
  passwordConfirmation?: string;
}

/**
 * Validates the complete staff form.
 */
export function validateStaffForm(
  data: StaffFormData,
): StaffValidationResult {
  const firstNameResult = validateStaffFirstName(
    data.firstName,
  );

  if (!firstNameResult.valid) {
    return firstNameResult;
  }

  const lastNameResult = validateStaffLastName(
    data.lastName,
  );

  if (!lastNameResult.valid) {
    return lastNameResult;
  }

  const emailResult = validateStaffEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const phoneResult = validateStaffPhone(data.phone);

  if (!phoneResult.valid) {
    return phoneResult;
  }

  const employeeIdResult = validateStaffEmployeeId(
    data.employeeId,
  );

  if (!employeeIdResult.valid) {
    return employeeIdResult;
  }

  const roleResult = validateStaffRole(data.role);

  if (!roleResult.valid) {
    return roleResult;
  }

  const departmentResult = validateStaffDepartment(
    data.department,
  );

  if (!departmentResult.valid) {
    return departmentResult;
  }

  const statusResult = validateStaffStatus(data.status);

  if (!statusResult.valid) {
    return statusResult;
  }

  if (data.password !== undefined) {
    const passwordResult = validateStaffPassword(data.password);

    if (!passwordResult.valid) {
      return passwordResult;
    }

    if (data.passwordConfirmation !== undefined) {
      return validateStaffPasswordConfirmation(
        data.password,
        data.passwordConfirmation,
      );
    }
  }

  return { valid: true };
}