export type AircraftStatus =
| "active"
| "maintenance"
| "inactive";

export type AircraftType =
| "Airbus A320"
| "Airbus A321"
| "Airbus A330"
| "Boeing 737"
| "Boeing 787";

export interface Aircraft {
id: string;
registration: string;
aircraftType: AircraftType;
model: string;
manufacturer: "Airbus" | "Boeing";
airlineCode: string;
totalSeats: number;
economySeats: number;
premiumEconomySeats: number;
businessSeats: number;
firstClassSeats: number;
status: AircraftStatus;
currentAirport: string;
currentAirportCode: string;
nextFlight?: string;
nextFlightNumber?: string;
lastMaintenanceDate: string;
nextMaintenanceDate: string;
totalFlights: number;
totalFlightHours: number;
createdAt: string;
updatedAt: string;
}

export interface AircraftSummary {
id: string;
label: string;
value: string;
description: string;
type: "total" | "active" | "maintenance" | "inactive";
}

export const aircraftData: Aircraft[] = [
{
id: "aircraft-001",
registration: "5N-SOG1",
aircraftType: "Boeing 787",
model: "787-9 Dreamliner",
manufacturer: "Boeing",
airlineCode: "SOG",
totalSeats: 296,
economySeats: 210,
premiumEconomySeats: 36,
businessSeats: 42,
firstClassSeats: 8,
status: "active",
currentAirport: "Murtala Muhammed International Airport",
currentAirportCode: "LOS",
nextFlight: "Lagos → London",
nextFlightNumber: "SOG 214",
lastMaintenanceDate: "2026-08-14",
nextMaintenanceDate: "2026-11-14",
totalFlights: 1842,
totalFlightHours: 12864,
createdAt: "2024-02-12",
updatedAt: "2026-09-20",
},
{
id: "aircraft-002",
registration: "5N-SOG2",
aircraftType: "Airbus A330",
model: "A330-300",
manufacturer: "Airbus",
airlineCode: "SOG",
totalSeats: 277,
economySeats: 198,
premiumEconomySeats: 32,
businessSeats: 39,
firstClassSeats: 8,
status: "active",
currentAirport: "Dubai International Airport",
currentAirportCode: "DXB",
nextFlight: "Dubai → Lagos",
nextFlightNumber: "SOG 318",
lastMaintenanceDate: "2026-07-22",
nextMaintenanceDate: "2026-10-22",
totalFlights: 2156,
totalFlightHours: 15420,
createdAt: "2023-09-18",
updatedAt: "2026-09-19",
},
{
id: "aircraft-003",
registration: "5N-SOG3",
aircraftType: "Airbus A321",
model: "A321neo",
manufacturer: "Airbus",
airlineCode: "SOG",
totalSeats: 220,
economySeats: 168,
premiumEconomySeats: 24,
businessSeats: 28,
firstClassSeats: 0,
status: "active",
currentAirport: "Murtala Muhammed International Airport",
currentAirportCode: "LOS",
nextFlight: "Lagos → Accra",
nextFlightNumber: "SOG 108",
lastMaintenanceDate: "2026-08-30",
nextMaintenanceDate: "2026-11-30",
totalFlights: 1348,
totalFlightHours: 9340,
createdAt: "2024-05-09",
updatedAt: "2026-09-21",
},
{
id: "aircraft-004",
registration: "5N-SOG4",
aircraftType: "Boeing 737",
model: "737-800",
manufacturer: "Boeing",
airlineCode: "SOG",
totalSeats: 189,
economySeats: 153,
premiumEconomySeats: 12,
businessSeats: 24,
firstClassSeats: 0,
status: "maintenance",
currentAirport: "Nnamdi Azikiwe International Airport",
currentAirportCode: "ABV",
lastMaintenanceDate: "2026-09-18",
nextMaintenanceDate: "2026-09-30",
totalFlights: 2874,
totalFlightHours: 18420,
createdAt: "2022-11-16",
updatedAt: "2026-09-22",
},
{
id: "aircraft-005",
registration: "5N-SOG5",
aircraftType: "Airbus A320",
model: "A320neo",
manufacturer: "Airbus",
airlineCode: "SOG",
totalSeats: 186,
economySeats: 150,
premiumEconomySeats: 12,
businessSeats: 24,
firstClassSeats: 0,
status: "active",
currentAirport: "Kotoka International Airport",
currentAirportCode: "ACC",
nextFlight: "Accra → Lagos",
nextFlightNumber: "SOG 109",
lastMaintenanceDate: "2026-08-08",
nextMaintenanceDate: "2026-11-08",
totalFlights: 1657,
totalFlightHours: 11280,
createdAt: "2024-01-27",
updatedAt: "2026-09-18",
},
{
id: "aircraft-006",
registration: "5N-SOG6",
aircraftType: "Boeing 787",
model: "787-8 Dreamliner",
manufacturer: "Boeing",
airlineCode: "SOG",
totalSeats: 242,
economySeats: 172,
premiumEconomySeats: 30,
businessSeats: 32,
firstClassSeats: 8,
status: "inactive",
currentAirport: "Murtala Muhammed International Airport",
currentAirportCode: "LOS",
lastMaintenanceDate: "2026-06-12",
nextMaintenanceDate: "2026-09-28",
totalFlights: 3210,
totalFlightHours: 22640,
createdAt: "2021-06-04",
updatedAt: "2026-09-10",
},
];

export const aircraftSummary: AircraftSummary[] = [
{
id: "summary-total",
label: "Total Aircraft",
value: aircraftData.length.toString(),
description: "Aircraft registered in the SOG Airways fleet",
type: "total",
},
{
id: "summary-active",
label: "Active",
value: aircraftData
.filter((aircraft) => aircraft.status === "active")
.length.toString(),
description: "Aircraft currently available for operations",
type: "active",
},
{
id: "summary-maintenance",
label: "Maintenance",
value: aircraftData
.filter(
(aircraft) => aircraft.status === "maintenance",
)
.length.toString(),
description: "Aircraft currently undergoing maintenance",
type: "maintenance",
},
{
id: "summary-inactive",
label: "Inactive",
value: aircraftData
.filter(
(aircraft) => aircraft.status === "inactive",
)
.length.toString(),
description: "Aircraft currently not in operation",
type: "inactive",
},
];
