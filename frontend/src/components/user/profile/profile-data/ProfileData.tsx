export const profileData = {
  personal: {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1995-06-15",
    gender: "Male",
  },

  contact: {
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    address: "Lagos, Nigeria",
    city: "Lagos",
    country: "Nigeria",
  },

  travel: {
    preferredAirport: "Murtala Muhammed International Airport",
    preferredSeat: "Window",
    preferredMeal: "Standard",
    frequentFlyerNumber: "SOG-FF-001245",
  },

  account: {
    memberSince: "2026",
    status: "Active",
  },

  avatar: {
    name: "John Doe",
    image: "",
  },
};

export type ProfileData = typeof profileData;