import {
  isRequired,
  isValidEmail,
  isValidLength,
  isValidPhone,
} from "@/lib/utils";

export interface ProfileValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a user's first name.
 */
export function validateProfileFirstName(
  firstName: string,
): ProfileValidationResult {
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
 * Validates a user's last name.
 */
export function validateProfileLastName(
  lastName: string,
): ProfileValidationResult {
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
 * Validates a profile email address.
 */
export function validateProfileEmail(
  email: string,
): ProfileValidationResult {
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
 * Validates a profile phone number.
 */
export function validateProfilePhone(
  phone: string,
): ProfileValidationResult {
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
 * Validates a country or nationality.
 */
export function validateProfileCountry(
  country: string,
): ProfileValidationResult {
  const value = country.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Country is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Country must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a city.
 */
export function validateProfileCity(
  city: string,
): ProfileValidationResult {
  const value = city.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "City is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "City must be between 2 and 100 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a preferred language.
 */
export function validateProfileLanguage(
  language: string,
): ProfileValidationResult {
  const value = language.trim();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Preferred language is required.",
    };
  }

  if (!isValidLength(value, 2, 100)) {
    return {
      valid: false,
      message: "Please select a valid language.",
    };
  }

  return { valid: true };
}

/**
 * Validates a preferred currency.
 */
export function validateProfileCurrency(
  currency: string,
): ProfileValidationResult {
  const value = currency.trim().toUpperCase();

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Preferred currency is required.",
    };
  }

  if (!/^[A-Z]{3}$/.test(value)) {
    return {
      valid: false,
      message: "Currency must be a valid three-letter currency code.",
    };
  }

  return { valid: true };
}

/**
 * Validates a seat preference.
 */
export function validateProfileSeatPreference(
  preference: string,
): ProfileValidationResult {
  const value = preference.trim().toLowerCase();

  const validPreferences = [
    "window",
    "aisle",
    "middle",
    "no-preference",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Seat preference is required.",
    };
  }

  if (!validPreferences.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid seat preference.",
    };
  }

  return { valid: true };
}

/**
 * Validates a meal preference.
 */
export function validateProfileMealPreference(
  preference: string,
): ProfileValidationResult {
  const value = preference.trim().toLowerCase();

  const validPreferences = [
    "standard",
    "vegetarian",
    "vegan",
    "halal",
    "kosher",
    "special",
    "no-preference",
  ];

  if (!isRequired(value)) {
    return {
      valid: false,
      message: "Meal preference is required.",
    };
  }

  if (!validPreferences.includes(value)) {
    return {
      valid: false,
      message: "Please select a valid meal preference.",
    };
  }

  return { valid: true };
}

/**
 * Validates an optional profile bio.
 */
export function validateProfileBio(
  bio?: string,
): ProfileValidationResult {
  const value = bio?.trim() ?? "";

  if (!value) {
    return { valid: true };
  }

  if (!isValidLength(value, 2, 500)) {
    return {
      valid: false,
      message: "Bio must be between 2 and 500 characters.",
    };
  }

  return { valid: true };
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  language: string;
  currency: string;
  seatPreference: string;
  mealPreference: string;
  bio?: string;
}

/**
 * Validates the complete profile form.
 */
export function validateProfileForm(
  data: ProfileFormData,
): ProfileValidationResult {
  const firstNameResult = validateProfileFirstName(
    data.firstName,
  );

  if (!firstNameResult.valid) {
    return firstNameResult;
  }

  const lastNameResult = validateProfileLastName(
    data.lastName,
  );

  if (!lastNameResult.valid) {
    return lastNameResult;
  }

  const emailResult = validateProfileEmail(data.email);

  if (!emailResult.valid) {
    return emailResult;
  }

  const phoneResult = validateProfilePhone(data.phone);

  if (!phoneResult.valid) {
    return phoneResult;
  }

  const countryResult = validateProfileCountry(data.country);

  if (!countryResult.valid) {
    return countryResult;
  }

  const cityResult = validateProfileCity(data.city);

  if (!cityResult.valid) {
    return cityResult;
  }

  const languageResult = validateProfileLanguage(data.language);

  if (!languageResult.valid) {
    return languageResult;
  }

  const currencyResult = validateProfileCurrency(data.currency);

  if (!currencyResult.valid) {
    return currencyResult;
  }

  const seatResult = validateProfileSeatPreference(
    data.seatPreference,
  );

  if (!seatResult.valid) {
    return seatResult;
  }

  const mealResult = validateProfileMealPreference(
    data.mealPreference,
  );

  if (!mealResult.valid) {
    return mealResult;
  }

  return validateProfileBio(data.bio);
}