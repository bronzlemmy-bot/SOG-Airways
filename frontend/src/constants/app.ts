export const APP_NAME = "SOG Airways";

export const APP_DESCRIPTION =
  "SOG Airways — connecting you to destinations around the world.";

export const APP_VERSION = "1.0.0";

export const DEFAULT_LANGUAGE = "en";

export const DEFAULT_CURRENCY = "NGN";

export const DEFAULT_TIMEZONE = "Africa/Lagos";

export const SUPPORTED_LANGUAGES = [
  "en",
] as const;

export const SUPPORTED_CURRENCIES = [
  "NGN",
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "ZAR",
  "GHS",
  "KES",
] as const;

export const DATE_FORMAT = "DD/MM/YYYY";

export const TIME_FORMAT = "HH:mm";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const CONTACT_INFORMATION = {
  phone: "07038915140",
  email: "bronzlemmy@gmail.com",
} as const;