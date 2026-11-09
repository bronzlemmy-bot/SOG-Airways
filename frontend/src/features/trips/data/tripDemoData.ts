
import type { Trip } from "@/types";

/**
 * Temporary frontend demonstration data for Admin Trip Management.
 *
 * This data stays in memory. It is not saved to localStorage
 * and will later be replaced by the existing trip service/API.
 */
export const tripDemoData: Trip[] = [
  {
    id: "trip-demo-001",
    userId: "user-demo-101",
    bookingId: "booking-demo-001",
    bookingReference: "SOG8K2P",
    title: "Business trip to London",
    type: "round-trip",
    status: "upcoming",
    destination: "London, United Kingdom",
    passengerCount: 2,
    startDate: "2026-11-12",
    endDate: "2026-11-20",
    createdAt: "2026-09-20T09:30:00.000Z",
    updatedAt: "2026-09-22T11:15:00.000Z",
    segments: [
      {
        id: "segment-demo-001-a",
        flightId: "flight-demo-101",
        flightNumber: "SOG204",
        departureAirportId: "airport-demo-los",
        departureAirportCode: "LOS",
        departureAirportName:
          "Murtala Muhammed International Airport",
        arrivalAirportId: "airport-demo-lhr",
        arrivalAirportCode: "LHR",
        arrivalAirportName: "London Heathrow Airport",
        departureDate: "2026-11-12",
        departureTime: "10:30",
        arrivalDate: "2026-11-12",
        arrivalTime: "16:20",
        status: "upcoming",
      },
      {
        id: "segment-demo-001-b",
        flightId: "flight-demo-102",
        flightNumber: "SOG205",
        departureAirportId: "airport-demo-lhr",
        departureAirportCode: "LHR",
        departureAirportName: "London Heathrow Airport",
        arrivalAirportId: "airport-demo-los",
        arrivalAirportCode: "LOS",
        arrivalAirportName:
          "Murtala Muhammed International Airport",
        departureDate: "2026-11-20",
        departureTime: "09:15",
        arrivalDate: "2026-11-20",
        arrivalTime: "15:05",
        status: "upcoming",
      },
    ],
  },
  {
    id: "trip-demo-002",
    userId: "user-demo-102",
    bookingId: "booking-demo-002",
    bookingReference: "SOG4M7Q",
    title: "Accra connecting journey",
    type: "one-way",
    status: "in-progress",
    destination: "Accra, Ghana",
    passengerCount: 1,
    startDate: "2026-10-17",
    endDate: "2026-10-17",
    createdAt: "2026-09-28T14:00:00.000Z",
    updatedAt: "2026-10-17T08:00:00.000Z",
    segments: [
      {
        id: "segment-demo-002-a",
        flightId: "flight-demo-201",
        flightNumber: "SOG310",
        departureAirportId: "airport-demo-los",
        departureAirportCode: "LOS",
        departureAirportName:
          "Murtala Muhammed International Airport",
        arrivalAirportId: "airport-demo-acc",
        arrivalAirportCode: "ACC",
        arrivalAirportName:
          "Kotoka International Airport",
        departureDate: "2026-10-17",
        departureTime: "08:00",
        arrivalDate: "2026-10-17",
        arrivalTime: "08:55",
        status: "in-progress",
      },
    ],
  },
  {
    id: "trip-demo-003",
    userId: "user-demo-103",
    bookingId: "booking-demo-003",
    bookingReference: "SOG6R9W",
    title: "European city tour",
    type: "multi-city",
    status: "completed",
    destination: "Paris, France",
    passengerCount: 3,
    startDate: "2026-09-05",
    endDate: "2026-09-15",
    createdAt: "2026-08-10T10:45:00.000Z",
    updatedAt: "2026-09-15T18:20:00.000Z",
    segments: [
      {
        id: "segment-demo-003-a",
        flightId: "flight-demo-301",
        flightNumber: "SOG410",
        departureAirportId: "airport-demo-los",
        departureAirportCode: "LOS",
        departureAirportName:
          "Murtala Muhammed International Airport",
        arrivalAirportId: "airport-demo-cdg",
        arrivalAirportCode: "CDG",
        arrivalAirportName:
          "Paris Charles de Gaulle Airport",
        departureDate: "2026-09-05",
        departureTime: "09:15",
        arrivalDate: "2026-09-05",
        arrivalTime: "16:30",
        status: "completed",
      },
      {
        id: "segment-demo-003-b",
        flightId: "flight-demo-302",
        flightNumber: "SOG520",
        departureAirportId: "airport-demo-cdg",
        departureAirportCode: "CDG",
        departureAirportName:
          "Paris Charles de Gaulle Airport",
        arrivalAirportId: "airport-demo-fco",
        arrivalAirportCode: "FCO",
        arrivalAirportName:
          "Leonardo da Vinci–Fiumicino Airport",
        departureDate: "2026-09-09",
        departureTime: "11:20",
        arrivalDate: "2026-09-09",
        arrivalTime: "13:25",
        status: "completed",
      },
      {
        id: "segment-demo-003-c",
        flightId: "flight-demo-303",
        flightNumber: "SOG615",
        departureAirportId: "airport-demo-fco",
        departureAirportCode: "FCO",
        departureAirportName:
          "Leonardo da Vinci–Fiumicino Airport",
        arrivalAirportId: "airport-demo-los",
        arrivalAirportCode: "LOS",
        arrivalAirportName:
          "Murtala Muhammed International Airport",
        departureDate: "2026-09-15",
        departureTime: "12:00",
        arrivalDate: "2026-09-15",
        arrivalTime: "17:30",
        status: "completed",
      },
    ],
  },
  {
    id: "trip-demo-004",
    userId: "user-demo-104",
    bookingId: "booking-demo-004",
    bookingReference: "SOG2B5N",
    title: "Cancelled Johannesburg visit",
    type: "one-way",
    status: "cancelled",
    destination: "Johannesburg, South Africa",
    passengerCount: 1,
    startDate: "2026-11-03",
    endDate: "2026-11-03",
    createdAt: "2026-09-18T12:10:00.000Z",
    updatedAt: "2026-10-02T16:40:00.000Z",
    segments: [
      {
        id: "segment-demo-004-a",
        flightId: "flight-demo-401",
        flightNumber: "SOG720",
        departureAirportId: "airport-demo-los",
        departureAirportCode: "LOS",
        departureAirportName:
          "Murtala Muhammed International Airport",
        arrivalAirportId: "airport-demo-jnb",
        arrivalAirportCode: "JNB",
        arrivalAirportName:
          "O. R. Tambo International Airport",
        departureDate: "2026-11-03",
        departureTime: "08:45",
        arrivalDate: "2026-11-03",
        arrivalTime: "14:20",
        status: "cancelled",
      },
    ],
  },
  {
    id: "trip-demo-005",
    userId: "user-demo-105",
    bookingId: "booking-demo-005",
    bookingReference: "SOG9C3L",
    title: "Upcoming trip to Nairobi",
    type: "one-way",
    status: "upcoming",
    destination: "Nairobi, Kenya",
    passengerCount: 4,
    startDate: "2026-12-06",
    endDate: "2026-12-06",
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-03T13:25:00.000Z",
    segments: [
      {
        id: "segment-demo-005-a",
        flightId: "flight-demo-501",
        flightNumber: "SOG830",
        departureAirportId: "airport-demo-los",
        departureAirportCode: "LOS",
        departureAirportName:
          "Murtala Muhammed International Airport",
        arrivalAirportId: "airport-demo-nbo",
        arrivalAirportCode: "NBO",
        arrivalAirportName:
          "Jomo Kenyatta International Airport",
        departureDate: "2026-12-06",
        departureTime: "07:30",
        arrivalDate: "2026-12-06",
        arrivalTime: "13:10",
        status: "upcoming",
      },
    ],
  },
];

/**
 * Returns fresh objects for React state so editing a demo trip
 * does not mutate the shared seed records.
 */
export function getTripDemoData(): Trip[] {
  return tripDemoData.map((trip) => ({
    ...trip,
    segments: trip.segments.map((segment) => ({
      ...segment,
    })),
  }));
}
