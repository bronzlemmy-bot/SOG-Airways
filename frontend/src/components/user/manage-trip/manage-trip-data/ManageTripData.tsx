export interface ManageTripPassenger {
id: string;
title: string;
firstName: string;
lastName: string;
type: string;
seat: string;
}

export interface ManageTripFlight {
airline: string;
flightNumber: string;
origin: {
code: string;
city: string;
airport: string;
};
destination: {
code: string;
city: string;
airport: string;
};
departureDate: string;
departureTime: string;
arrivalDate: string;
arrivalTime: string;
cabinClass: string;
duration: string;
}

export interface ManageTripBaggage {
checkedBags: number;
totalWeight: string;
carryOn: string;
}

export interface ManageTrip {
id: string;
bookingReference: string;
status: string;
tripType: string;
passengers: ManageTripPassenger[];
flight: ManageTripFlight;
baggage: ManageTripBaggage;
paymentStatus: string;
totalAmount: number;
currency: string;
}

export const manageTripData: ManageTrip = {
id: "SOG-BOOKING-001",
bookingReference: "SOG-BOOKING-001",
status: "Confirmed",
tripType: "Round Trip",

passengers: [
{
id: "passenger-1",
title: "Mr",
firstName: "John",
lastName: "Doe",
type: "Adult",
seat: "12A",
},
{
id: "passenger-2",
title: "Mrs",
firstName: "Jane",
lastName: "Doe",
type: "Adult",
seat: "12B",
},
],

flight: {
airline: "SOG Airways",
flightNumber: "SOG 204",


origin: {
  code: "LOS",
  city: "Lagos",
  airport: "Murtala Muhammed International Airport",
},

destination: {
  code: "LHR",
  city: "London",
  airport: "London Heathrow Airport",
},

departureDate: "October 15, 2026",
departureTime: "10:30 AM",

arrivalDate: "October 15, 2026",
arrivalTime: "5:20 PM",

cabinClass: "Economy",
duration: "7h 50m",


},

baggage: {
checkedBags: 2,
totalWeight: "46 kg",
carryOn: "1 × 7 kg",
},

paymentStatus: "Paid",
totalAmount: 1840,
currency: "USD",
};
