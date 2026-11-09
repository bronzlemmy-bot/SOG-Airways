export const tripStatuses = [
"upcoming",
"completed",
"cancelled",
] as const;

export const tripFilters = [
{
id: "all",
label: "All Trips",
},
{
id: "upcoming",
label: "Upcoming",
},
{
id: "completed",
label: "Completed",
},
{
id: "cancelled",
label: "Cancelled",
},
] as const;

export const trips = [
{
id: "TRIP-1001",
bookingReference: "SOG8K2P",
status: "upcoming",
tripType: "Round Trip",

outbound: {
  flightNumber: "SOG 214",
  departureAirport: "LOS",
  departureCity: "Lagos",
  departureCountry: "Nigeria",
  departureDate: "2026-10-15",
  departureTime: "08:30",

  arrivalAirport: "LHR",
  arrivalCity: "London",
  arrivalCountry: "United Kingdom",
  arrivalDate: "2026-10-15",
  arrivalTime: "15:20",

  duration: "7h 50m",
},

return: {
  flightNumber: "SOG 215",
  departureAirport: "LHR",
  departureCity: "London",
  departureCountry: "United Kingdom",
  departureDate: "2026-10-25",
  departureTime: "11:00",

  arrivalAirport: "LOS",
  arrivalCity: "Lagos",
  arrivalCountry: "Nigeria",
  arrivalDate: "2026-10-25",
  arrivalTime: "19:45",

  duration: "7h 45m",
},

passengers: 1,
cabinClass: "Economy",
baggage: "1 checked bag",
seat: "18A",

price: 850000,
currency: "NGN",

createdAt: "2026-09-20T10:30:00",
updatedAt: "2026-09-20T10:30:00",


},

{
id: "TRIP-1002",
bookingReference: "SOG4M7Q",
status: "upcoming",
tripType: "One Way",


outbound: {
  flightNumber: "SOG 318",
  departureAirport: "LOS",
  departureCity: "Lagos",
  departureCountry: "Nigeria",
  departureDate: "2026-11-08",
  departureTime: "14:15",

  arrivalAirport: "DXB",
  arrivalCity: "Dubai",
  arrivalCountry: "United Arab Emirates",
  arrivalDate: "2026-11-08",
  arrivalTime: "23:10",

  duration: "8h 55m",
},

return: null,

passengers: 2,
cabinClass: "Business",
baggage: "2 checked bags",
seat: "4A, 4B",

price: 1450000,
currency: "NGN",

createdAt: "2026-09-18T14:20:00",
updatedAt: "2026-09-18T14:20:00",


},

{
id: "TRIP-1003",
bookingReference: "SOG7N3L",
status: "completed",
tripType: "Round Trip",


outbound: {
  flightNumber: "SOG 102",
  departureAirport: "LOS",
  departureCity: "Lagos",
  departureCountry: "Nigeria",
  departureDate: "2026-08-05",
  departureTime: "09:00",

  arrivalAirport: "JFK",
  arrivalCity: "New York",
  arrivalCountry: "United States",
  arrivalDate: "2026-08-05",
  arrivalTime: "17:35",

  duration: "12h 35m",
},

return: {
  flightNumber: "SOG 103",
  departureAirport: "JFK",
  departureCity: "New York",
  departureCountry: "United States",
  departureDate: "2026-08-15",
  departureTime: "20:30",

  arrivalAirport: "LOS",
  arrivalCity: "Lagos",
  arrivalCountry: "Nigeria",
  arrivalDate: "2026-08-16",
  arrivalTime: "13:10",

  duration: "10h 40m",
},

passengers: 1,
cabinClass: "Economy",
baggage: "1 checked bag",
seat: "22C",

price: 980000,
currency: "NGN",

createdAt: "2026-07-12T09:15:00",
updatedAt: "2026-08-16T13:10:00",


},

{
id: "TRIP-1004",
bookingReference: "SOG2R8X",
status: "completed",
tripType: "One Way",


outbound: {
  flightNumber: "SOG 421",
  departureAirport: "LOS",
  departureCity: "Lagos",
  departureCountry: "Nigeria",
  departureDate: "2026-07-20",
  departureTime: "07:45",

  arrivalAirport: "CDG",
  arrivalCity: "Paris",
  arrivalCountry: "France",
  arrivalDate: "2026-07-20",
  arrivalTime: "16:05",

  duration: "8h 20m",
},

return: null,

passengers: 1,
cabinClass: "Economy",
baggage: "1 checked bag",
seat: "20F",

price: 720000,
currency: "NGN",

createdAt: "2026-06-25T12:00:00",
updatedAt: "2026-07-20T16:05:00",


},

{
id: "TRIP-1005",
bookingReference: "SOG5T9B",
status: "cancelled",
tripType: "Round Trip",


outbound: {
  flightNumber: "SOG 510",
  departureAirport: "LOS",
  departureCity: "Lagos",
  departureCountry: "Nigeria",
  departureDate: "2026-09-10",
  departureTime: "10:20",

  arrivalAirport: "FRA",
  arrivalCity: "Frankfurt",
  arrivalCountry: "Germany",
  arrivalDate: "2026-09-10",
  arrivalTime: "18:40",

  duration: "8h 20m",
},

return: {
  flightNumber: "SOG 511",
  departureAirport: "FRA",
  departureCity: "Frankfurt",
  departureCountry: "Germany",
  departureDate: "2026-09-18",
  departureTime: "13:30",

  arrivalAirport: "LOS",
  arrivalCity: "Lagos",
  arrivalCountry: "Nigeria",
  arrivalDate: "2026-09-18",
  arrivalTime: "21:50",

  duration: "8h 20m",
},

passengers: 1,
cabinClass: "Economy",
baggage: "1 checked bag",
seat: "16B",

price: 790000,
currency: "NGN",

createdAt: "2026-08-01T15:30:00",
updatedAt: "2026-08-28T10:15:00",


},
] as const;

/* =========================================
Types
========================================= */

export type TripStatus =
| "upcoming"
| "completed"
| "cancelled";

export type TripFilter =
| "all"
| "upcoming"
| "completed"
| "cancelled";

export interface TripFlight {
flightNumber: string;

departureAirport: string;
departureCity: string;
departureCountry: string;
departureDate: string;
departureTime: string;

arrivalAirport: string;
arrivalCity: string;
arrivalCountry: string;
arrivalDate: string;
arrivalTime: string;

duration: string;
}

export interface Trip {
id: string;
bookingReference: string;

status: TripStatus;
tripType: "One Way" | "Round Trip";

outbound: TripFlight;
return: TripFlight | null;

passengers: number;
cabinClass: string;
baggage: string;
seat: string;

price: number;
currency: string;

createdAt: string;
updatedAt: string;
}

/* =========================================
Temporary User Trips Data
========================================= */

export const tripsData = {
filters: tripFilters,

selectedFilter: "all" as TripFilter,

selectedTripId: null as string | null,

trips: trips as readonly Trip[],
} as const;
