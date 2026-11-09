
export const dashboardUser = {
  firstName: "Alex",
  fullName: "Alex Johnson",
  membership: "SOG Airways Explorer",
  membershipLevel: "Gold",
  avatar: "",
};

export const dashboardStats = [
  {
    id: "total-bookings",
    label: "Total Bookings",
    value: 24,
    description: "All time bookings",
    icon: "ticket",
  },
  {
    id: "upcoming-trips",
    label: "Upcoming Trips",
    value: 3,
    description: "Trips scheduled",
    icon: "plane",
  },
  {
    id: "completed-trips",
    label: "Completed Trips",
    value: 18,
    description: "Trips completed",
    icon: "check",
  },
  {
    id: "travel-points",
    label: "Travel Points",
    value: 12450,
    description: "Available points",
    icon: "award",
  },
];

export const quickActions = [
  {
    id: "book-flight",
    title: "Book a Flight",
    description: "Search and book your next journey",
    icon: "plane",
    href: "/booking",
  },
  {
    id: "manage-trips",
    title: "Manage Trips",
    description: "View and manage your upcoming trips",
    icon: "briefcase",
    href: "/users/manage-trips",
  },
  {
    id: "check-in",
    title: "Check In",
    description: "Check in for an upcoming flight",
    icon: "check-circle",
    href: "/users/check-in/SOG8K4P2",
  },
  {
    id: "support",
    title: "Get Support",
    description: "Get help with your booking or trip",
    icon: "headphones",
    href: "/users/support",
  },
];

export const upcomingTrips = [
  {
    id: "trip-001",
    bookingReference: "SOG7K2P",
    airline: "SOG Airways",
    flightNumber: "SOG 204",
    departure: {
      airport: "LOS",
      city: "Lagos",
      date: "Oct 18, 2026",
      time: "09:45 AM",
    },
    arrival: {
      airport: "LHR",
      city: "London",
      date: "Oct 18, 2026",
      time: "04:20 PM",
    },
    duration: "6h 35m",
    status: "Confirmed",
    cabin: "Economy",
    passengers: 1,
  },
  {
    id: "trip-002",
    bookingReference: "SOG9M4R",
    airline: "SOG Airways",
    flightNumber: "SOG 518",
    departure: {
      airport: "LHR",
      city: "London",
      date: "Nov 06, 2026",
      time: "11:15 AM",
    },
    arrival: {
      airport: "JFK",
      city: "New York",
      date: "Nov 06, 2026",
      time: "02:10 PM",
    },
    duration: "7h 55m",
    status: "Confirmed",
    cabin: "Business",
    passengers: 2,
  },
  {
    id: "trip-003",
    bookingReference: "SOG3T8Q",
    airline: "SOG Airways",
    flightNumber: "SOG 731",
    departure: {
      airport: "JFK",
      city: "New York",
      date: "Dec 14, 2026",
      time: "06:30 PM",
    },
    arrival: {
      airport: "NRT",
      city: "Tokyo",
      date: "Dec 15, 2026",
      time: "09:40 PM",
    },
    duration: "14h 10m",
    status: "Confirmed",
    cabin: "Premium Economy",
    passengers: 1,
  },
];

export const recentBookings = [
  {
    id: "booking-001",
    bookingReference: "SOG5A8L",
    route: "Lagos → Dubai",
    flightNumber: "SOG 412",
    date: "Sep 08, 2026",
    status: "Completed",
    cabin: "Economy",
    amount: 820,
    currency: "USD",
  },
  {
    id: "booking-002",
    bookingReference: "SOG2C6N",
    route: "Dubai → Singapore",
    flightNumber: "SOG 628",
    date: "Aug 21, 2026",
    status: "Completed",
    cabin: "Business",
    amount: 1450,
    currency: "USD",
  },
  {
    id: "booking-003",
    bookingReference: "SOG8F1K",
    route: "Singapore → Lagos",
    flightNumber: "SOG 905",
    date: "Jul 30, 2026",
    status: "Completed",
    cabin: "Economy",
    amount: 980,
    currency: "USD",
  },
  {
    id: "booking-004",
    bookingReference: "SOG4P7W",
    route: "Lagos → Accra",
    flightNumber: "SOG 118",
    date: "Jul 12, 2026",
    status: "Cancelled",
    cabin: "Economy",
    amount: 340,
    currency: "USD",
  },
];

export const travelSummary = {
  totalTrips: 42,
  countriesVisited: 12,
  citiesVisited: 27,
  totalMiles: 68420,
  travelPoints: 12450,
  favoriteDestination: {
    city: "London",
    country: "United Kingdom",
    visits: 5,
  },
};

export const travelSummaryBreakdown = [
  {
    id: "international",
    label: "International",
    value: 68,
    unit: "%",
  },
  {
    id: "domestic",
    label: "Domestic",
    value: 32,
    unit: "%",
  },
];

export const dashboardNotifications = [
  {
    id: "notification-001",
    title: "Upcoming flight",
    message: "Your flight to London departs in 25 days.",
    type: "flight",
    unread: true,
  },
  {
    id: "notification-002",
    title: "Check-in available",
    message: "Online check-in is available for your upcoming trip.",
    type: "check-in",
    unread: true,
  },
  {
    id: "notification-003",
    title: "Travel points updated",
    message: "Your latest travel points have been added to your account.",
    type: "reward",
    unread: false,
  },
];
