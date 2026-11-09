export type PaymentStatus =
  | "completed"
  | "successful"
  | "pending"
  | "processing"
  | "failed"
  | "refunded"
  | "partially-refunded"
  | "cancelled";

export type PaymentMethod =
  | "card"
  | "bank-transfer"
  | "paypal"
  | "wallet"
  | "cash"
  | "mobile-money"
  | "other";

export type PassengerGender =
  | "male"
  | "female"
  | "other";

export type PassengerStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended";

export interface AdminPassenger {
  id: string;
  passengerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: PassengerGender;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  status: PassengerStatus;
  totalBookings: number;
  totalTrips: number;
  lastTrip: string | null;
  registeredAt: string;
  updatedAt: string;
}
export const adminPassengerData: AdminPassenger[] = [
{
id: "1",
passengerId: "PSG-0001",
firstName: "John",
lastName: "Adeyemi",
email: "[john.adeyemi@example.com](mailto:john.adeyemi@example.com)",
phone: "+234 803 123 4567",
gender: "male",
dateOfBirth: "1992-05-14",
nationality: "Nigerian",
passportNumber: "A12345678",
passportExpiry: "2028-05-14",
status: "active",
totalBookings: 12,
totalTrips: 9,
lastTrip: "2026-08-21",
registeredAt: "2025-01-15",
updatedAt: "2026-08-21",
},
{
id: "2",
passengerId: "PSG-0002",
firstName: "Sarah",
lastName: "Williams",
email: "[sarah.williams@example.com](mailto:sarah.williams@example.com)",
phone: "+44 7700 900123",
gender: "female",
dateOfBirth: "1989-11-02",
nationality: "British",
passportNumber: "GB987654321",
passportExpiry: "2029-11-02",
status: "active",
totalBookings: 18,
totalTrips: 15,
lastTrip: "2026-09-03",
registeredAt: "2024-10-08",
updatedAt: "2026-09-03",
},
{
id: "3",
passengerId: "PSG-0003",
firstName: "David",
lastName: "Okafor",
email: "[david.okafor@example.com](mailto:david.okafor@example.com)",
phone: "+234 805 987 6543",
gender: "male",
dateOfBirth: "1996-02-18",
nationality: "Nigerian",
passportNumber: "B23456789",
passportExpiry: "2027-02-18",
status: "pending",
totalBookings: 4,
totalTrips: 2,
lastTrip: "2026-06-11",
registeredAt: "2026-01-22",
updatedAt: "2026-06-11",
},
{
id: "4",
passengerId: "PSG-0004",
firstName: "Amelia",
lastName: "Johnson",
email: "[amelia.johnson@example.com](mailto:amelia.johnson@example.com)",
phone: "+1 202 555 0184",
gender: "female",
dateOfBirth: "1991-08-27",
nationality: "American",
passportNumber: "US456789123",
passportExpiry: "2030-08-27",
status: "active",
totalBookings: 25,
totalTrips: 22,
lastTrip: "2026-09-15",
registeredAt: "2024-06-17",
updatedAt: "2026-09-15",
},
{
id: "5",
passengerId: "PSG-0005",
firstName: "Michael",
lastName: "Mensah",
email: "[michael.mensah@example.com](mailto:michael.mensah@example.com)",
phone: "+233 24 123 4567",
gender: "male",
dateOfBirth: "1987-12-09",
nationality: "Ghanaian",
passportNumber: "GHA7654321",
passportExpiry: "2027-12-09",
status: "inactive",
totalBookings: 8,
totalTrips: 6,
lastTrip: "2025-12-19",
registeredAt: "2024-12-01",
updatedAt: "2025-12-19",
},
{
id: "6",
passengerId: "PSG-0006",
firstName: "Grace",
lastName: "Okoro",
email: "[grace.okoro@example.com](mailto:grace.okoro@example.com)",
phone: "+234 812 345 6789",
gender: "female",
dateOfBirth: "1994-04-21",
nationality: "Nigerian",
passportNumber: "C34567890",
passportExpiry: "2029-04-21",
status: "active",
totalBookings: 16,
totalTrips: 13,
lastTrip: "2026-08-30",
registeredAt: "2025-03-12",
updatedAt: "2026-08-30",
},
{
id: "7",
passengerId: "PSG-0007",
firstName: "Daniel",
lastName: "Brown",
email: "[daniel.brown@example.com](mailto:daniel.brown@example.com)",
phone: "+1 415 555 0192",
gender: "male",
dateOfBirth: "1985-09-16",
nationality: "Canadian",
passportNumber: "CA112233445",
passportExpiry: "2028-09-16",
status: "suspended",
totalBookings: 10,
totalTrips: 7,
lastTrip: "2026-03-08",
registeredAt: "2024-08-29",
updatedAt: "2026-03-08",
},
{
id: "8",
passengerId: "PSG-0008",
firstName: "Sophia",
lastName: "Martins",
email: "[sophia.martins@example.com](mailto:sophia.martins@example.com)",
phone: "+351 912 345 678",
gender: "female",
dateOfBirth: "1998-06-12",
nationality: "Portuguese",
passportNumber: "PT998877665",
passportExpiry: "2030-06-12",
status: "active",
totalBookings: 7,
totalTrips: 5,
lastTrip: "2026-07-25",
registeredAt: "2025-07-04",
updatedAt: "2026-07-25",
},
];

export const getAdminPassengerFullName = (
passenger: AdminPassenger
): string => {
return `${passenger.firstName} ${passenger.lastName}`;
};

export const getAdminPassengerById = (
id: string
): AdminPassenger | undefined => {
return adminPassengerData.find(
(passenger) => passenger.id === id
);
};
