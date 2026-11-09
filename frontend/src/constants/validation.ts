export const VALIDATION_LIMITS = {
  name: {
    min: 2,
    max: 50,
  },

  email: {
    max: 254,
  },

  phone: {
    min: 7,
    max: 20,
  },

  password: {
    min: 8,
    max: 128,
  },

  bookingReference: {
    min: 6,
    max: 6,
  },

  flightNumber: {
    min: 3,
    max: 10,
  },

  passportNumber: {
    min: 6,
    max: 20,
  },

  address: {
    max: 255,
  },

  subject: {
    min: 3,
    max: 200,
  },

  message: {
    min: 1,
    max: 5000,
  },

  notes: {
    max: 1000,
  },
} as const;

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  phone: /^\+?[0-9\s\-()]{7,20}$/,

  name: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,

  bookingReference: /^[A-Za-z0-9]{6}$/,

  flightNumber: /^[A-Za-z]{2,4}-?[0-9]{1,4}$/,

  postalCode: /^[A-Za-z0-9\s-]{3,12}$/,

  currencyCode: /^[A-Z]{3}$/,
} as const;

export const REQUIRED_FIELDS = {
  user: [
    "email",
    "firstName",
    "lastName",
  ],

  passenger: [
    "firstName",
    "lastName",
    "passengerType",
  ],

  booking: [
    "bookingReference",
    "userId",
    "status",
  ],

  payment: [
    "bookingId",
    "amount",
    "currency",
  ],

  support: [
    "subject",
    "description",
    "category",
  ],
} as const;