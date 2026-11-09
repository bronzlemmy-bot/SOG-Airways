
export const currencyOptions = [
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
] as const;

export const languageOptions = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
] as const;

export const timezoneOptions = [
  {
    value: "UTC",
    name: "UTC — Coordinated Universal Time",
  },

  // Africa
  {
    value: "Africa/Abidjan",
    name: "Africa/Abidjan — GMT",
  },
  {
    value: "Africa/Accra",
    name: "Africa/Accra — Ghana",
  },
  {
    value: "Africa/Cairo",
    name: "Africa/Cairo — Egypt",
  },
  {
    value: "Africa/Johannesburg",
    name: "Africa/Johannesburg — South Africa",
  },
  {
    value: "Africa/Lagos",
    name: "Africa/Lagos — Nigeria",
  },
  {
    value: "Africa/Nairobi",
    name: "Africa/Nairobi — Kenya",
  },
  {
    value: "Africa/Casablanca",
    name: "Africa/Casablanca — Morocco",
  },

  // America
  {
    value: "America/Anchorage",
    name: "America/Anchorage — Alaska",
  },
  {
    value: "America/Argentina/Buenos_Aires",
    name: "America/Argentina/Buenos_Aires — Argentina",
  },
  {
    value: "America/Bogota",
    name: "America/Bogota — Colombia",
  },
  {
    value: "America/Chicago",
    name: "America/Chicago — Central Time",
  },
  {
    value: "America/Denver",
    name: "America/Denver — Mountain Time",
  },
  {
    value: "America/Los_Angeles",
    name: "America/Los_Angeles — Pacific Time",
  },
  {
    value: "America/Mexico_City",
    name: "America/Mexico_City — Mexico",
  },
  {
    value: "America/New_York",
    name: "America/New_York — Eastern Time",
  },
  {
    value: "America/Sao_Paulo",
    name: "America/Sao_Paulo — Brazil",
  },
  {
    value: "America/Toronto",
    name: "America/Toronto — Canada",
  },
  {
    value: "America/Vancouver",
    name: "America/Vancouver — Canada",
  },

  // Asia
  {
    value: "Asia/Bangkok",
    name: "Asia/Bangkok — Thailand",
  },
  {
    value: "Asia/Dhaka",
    name: "Asia/Dhaka — Bangladesh",
  },
  {
    value: "Asia/Dubai",
    name: "Asia/Dubai — United Arab Emirates",
  },
  {
    value: "Asia/Hong_Kong",
    name: "Asia/Hong_Kong — Hong Kong",
  },
  {
    value: "Asia/Jakarta",
    name: "Asia/Jakarta — Indonesia",
  },
  {
    value: "Asia/Kolkata",
    name: "Asia/Kolkata — India",
  },
  {
    value: "Asia/Manila",
    name: "Asia/Manila — Philippines",
  },
  {
    value: "Asia/Riyadh",
    name: "Asia/Riyadh — Saudi Arabia",
  },
  {
    value: "Asia/Seoul",
    name: "Asia/Seoul — South Korea",
  },
  {
    value: "Asia/Shanghai",
    name: "Asia/Shanghai — China",
  },
  {
    value: "Asia/Singapore",
    name: "Asia/Singapore — Singapore",
  },
  {
    value: "Asia/Taipei",
    name: "Asia/Taipei — Taiwan",
  },
  {
    value: "Asia/Tokyo",
    name: "Asia/Tokyo — Japan",
  },

  // Australia & Pacific
  {
    value: "Australia/Adelaide",
    name: "Australia/Adelaide — South Australia",
  },
  {
    value: "Australia/Brisbane",
    name: "Australia/Brisbane — Queensland",
  },
  {
    value: "Australia/Melbourne",
    name: "Australia/Melbourne — Victoria",
  },
  {
    value: "Australia/Perth",
    name: "Australia/Perth — Western Australia",
  },
  {
    value: "Australia/Sydney",
    name: "Australia/Sydney — New South Wales",
  },
  {
    value: "Pacific/Auckland",
    name: "Pacific/Auckland — New Zealand",
  },
  {
    value: "Pacific/Fiji",
    name: "Pacific/Fiji",
  },
  {
    value: "Pacific/Honolulu",
    name: "Pacific/Honolulu — Hawaii",
  },

  // Europe
  {
    value: "Europe/Amsterdam",
    name: "Europe/Amsterdam — Netherlands",
  },
  {
    value: "Europe/Athens",
    name: "Europe/Athens — Greece",
  },
  {
    value: "Europe/Berlin",
    name: "Europe/Berlin — Germany",
  },
  {
    value: "Europe/Istanbul",
    name: "Europe/Istanbul — Türkiye",
  },
  {
    value: "Europe/Lisbon",
    name: "Europe/Lisbon — Portugal",
  },
  {
    value: "Europe/London",
    name: "Europe/London — United Kingdom",
  },
  {
    value: "Europe/Madrid",
    name: "Europe/Madrid — Spain",
  },
  {
    value: "Europe/Moscow",
    name: "Europe/Moscow — Russia",
  },
  {
    value: "Europe/Paris",
    name: "Europe/Paris — France",
  },
  {
    value: "Europe/Rome",
    name: "Europe/Rome — Italy",
  },
  {
    value: "Europe/Stockholm",
    name: "Europe/Stockholm — Sweden",
  },
  {
    value: "Europe/Zurich",
    name: "Europe/Zurich — Switzerland",
  },
] as const;

/**
 * Editable Settings model used by the existing settings components.
 * This avoids inferring literal-only values from the default data.
 */
export interface SettingsData {
  account: {
    language: string;
    currency: string;
    timezone: string;
  };

  notifications: {
    bookingUpdates: boolean;
    flightStatus: boolean;
    checkInReminders: boolean;
    promotionalOffers: boolean;
    travelDeals: boolean;
    accountAlerts: boolean;
  };

  privacy: {
    personalizedOffers: boolean;
    travelHistory: boolean;
    dataSharing: boolean;
  };

  security: {
    twoFactorAuthentication: boolean;
    loginAlerts: boolean;
  };

  appearance: {
    theme: "system" | "light" | "dark";
    compactMode: boolean;
  };
}

export const settingsData: SettingsData = {
  account: {
    language: "en",
    currency: "NGN",
    timezone: "auto",
  },

  notifications: {
    bookingUpdates: true,
    flightStatus: true,
    checkInReminders: true,
    promotionalOffers: false,
    travelDeals: true,
    accountAlerts: true,
  },

  privacy: {
    personalizedOffers: true,
    travelHistory: true,
    dataSharing: false,
  },

  security: {
    twoFactorAuthentication: false,
    loginAlerts: true,
  },

  appearance: {
    theme: "system",
    compactMode: false,
  },
};
