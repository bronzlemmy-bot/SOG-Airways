export type AdminFlightStatus =
| "scheduled"
| "boarding"
| "departed"
| "arrived"
| "delayed"
| "cancelled";

export type AdminFlightClass =
| "Economy"
| "Premium Economy"
| "Business"
| "First";

export interface AdminFlight {
id: string;
flightNumber: string;
airlineCode: string;
aircraftId: string;
aircraftRegistration: string;
aircraftType: string;

departureAirport: string;
departureAirportCode: string;
departureCity: string;

arrivalAirport: string;
arrivalAirportCode: string;
arrivalCity: string;

departureDate: string;
departureTime: string;
arrivalDate: string;
arrivalTime: string;

duration: string;
distance: number;

totalSeats: number;
bookedSeats: number;
availableSeats: number;

economySeats: number;
premiumEconomySeats: number;
businessSeats: number;
firstClassSeats: number;

status: AdminFlightStatus;

gate?: string;
terminal?: string;

baggageAllowance: string;
mealService: boolean;
wifiAvailable: boolean;

baseFare: number;
currency: string;

createdAt: string;
updatedAt: string;
}

export interface AdminFlightSummary {
id: string;
label: string;
value: string;
description: string;
type:
| "total"
| "scheduled"
| "boarding"
| "delayed"
| "cancelled"
| "revenue";
}

export const adminFlightsData: AdminFlight[] = [
{
id: "flight-001",
flightNumber: "SOG101",
airlineCode: "SOG",
aircraftId: "aircraft-001",
aircraftRegistration: "5N-SOG1",
aircraftType: "Boeing 737-800",


departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",

arrivalAirport: "Nnamdi Azikiwe International Airport",
arrivalAirportCode: "ABV",
arrivalCity: "Abuja",

departureDate: "2026-10-02",
departureTime: "07:30",
arrivalDate: "2026-10-02",
arrivalTime: "08:45",

duration: "1h 15m",
distance: 537,

totalSeats: 174,
bookedSeats: 128,
availableSeats: 46,

economySeats: 150,
premiumEconomySeats: 12,
businessSeats: 12,
firstClassSeats: 0,

status: "scheduled",

gate: "A12",
terminal: "Terminal 2",

baggageAllowance: "23 kg",
mealService: true,
wifiAvailable: true,

baseFare: 185000,
currency: "NGN",

createdAt: "2026-09-15",
updatedAt: "2026-09-27",


},

{
id: "flight-002",
flightNumber: "SOG205",
airlineCode: "SOG",
aircraftId: "aircraft-002",
aircraftRegistration: "5N-SOG2",
aircraftType: "Airbus A320",


departureAirport: "Nnamdi Azikiwe International Airport",
departureAirportCode: "ABV",
departureCity: "Abuja",

arrivalAirport: "Port Harcourt International Airport",
arrivalAirportCode: "PHC",
arrivalCity: "Port Harcourt",

departureDate: "2026-10-02",
departureTime: "09:15",
arrivalDate: "2026-10-02",
arrivalTime: "10:35",

duration: "1h 20m",
distance: 445,

totalSeats: 180,
bookedSeats: 96,
availableSeats: 84,

economySeats: 156,
premiumEconomySeats: 12,
businessSeats: 12,
firstClassSeats: 0,

status: "boarding",

gate: "B04",
terminal: "Terminal 1",

baggageAllowance: "23 kg",
mealService: true,
wifiAvailable: false,

baseFare: 165000,
currency: "NGN",

createdAt: "2026-09-16",
updatedAt: "2026-09-27",


},

{
id: "flight-003",
flightNumber: "SOG310",
airlineCode: "SOG",
aircraftId: "aircraft-003",
aircraftRegistration: "5N-SOG3",
aircraftType: "Airbus A321",


departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",

arrivalAirport: "Kotoka International Airport",
arrivalAirportCode: "ACC",
arrivalCity: "Accra",

departureDate: "2026-10-03",
departureTime: "11:00",
arrivalDate: "2026-10-03",
arrivalTime: "12:10",

duration: "1h 10m",
distance: 402,

totalSeats: 196,
bookedSeats: 154,
availableSeats: 42,

economySeats: 172,
premiumEconomySeats: 12,
businessSeats: 12,
firstClassSeats: 0,

status: "scheduled",

gate: "C08",
terminal: "Terminal 2",

baggageAllowance: "23 kg",
mealService: true,
wifiAvailable: true,

baseFare: 290000,
currency: "NGN",

createdAt: "2026-09-17",
updatedAt: "2026-09-27",


},

{
id: "flight-004",
flightNumber: "SOG420",
airlineCode: "SOG",
aircraftId: "aircraft-004",
aircraftRegistration: "5N-SOG4",
aircraftType: "Airbus A330",


departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",

arrivalAirport: "Dubai International Airport",
arrivalAirportCode: "DXB",
arrivalCity: "Dubai",

departureDate: "2026-10-04",
departureTime: "19:30",
arrivalDate: "2026-10-05",
arrivalTime: "05:45",

duration: "8h 15m",
distance: 6235,

totalSeats: 300,
bookedSeats: 218,
availableSeats: 82,

economySeats: 240,
premiumEconomySeats: 30,
businessSeats: 24,
firstClassSeats: 6,

status: "scheduled",

gate: "D15",
terminal: "International Terminal",

baggageAllowance: "30 kg",
mealService: true,
wifiAvailable: true,

baseFare: 1250000,
currency: "NGN",

createdAt: "2026-09-18",
updatedAt: "2026-09-27",


},

{
id: "flight-005",
flightNumber: "SOG515",
airlineCode: "SOG",
aircraftId: "aircraft-005",
aircraftRegistration: "5N-SOG5",
aircraftType: "Boeing 787",


departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",

arrivalAirport: "Heathrow Airport",
arrivalAirportCode: "LHR",
arrivalCity: "London",

departureDate: "2026-10-05",
departureTime: "21:45",
arrivalDate: "2026-10-06",
arrivalTime: "04:50",

duration: "7h 05m",
distance: 5000,

totalSeats: 242,
bookedSeats: 231,
availableSeats: 11,

economySeats: 180,
premiumEconomySeats: 32,
businessSeats: 24,
firstClassSeats: 6,

status: "delayed",

gate: "E02",
terminal: "International Terminal",

baggageAllowance: "30 kg",
mealService: true,
wifiAvailable: true,

baseFare: 1450000,
currency: "NGN",

createdAt: "2026-09-19",
updatedAt: "2026-09-27",


},

{
id: "flight-006",
flightNumber: "SOG620",
airlineCode: "SOG",
aircraftId: "aircraft-006",
aircraftRegistration: "5N-SOG6",
aircraftType: "Boeing 737-800",


departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",

arrivalAirport: "Kano International Airport",
arrivalAirportCode: "KAN",
arrivalCity: "Kano",

departureDate: "2026-10-06",
departureTime: "14:20",
arrivalDate: "2026-10-06",
arrivalTime: "15:35",

duration: "1h 15m",
distance: 837,

totalSeats: 174,
bookedSeats: 67,
availableSeats: 107,

economySeats: 150,
premiumEconomySeats: 12,
businessSeats: 12,
firstClassSeats: 0,

status: "scheduled",

gate: "A08",
terminal: "Terminal 2",

baggageAllowance: "23 kg",
mealService: false,
wifiAvailable: true,

baseFare: 210000,
currency: "NGN",

createdAt: "2026-09-20",
updatedAt: "2026-09-27",


},

{
id: "flight-007",
flightNumber: "SOG705",
airlineCode: "SOG",
aircraftId: "aircraft-007",
aircraftRegistration: "5N-SOG7",
aircraftType: "Airbus A321",


departureAirport: "Port Harcourt International Airport",
departureAirportCode: "PHC",
departureCity: "Port Harcourt",

arrivalAirport: "Murtala Muhammed International Airport",
arrivalAirportCode: "LOS",
arrivalCity: "Lagos",

departureDate: "2026-10-07",
departureTime: "16:10",
arrivalDate: "2026-10-07",
arrivalTime: "17:25",

duration: "1h 15m",
distance: 426,

totalSeats: 196,
bookedSeats: 142,
availableSeats: 54,

economySeats: 172,
premiumEconomySeats: 12,
businessSeats: 12,
firstClassSeats: 0,

status: "scheduled",

gate: "B09",
terminal: "Terminal 1",

baggageAllowance: "23 kg",
mealService: true,
wifiAvailable: true,

baseFare: 175000,
currency: "NGN",

createdAt: "2026-09-21",
updatedAt: "2026-09-27",


},

{
id: "flight-008",
flightNumber: "SOG810",
airlineCode: "SOG",
aircraftId: "aircraft-008",
aircraftRegistration: "5N-SOG8",
aircraftType: "Boeing 787",


departureAirport: "Dubai International Airport",
departureAirportCode: "DXB",
departureCity: "Dubai",

arrivalAirport: "John F. Kennedy International Airport",
arrivalAirportCode: "JFK",
arrivalCity: "New York",

departureDate: "2026-10-08",
departureTime: "08:30",
arrivalDate: "2026-10-08",
arrivalTime: "14:20",

duration: "13h 50m",
distance: 11000,

totalSeats: 242,
bookedSeats: 198,
availableSeats: 44,

economySeats: 180,
premiumEconomySeats: 32,
businessSeats: 24,
firstClassSeats: 6,

status: "scheduled",

gate: "F21",
terminal: "Terminal 3",

baggageAllowance: "30 kg",
mealService: true,
wifiAvailable: true,

baseFare: 1800000,
currency: "NGN",

createdAt: "2026-09-22",
updatedAt: "2026-09-27",

},
];

export const adminFlightSummary: AdminFlightSummary[] = [
{
id: "total",
label: "Total Flights",
value: adminFlightsData.length.toString(),
description: "Flights currently managed by SOG Airways.",
type: "total",
},
{
id: "scheduled",
label: "Scheduled",
value: adminFlightsData
.filter((flight) => flight.status === "scheduled")
.length.toString(),
description: "Flights scheduled for upcoming departure.",
type: "scheduled",
},
{
id: "boarding",
label: "Boarding",
value: adminFlightsData
.filter((flight) => flight.status === "boarding")
.length.toString(),
description: "Flights currently preparing passengers.",
type: "boarding",
},
{
id: "delayed",
label: "Delayed",
value: adminFlightsData
.filter((flight) => flight.status === "delayed")
.length.toString(),
description: "Flights currently affected by delays.",
type: "delayed",
},
{
id: "cancelled",
label: "Cancelled",
value: adminFlightsData
.filter((flight) => flight.status === "cancelled")
.length.toString(),
description: "Flights that have been cancelled.",
type: "cancelled",
},
{
id: "revenue",
label: "Flight Revenue",
value: new Intl.NumberFormat("en-NG", {
style: "currency",
currency: "NGN",
maximumFractionDigits: 0,
}).format(
adminFlightsData.reduce(
(total, flight) =>
total +
flight.baseFare * flight.bookedSeats,
0,
),
),
description: "Estimated revenue from booked seats.",
type: "revenue",
},
];
