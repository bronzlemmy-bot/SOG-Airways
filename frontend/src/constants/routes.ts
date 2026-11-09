export const PUBLIC_ROUTES = {
  home: "/",
  flights: "/flights",
  booking: "/booking",
  destinations: "/destinations",
  offers: "/offers",
  deals: "/deals",
  manageBooking: "/manage-booking",
  checkIn: "/check-in",
  trackFlight: "/track-flight",
  baggage: "/baggage",
  travelInformation: "/travel-information",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  testimonials: "/testimonials",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const USER_ROUTES = {
  dashboard: "/users/dashboard",
  booking: "/users/bookings",
  bookingDetails: "/users/booking-details",
  checkIn: "/users/check-in",
  manageTrip: "/users/manage-trips",
  notifications: "/users/notifications",
  paymentMethod: "/users/payment-methods",
  profile: "/users/profile",
  settings: "/users/settings",
  support: "/users/support",
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  passengers: "/admin/passengers",
  flights: "/admin/flights",
  bookings: "/admin/bookings",
  customers: "/admin/customers",
  staff: "/admin/staff",
  payments: "/admin/payments",
  reports: "/admin/Reports",
} as const;

export const AUTH_ROUTES = {
  login: "/login",
  register: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

export const ROUTES = {
  public: PUBLIC_ROUTES,
  user: USER_ROUTES,
  admin: ADMIN_ROUTES,
  auth: AUTH_ROUTES,
} as const;