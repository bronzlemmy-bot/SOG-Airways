export type AdminBookingStatus =
| "confirmed"
| "pending"
| "cancelled"
| "completed";

export type AdminBookingClass =
| "Economy"
| "Premium Economy"
| "Business"
| "First";

export type AdminPaymentStatus =
| "paid"
| "pending"
| "refunded"
| "failed";

export interface AdminBookingPassenger {
id: string;
fullName: string;
email: string;
phone: string;
nationality: string;
}

export interface AdminBooking {
id: string;
bookingReference: string;

passenger: AdminBookingPassenger;

flightNumber: string;
airlineCode: string;

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

cabinClass: AdminBookingClass;

passengerCount: number;
baggageCount: number;

status: AdminBookingStatus;
paymentStatus: AdminPaymentStatus;

amount: number;
currency: string;

bookingDate: string;
lastUpdated: string;
}

export interface AdminBookingSummary {
id: string;
label: string;
value: string;
description: string;
type:
| "total"
| "confirmed"
| "pending"
| "cancelled"
| "revenue";
}

export const adminBookingsData: AdminBooking[] = [
{
id: "booking-001",
bookingReference: "SOG8K4P2",
passenger: {
id: "passenger-001",
fullName: "Daniel Adeyemi",
email: "[daniel.adeyemi@example.com](mailto:daniel.adeyemi@example.com)",
phone: "+2348012345678",
nationality: "Nigeria",
},
flightNumber: "SOG101",
airlineCode: "SOG",
departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",
arrivalAirport: "Kotoka International Airport",
arrivalAirportCode: "ACC",
arrivalCity: "Accra",
departureDate: "2026-10-04",
departureTime: "08:30",
arrivalDate: "2026-10-04",
arrivalTime: "09:45",
cabinClass: "Economy",
passengerCount: 1,
baggageCount: 2,
status: "confirmed",
paymentStatus: "paid",
amount: 285000,
currency: "NGN",
bookingDate: "2026-09-20",
lastUpdated: "2026-09-20",
},
{
id: "booking-002",
bookingReference: "SOG3M7Q9",
passenger: {
id: "passenger-002",
fullName: "Amaka Okafor",
email: "[amaka.okafor@example.com](mailto:amaka.okafor@example.com)",
phone: "+2348098765432",
nationality: "Nigeria",
},
flightNumber: "SOG204",
airlineCode: "SOG",
departureAirport: "Nnamdi Azikiwe International Airport",
departureAirportCode: "ABV",
departureCity: "Abuja",
arrivalAirport: "Murtala Muhammed International Airport",
arrivalAirportCode: "LOS",
arrivalCity: "Lagos",
departureDate: "2026-10-07",
departureTime: "14:15",
arrivalDate: "2026-10-07",
arrivalTime: "15:25",
cabinClass: "Business",
passengerCount: 1,
baggageCount: 3,
status: "pending",
paymentStatus: "pending",
amount: 420000,
currency: "NGN",
bookingDate: "2026-09-23",
lastUpdated: "2026-09-23",
},
{
id: "booking-003",
bookingReference: "SOG6T2L5",
passenger: {
id: "passenger-003",
fullName: "Michael Johnson",
email: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
phone: "+447700123456",
nationality: "United Kingdom",
},
flightNumber: "SOG310",
airlineCode: "SOG",
departureAirport: "London Heathrow Airport",
departureAirportCode: "LHR",
departureCity: "London",
arrivalAirport: "Murtala Muhammed International Airport",
arrivalAirportCode: "LOS",
arrivalCity: "Lagos",
departureDate: "2026-10-10",
departureTime: "10:20",
arrivalDate: "2026-10-10",
arrivalTime: "17:45",
cabinClass: "Premium Economy",
passengerCount: 2,
baggageCount: 4,
status: "confirmed",
paymentStatus: "paid",
amount: 1850000,
currency: "NGN",
bookingDate: "2026-09-18",
lastUpdated: "2026-09-21",
},
{
id: "booking-004",
bookingReference: "SOG9R1X8",
passenger: {
id: "passenger-004",
fullName: "Fatima Bello",
email: "[fatima.bello@example.com](mailto:fatima.bello@example.com)",
phone: "+2348034567890",
nationality: "Nigeria",
},
flightNumber: "SOG415",
airlineCode: "SOG",
departureAirport: "Murtala Muhammed International Airport",
departureAirportCode: "LOS",
departureCity: "Lagos",
arrivalAirport: "Dubai International Airport",
arrivalAirportCode: "DXB",
arrivalCity: "Dubai",
departureDate: "2026-10-13",
departureTime: "22:10",
arrivalDate: "2026-10-14",
arrivalTime: "07:05",
cabinClass: "First",
passengerCount: 1,
baggageCount: 4,
status: "confirmed",
paymentStatus: "paid",
amount: 3200000,
currency: "NGN",
bookingDate: "2026-09-15",
lastUpdated: "2026-09-22",
},
{
id: "booking-005",
bookingReference: "SOG2N5V7",
passenger: {
id: "passenger-005",
fullName: "Chinedu Eze",
email: "[chinedu.eze@example.com](mailto:chinedu.eze@example.com)",
phone: "+2348076543210",
nationality: "Nigeria",
},
flightNumber: "SOG118",
airlineCode: "SOG",
departureAirport: "Port Harcourt International Airport",
departureAirportCode: "PHC",
departureCity: "Port Harcourt",
arrivalAirport: "Murtala Muhammed International Airport",
arrivalAirportCode: "LOS",
arrivalCity: "Lagos",
departureDate: "2026-10-16",
departureTime: "11:40",
arrivalDate: "2026-10-16",
arrivalTime: "12:55",
cabinClass: "Economy",
passengerCount: 3,
baggageCount: 5,
status: "cancelled",
paymentStatus: "refunded",
amount: 675000,
currency: "NGN",
bookingDate: "2026-09-12",
lastUpdated: "2026-09-24",
},
{
id: "booking-006",
bookingReference: "SOG4P8W3",
passenger: {
id: "passenger-006",
fullName: "Sarah Williams",
email: "[sarah.williams@example.com](mailto:sarah.williams@example.com)",
phone: "+12125550189",
nationality: "United States",
},
flightNumber: "SOG520",
airlineCode: "SOG",
departureAirport: "John F. Kennedy International Airport",
departureAirportCode: "JFK",
departureCity: "New York",
arrivalAirport: "London Heathrow Airport",
arrivalAirportCode: "LHR",
arrivalCity: "London",
departureDate: "2026-10-19",
departureTime: "18:30",
arrivalDate: "2026-10-20",
arrivalTime: "06:20",
cabinClass: "Business",
passengerCount: 1,
baggageCount: 3,
status: "completed",
paymentStatus: "paid",
amount: 2100000,
currency: "NGN",
bookingDate: "2026-08-30",
lastUpdated: "2026-09-20",
},
{
id: "booking-007",
bookingReference: "SOG7H6C4",
passenger: {
id: "passenger-007",
fullName: "Ibrahim Musa",
email: "[ibrahim.musa@example.com](mailto:ibrahim.musa@example.com)",
phone: "+2348123456789",
nationality: "Nigeria",
},
flightNumber: "SOG225",
airlineCode: "SOG",
departureAirport: "Mallam Aminu Kano International Airport",
departureAirportCode: "KAN",
departureCity: "Kano",
arrivalAirport: "Nnamdi Azikiwe International Airport",
arrivalAirportCode: "ABV",
arrivalCity: "Abuja",
departureDate: "2026-10-21",
departureTime: "09:10",
arrivalDate: "2026-10-21",
arrivalTime: "10:20",
cabinClass: "Economy",
passengerCount: 2,
baggageCount: 3,
status: "pending",
paymentStatus: "pending",
amount: 390000,
currency: "NGN",
bookingDate: "2026-09-25",
lastUpdated: "2026-09-25",
},
{
id: "booking-008",
bookingReference: "SOG5D9A1",
passenger: {
id: "passenger-008",
fullName: "Grace Mensah",
email: "[grace.mensah@example.com](mailto:grace.mensah@example.com)",
phone: "+233201234567",
nationality: "Ghana",
},
flightNumber: "SOG102",
airlineCode: "SOG",
departureAirport: "Kotoka International Airport",
departureAirportCode: "ACC",
departureCity: "Accra",
arrivalAirport: "Murtala Muhammed International Airport",
arrivalAirportCode: "LOS",
arrivalCity: "Lagos",
departureDate: "2026-10-24",
departureTime: "16:00",
arrivalDate: "2026-10-24",
arrivalTime: "17:15",
cabinClass: "Economy",
passengerCount: 1,
baggageCount: 2,
status: "confirmed",
paymentStatus: "paid",
amount: 295000,
currency: "NGN",
bookingDate: "2026-09-26",
lastUpdated: "2026-09-26",
},
];

export const adminBookingSummary: AdminBookingSummary[] = [
{
id: "summary-total",
label: "Total Bookings",
value: adminBookingsData.length.toString(),
description: "All bookings currently managed by SOG Airways",
type: "total",
},
{
id: "summary-confirmed",
label: "Confirmed",
value: adminBookingsData
.filter((booking) => booking.status === "confirmed")
.length.toString(),
description: "Bookings confirmed for travel",
type: "confirmed",
},
{
id: "summary-pending",
label: "Pending",
value: adminBookingsData
.filter((booking) => booking.status === "pending")
.length.toString(),
description: "Bookings awaiting confirmation or payment",
type: "pending",
},
{
id: "summary-cancelled",
label: "Cancelled",
value: adminBookingsData
.filter((booking) => booking.status === "cancelled")
.length.toString(),
description: "Bookings that have been cancelled",
type: "cancelled",
},
{
id: "summary-revenue",
label: "Booking Revenue",
value: adminBookingsData
.filter(
(booking) =>
booking.paymentStatus === "paid" &&
booking.status !== "cancelled",
)
.reduce((total, booking) => total + booking.amount, 0)
.toLocaleString("en-NG", {
style: "currency",
currency: "NGN",
maximumFractionDigits: 0,
}),
description: "Revenue from paid active bookings",
type: "revenue",
},
];
