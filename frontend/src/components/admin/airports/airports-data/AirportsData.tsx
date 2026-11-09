export type AirportStatus =
| "operational"
| "limited"
| "closed";

export type AirportType =
| "international"
| "domestic"
| "regional";

export interface Airport {
id: string;
name: string;
code: string;
city: string;
country: string;
countryCode: string;
airportType: AirportType;
status: AirportStatus;
terminalCount: number;
runwayCount: number;
gateCount: number;
passengerCapacity: number;
annualPassengers: number;
operatingHours: string;
timezone: string;
latitude: number;
longitude: number;
airlineCount: number;
flightCount: number;
createdAt: string;
updatedAt: string;
}

export interface AirportSummary {
id: string;
label: string;
value: string;
description: string;
type:
| "total"
| "operational"
| "limited"
| "closed";
}

export const airportsData: Airport[] = [
{
id: "airport-los",
name: "Murtala Muhammed International Airport",
code: "LOS",
city: "Lagos",
country: "Nigeria",
countryCode: "NG",
airportType: "international",
status: "operational",
terminalCount: 2,
runwayCount: 2,
gateCount: 36,
passengerCapacity: 7000000,
annualPassengers: 7000000,
operatingHours: "24 hours",
timezone: "Africa/Lagos",
latitude: 6.5774,
longitude: 3.3212,
airlineCount: 28,
flightCount: 184,
createdAt: "2025-01-12",
updatedAt: "2026-08-15",
},
{
id: "airport-abv",
name: "Nnamdi Azikiwe International Airport",
code: "ABV",
city: "Abuja",
country: "Nigeria",
countryCode: "NG",
airportType: "international",
status: "operational",
terminalCount: 2,
runwayCount: 2,
gateCount: 24,
passengerCapacity: 5000000,
annualPassengers: 4500000,
operatingHours: "24 hours",
timezone: "Africa/Lagos",
latitude: 9.0068,
longitude: 7.2632,
airlineCount: 22,
flightCount: 142,
createdAt: "2025-01-18",
updatedAt: "2026-08-11",
},
{
id: "airport-phc",
name: "Port Harcourt International Airport",
code: "PHC",
city: "Port Harcourt",
country: "Nigeria",
countryCode: "NG",
airportType: "international",
status: "operational",
terminalCount: 1,
runwayCount: 1,
gateCount: 16,
passengerCapacity: 3000000,
annualPassengers: 2600000,
operatingHours: "06:00 - 22:00",
timezone: "Africa/Lagos",
latitude: 5.0155,
longitude: 6.9496,
airlineCount: 15,
flightCount: 86,
createdAt: "2025-02-03",
updatedAt: "2026-07-28",
},
{
id: "airport-kan",
name: "Mallam Aminu Kano International Airport",
code: "KAN",
city: "Kano",
country: "Nigeria",
countryCode: "NG",
airportType: "international",
status: "limited",
terminalCount: 1,
runwayCount: 1,
gateCount: 12,
passengerCapacity: 1800000,
annualPassengers: 1200000,
operatingHours: "07:00 - 21:00",
timezone: "Africa/Lagos",
latitude: 12.0476,
longitude: 8.5246,
airlineCount: 9,
flightCount: 54,
createdAt: "2025-02-17",
updatedAt: "2026-07-19",
},
{
id: "airport-acc",
name: "Kotoka International Airport",
code: "ACC",
city: "Accra",
country: "Ghana",
countryCode: "GH",
airportType: "international",
status: "operational",
terminalCount: 2,
runwayCount: 1,
gateCount: 23,
passengerCapacity: 5500000,
annualPassengers: 4300000,
operatingHours: "24 hours",
timezone: "Africa/Accra",
latitude: 5.6052,
longitude: -0.1668,
airlineCount: 24,
flightCount: 118,
createdAt: "2025-03-01",
updatedAt: "2026-08-04",
},
{
id: "airport-dxb",
name: "Dubai International Airport",
code: "DXB",
city: "Dubai",
country: "United Arab Emirates",
countryCode: "AE",
airportType: "international",
status: "operational",
terminalCount: 3,
runwayCount: 2,
gateCount: 89,
passengerCapacity: 90000000,
annualPassengers: 86800000,
operatingHours: "24 hours",
timezone: "Asia/Dubai",
latitude: 25.2532,
longitude: 55.3657,
airlineCount: 91,
flightCount: 312,
createdAt: "2025-03-15",
updatedAt: "2026-08-20",
},
{
id: "airport-lhr",
name: "London Heathrow Airport",
code: "LHR",
city: "London",
country: "United Kingdom",
countryCode: "GB",
airportType: "international",
status: "operational",
terminalCount: 4,
runwayCount: 2,
gateCount: 66,
passengerCapacity: 90000000,
annualPassengers: 83400000,
operatingHours: "06:00 - 23:00",
timezone: "Europe/London",
latitude: 51.4706,
longitude: -0.4619,
airlineCount: 84,
flightCount: 286,
createdAt: "2025-04-02",
updatedAt: "2026-08-18",
},
{
id: "airport-jfk",
name: "John F. Kennedy International Airport",
code: "JFK",
city: "New York",
country: "United States",
countryCode: "US",
airportType: "international",
status: "operational",
terminalCount: 5,
runwayCount: 4,
gateCount: 128,
passengerCapacity: 75000000,
annualPassengers: 62500000,
operatingHours: "24 hours",
timezone: "America/New_York",
latitude: 40.6413,
longitude: -73.7781,
airlineCount: 76,
flightCount: 264,
createdAt: "2025-04-16",
updatedAt: "2026-08-22",
},
];

export const airportSummary: AirportSummary[] = [
{
id: "total-airports",
label: "Total Airports",
value: String(airportsData.length),
description: "Airports currently managed by SOG Airways.",
type: "total",
},
{
id: "operational-airports",
label: "Operational",
value: String(
airportsData.filter(
(airport) => airport.status === "operational",
).length,
),
description: "Airports currently operating normally.",
type: "operational",
},
{
id: "limited-airports",
label: "Limited Operations",
value: String(
airportsData.filter(
(airport) => airport.status === "limited",
).length,
),
description: "Airports operating with current restrictions.",
type: "limited",
},
{
id: "closed-airports",
label: "Closed",
value: String(
airportsData.filter(
(airport) => airport.status === "closed",
).length,
),
description: "Airports currently unavailable for operations.",
type: "closed",
},
];
