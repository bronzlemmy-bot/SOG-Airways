export type DashboardBookingStatus =
| "confirmed"
| "pending"
| "cancelled";

export type DashboardBookingClass =
| "Economy"
| "Premium Economy"
| "Business"
| "First";

export type DashboardActivityType =
| "booking"
| "payment"
| "check-in"
| "cancellation"
| "flight";

export type UpcomingFlightStatus =
| "boarding"
| "scheduled"
| "delayed";

export interface DashboardStat {
id: string;
label: string;
value: string;
change: string;
changeType: "positive" | "negative" | "neutral";
description: string;
}

export interface BookingActivityItem {
id: string;
type: DashboardActivityType;
title: string;
description: string;
time: string;
bookingReference?: string;
customerName?: string;
}

export interface RecentBooking {
id: string;
bookingReference: string;
passengerName: string;
passengerCount: number;
route: string;
departureAirport: string;
arrivalAirport: string;
departureDate: string;
departureTime: string;
cabinClass: DashboardBookingClass;
status: DashboardBookingStatus;
amount: number;
currency: string;
createdAt: string;
}

export interface RevenuePoint {
id: string;
period: string;
revenue: number;
bookings: number;
}

export interface UpcomingFlight {
id: string;
flightNumber: string;
route: string;
departureAirport: string;
arrivalAirport: string;
departureDate: string;
departureTime: string;
arrivalTime: string;
aircraft: string;
totalSeats: number;
bookedSeats: number;
availableSeats: number;
status: UpcomingFlightStatus;
}

export interface UpcomingFilterOption {
id: string;
label: string;
value: "today" | "tomorrow" | "week";
}

export interface AdminDashboardData {
stats: DashboardStat[];
bookingActivity: BookingActivityItem[];
recentBookings: RecentBooking[];
revenueOverview: RevenuePoint[];
upcomingFlights: UpcomingFlight[];
upcomingFilters: UpcomingFilterOption[];
selectedUpcomingFilter: UpcomingFilterOption["value"];
}

export const dashboardStats: DashboardStat[] = [
{
id: "total-bookings",
label: "Total Bookings",
value: "12,846",
change: "+12.8%",
changeType: "positive",
description: "Compared with the previous month",
},
{
id: "total-passengers",
label: "Passengers",
value: "28,492",
change: "+9.4%",
changeType: "positive",
description: "Compared with the previous month",
},
{
id: "total-revenue",
label: "Total Revenue",
value: "₦184.6M",
change: "+15.7%",
changeType: "positive",
description: "Compared with the previous month",
},
{
id: "active-flights",
label: "Active Flights",
value: "64",
change: "+6",
changeType: "positive",
description: "Currently scheduled flights",
},
];

export const bookingActivity: BookingActivityItem[] = [
{
id: "activity-001",
type: "booking",
title: "New booking created",
description: "A new reservation was created by Daniel Okafor.",
time: "8 minutes ago",
bookingReference: "SOG8K2P",
customerName: "Daniel Okafor",
},
{
id: "activity-002",
type: "payment",
title: "Payment received",
description: "Payment was successfully received for booking SOG4M7Q.",
time: "24 minutes ago",
bookingReference: "SOG4M7Q",
customerName: "Amara Johnson",
},
{
id: "activity-003",
type: "check-in",
title: "Passenger checked in",
description: "A passenger completed online check-in.",
time: "41 minutes ago",
bookingReference: "SOG7N3L",
customerName: "Michael Adeyemi",
},
{
id: "activity-004",
type: "cancellation",
title: "Booking cancelled",
description: "A booking was cancelled by the customer.",
time: "1 hour ago",
bookingReference: "SOG2R8X",
customerName: "Grace Williams",
},
{
id: "activity-005",
type: "flight",
title: "Flight schedule updated",
description: "The departure time for SOG 214 was updated.",
time: "2 hours ago",
bookingReference: "SOG214",
},
{
id: "activity-006",
type: "booking",
title: "New booking created",
description: "A new reservation was created by Ibrahim Musa.",
time: "3 hours ago",
bookingReference: "SOG5T9B",
customerName: "Ibrahim Musa",
},
];

export const recentBookings: RecentBooking[] = [
{
id: "booking-001",
bookingReference: "SOG8K2P",
passengerName: "Daniel Okafor",
passengerCount: 1,
route: "Lagos → London",
departureAirport: "LOS",
arrivalAirport: "LHR",
departureDate: "2026-10-02",
departureTime: "21:45",
cabinClass: "Economy",
status: "confirmed",
amount: 850000,
currency: "NGN",
createdAt: "2026-09-29T08:30:00",
},
{
id: "booking-002",
bookingReference: "SOG4M7Q",
passengerName: "Amara Johnson",
passengerCount: 2,
route: "Lagos → Dubai",
departureAirport: "LOS",
arrivalAirport: "DXB",
departureDate: "2026-10-05",
departureTime: "14:20",
cabinClass: "Business",
status: "confirmed",
amount: 1450000,
currency: "NGN",
createdAt: "2026-09-29T07:55:00",
},
{
id: "booking-003",
bookingReference: "SOG7N3L",
passengerName: "Michael Adeyemi",
passengerCount: 1,
route: "Lagos → New York",
departureAirport: "LOS",
arrivalAirport: "JFK",
departureDate: "2026-10-08",
departureTime: "23:10",
cabinClass: "Economy",
status: "pending",
amount: 980000,
currency: "NGN",
createdAt: "2026-09-29T07:10:00",
},
{
id: "booking-004",
bookingReference: "SOG2R8X",
passengerName: "Grace Williams",
passengerCount: 1,
route: "Lagos → Frankfurt",
departureAirport: "LOS",
arrivalAirport: "FRA",
departureDate: "2026-10-11",
departureTime: "19:35",
cabinClass: "Economy",
status: "cancelled",
amount: 790000,
currency: "NGN",
createdAt: "2026-09-28T18:45:00",
},
{
id: "booking-005",
bookingReference: "SOG5T9B",
passengerName: "Ibrahim Musa",
passengerCount: 1,
route: "Lagos → Paris",
departureAirport: "LOS",
arrivalAirport: "CDG",
departureDate: "2026-10-14",
departureTime: "20:15",
cabinClass: "Premium Economy",
status: "confirmed",
amount: 720000,
currency: "NGN",
createdAt: "2026-09-28T16:20:00",
},
{
id: "booking-006",
bookingReference: "SOG6C4M",
passengerName: "Sarah Bello",
passengerCount: 3,
route: "Lagos → Johannesburg",
departureAirport: "LOS",
arrivalAirport: "JNB",
departureDate: "2026-10-17",
departureTime: "10:40",
cabinClass: "Economy",
status: "confirmed",
amount: 1120000,
currency: "NGN",
createdAt: "2026-09-28T14:05:00",
},
];

export const revenueOverview: RevenuePoint[] = [
{
id: "revenue-01",
period: "Apr",
revenue: 118000000,
bookings: 742,
},
{
id: "revenue-02",
period: "May",
revenue: 126500000,
bookings: 811,
},
{
id: "revenue-03",
period: "Jun",
revenue: 139800000,
bookings: 905,
},
{
id: "revenue-04",
period: "Jul",
revenue: 151200000,
bookings: 978,
},
{
id: "revenue-05",
period: "Aug",
revenue: 159700000,
bookings: 1042,
},
{
id: "revenue-06",
period: "Sep",
revenue: 184600000,
bookings: 1168,
},
];

export const upcomingFlights: UpcomingFlight[] = [
{
id: "flight-001",
flightNumber: "SOG 214",
route: "Lagos → London",
departureAirport: "LOS",
arrivalAirport: "LHR",
departureDate: "2026-09-29",
departureTime: "21:45",
arrivalTime: "05:20",
aircraft: "Boeing 787-9",
totalSeats: 290,
bookedSeats: 264,
availableSeats: 26,
status: "scheduled",
},
{
id: "flight-002",
flightNumber: "SOG 318",
route: "Lagos → Dubai",
departureAirport: "LOS",
arrivalAirport: "DXB",
departureDate: "2026-09-30",
departureTime: "14:20",
arrivalTime: "00:15",
aircraft: "Airbus A330-900",
totalSeats: 301,
bookedSeats: 283,
availableSeats: 18,
status: "scheduled",
},
{
id: "flight-003",
flightNumber: "SOG 426",
route: "Lagos → Paris",
departureAirport: "LOS",
arrivalAirport: "CDG",
departureDate: "2026-09-30",
departureTime: "20:15",
arrivalTime: "06:25",
aircraft: "Airbus A350-900",
totalSeats: 325,
bookedSeats: 309,
availableSeats: 16,
status: "boarding",
},
{
id: "flight-004",
flightNumber: "SOG 512",
route: "Lagos → New York",
departureAirport: "LOS",
arrivalAirport: "JFK",
departureDate: "2026-10-01",
departureTime: "23:10",
arrivalTime: "06:45",
aircraft: "Boeing 777-300ER",
totalSeats: 368,
bookedSeats: 321,
availableSeats: 47,
status: "scheduled",
},
{
id: "flight-005",
flightNumber: "SOG 608",
route: "Lagos → Johannesburg",
departureAirport: "LOS",
arrivalAirport: "JNB",
departureDate: "2026-10-01",
departureTime: "10:40",
arrivalTime: "17:20",
aircraft: "Airbus A330-300",
totalSeats: 277,
bookedSeats: 241,
availableSeats: 36,
status: "delayed",
},
];

export const upcomingFilters: UpcomingFilterOption[] = [
{
id: "today",
label: "Today",
value: "today",
},
{
id: "tomorrow",
label: "Tomorrow",
value: "tomorrow",
},
{
id: "week",
label: "This Week",
value: "week",
},
];

export const adminDashboardData: AdminDashboardData = {
stats: dashboardStats,
bookingActivity,
recentBookings,
revenueOverview,
upcomingFlights,
upcomingFilters,
selectedUpcomingFilter: "today",
};
