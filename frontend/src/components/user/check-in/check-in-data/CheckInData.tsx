import { BaggageOption } from "../BaggageSelection";
import { Seat } from "../SeatSelection";

export interface CheckInPassenger {
id: string;
title?: string;
firstName: string;
lastName: string;
email?: string;
phone?: string;
passengerType?: string;
seatNumber?: string;
checkedIn?: boolean;
}

export const checkInBooking = {
bookingReference: "SOG8K4P2",
status: "confirmed",
flightNumber: "SOG 208",
origin: {
code: "LOS",
city: "Lagos",
},
destination: {
code: "LHR",
city: "London",
},
departureDate: "2026-10-15",
departureTime: "09:30",
cabinClass: "Economy",
};

export const checkInPassengers: CheckInPassenger[] = [
{
id: "passenger-1",
title: "Mr",
firstName: "Alex",
lastName: "Morgan",
email: "[alex@example.com](mailto:alex@example.com)",
phone: "+1 555 000 0000",
passengerType: "Adult",
seatNumber: "12A",
},
];

export const checkInSeats: Seat[] = [
{
id: "seat-11A",
label: "11A",
row: 11,
position: "A",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-11B",
label: "11B",
row: 11,
position: "B",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-11C",
label: "11C",
row: 11,
position: "C",
status: "occupied",
cabinClass: "Economy",
},
{
id: "seat-11D",
label: "11D",
row: 11,
position: "D",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-11E",
label: "11E",
row: 11,
position: "E",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-11F",
label: "11F",
row: 11,
position: "F",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-12A",
label: "12A",
row: 12,
position: "A",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-12B",
label: "12B",
row: 12,
position: "B",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-12C",
label: "12C",
row: 12,
position: "C",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-12D",
label: "12D",
row: 12,
position: "D",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-12E",
label: "12E",
row: 12,
position: "E",
status: "available",
cabinClass: "Economy",
},
{
id: "seat-12F",
label: "12F",
row: 12,
position: "F",
status: "available",
cabinClass: "Economy",
},
];

export const checkInBaggage: BaggageOption[] = [
{
id: "cabin-bag",
name: "Cabin Bag",
description: "Standard cabin baggage allowance",
included: true,
weight: 7,
weightUnit: "kg",
maxQuantity: 1,
},
{
id: "checked-bag",
name: "Checked Bag",
description: "Additional checked baggage",
price: 75,
currency: "USD",
weight: 23,
weightUnit: "kg",
maxQuantity: 2,
},
];
