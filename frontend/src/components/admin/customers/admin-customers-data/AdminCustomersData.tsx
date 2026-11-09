export type AdminCustomerStatus =
| "active"
| "inactive"
| "suspended";

export type AdminCustomerTier =
| "standard"
| "silver"
| "gold"
| "platinum";

export type AdminCustomerGender =
| "male"
| "female"
| "other";

export interface AdminCustomer {
id: string;
customerReference: string;
firstName: string;
lastName: string;
email: string;
phone: string;
nationality: string;
countryCode: string;
gender: AdminCustomerGender;
dateOfBirth: string;
customerTier: AdminCustomerTier;
status: AdminCustomerStatus;
totalBookings: number;
completedBookings: number;
cancelledBookings: number;
totalSpent: number;
currency: string;
lastBookingDate?: string;
joinedDate: string;
lastUpdated: string;
}

export interface AdminCustomerSummary {
id: string;
label: string;
value: string;
description: string;
type:
| "total"
| "active"
| "inactive"
| "suspended"
| "revenue";
}

export const adminCustomersData: AdminCustomer[] = [
{
id: "customer-001",
customerReference: "SOG-CUS-1001",
firstName: "Daniel",
lastName: "Adeyemi",
email: "[daniel.adeyemi@example.com](mailto:daniel.adeyemi@example.com)",
phone: "+234 803 456 7812",
nationality: "Nigerian",
countryCode: "NG",
gender: "male",
dateOfBirth: "1990-05-14",
customerTier: "gold",
status: "active",
totalBookings: 18,
completedBookings: 16,
cancelledBookings: 1,
totalSpent: 4850000,
currency: "NGN",
lastBookingDate: "2026-09-18",
joinedDate: "2023-04-12",
lastUpdated: "2026-09-18",
},
{
id: "customer-002",
customerReference: "SOG-CUS-1002",
firstName: "Amaka",
lastName: "Okafor",
email: "[amaka.okafor@example.com](mailto:amaka.okafor@example.com)",
phone: "+234 806 234 5190",
nationality: "Nigerian",
countryCode: "NG",
gender: "female",
dateOfBirth: "1994-08-22",
customerTier: "platinum",
status: "active",
totalBookings: 27,
completedBookings: 25,
cancelledBookings: 1,
totalSpent: 7925000,
currency: "NGN",
lastBookingDate: "2026-09-21",
joinedDate: "2022-11-08",
lastUpdated: "2026-09-21",
},
{
id: "customer-003",
customerReference: "SOG-CUS-1003",
firstName: "Michael",
lastName: "Johnson",
email: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
phone: "+44 7700 900123",
nationality: "British",
countryCode: "GB",
gender: "male",
dateOfBirth: "1987-02-11",
customerTier: "silver",
status: "active",
totalBookings: 9,
completedBookings: 8,
cancelledBookings: 0,
totalSpent: 3180000,
currency: "NGN",
lastBookingDate: "2026-08-30",
joinedDate: "2024-01-19",
lastUpdated: "2026-08-30",
},
{
id: "customer-004",
customerReference: "SOG-CUS-1004",
firstName: "Fatima",
lastName: "Bello",
email: "[fatima.bello@example.com](mailto:fatima.bello@example.com)",
phone: "+234 809 781 2345",
nationality: "Nigerian",
countryCode: "NG",
gender: "female",
dateOfBirth: "1992-11-03",
customerTier: "gold",
status: "active",
totalBookings: 14,
completedBookings: 12,
cancelledBookings: 1,
totalSpent: 4260000,
currency: "NGN",
lastBookingDate: "2026-09-10",
joinedDate: "2023-09-04",
lastUpdated: "2026-09-10",
},
{
id: "customer-005",
customerReference: "SOG-CUS-1005",
firstName: "David",
lastName: "Williams",
email: "[david.williams@example.com](mailto:david.williams@example.com)",
phone: "+1 202 555 0184",
nationality: "American",
countryCode: "US",
gender: "male",
dateOfBirth: "1984-06-27",
customerTier: "platinum",
status: "active",
totalBookings: 31,
completedBookings: 29,
cancelledBookings: 1,
totalSpent: 12650000,
currency: "NGN",
lastBookingDate: "2026-09-24",
joinedDate: "2021-06-15",
lastUpdated: "2026-09-24",
},
{
id: "customer-006",
customerReference: "SOG-CUS-1006",
firstName: "Grace",
lastName: "Eze",
email: "[grace.eze@example.com](mailto:grace.eze@example.com)",
phone: "+234 805 642 1987",
nationality: "Nigerian",
countryCode: "NG",
gender: "female",
dateOfBirth: "1997-01-18",
customerTier: "standard",
status: "inactive",
totalBookings: 4,
completedBookings: 3,
cancelledBookings: 1,
totalSpent: 1180000,
currency: "NGN",
lastBookingDate: "2025-12-18",
joinedDate: "2024-07-21",
lastUpdated: "2025-12-18",
},
{
id: "customer-007",
customerReference: "SOG-CUS-1007",
firstName: "Ibrahim",
lastName: "Musa",
email: "[ibrahim.musa@example.com](mailto:ibrahim.musa@example.com)",
phone: "+234 812 345 6701",
nationality: "Nigerian",
countryCode: "NG",
gender: "male",
dateOfBirth: "1989-09-09",
customerTier: "silver",
status: "suspended",
totalBookings: 7,
completedBookings: 5,
cancelledBookings: 2,
totalSpent: 2140000,
currency: "NGN",
lastBookingDate: "2026-05-11",
joinedDate: "2023-12-02",
lastUpdated: "2026-05-11",
},
{
id: "customer-008",
customerReference: "SOG-CUS-1008",
firstName: "Sofia",
lastName: "Martinez",
email: "[sofia.martinez@example.com](mailto:sofia.martinez@example.com)",
phone: "+34 612 345 789",
nationality: "Spanish",
countryCode: "ES",
gender: "female",
dateOfBirth: "1995-04-30",
customerTier: "gold",
status: "active",
totalBookings: 12,
completedBookings: 11,
cancelledBookings: 0,
totalSpent: 3985000,
currency: "NGN",
lastBookingDate: "2026-09-03",
joinedDate: "2023-02-17",
lastUpdated: "2026-09-03",
},
];

export const adminCustomerSummary: AdminCustomerSummary[] = [
{
id: "total",
label: "Total Customers",
value: adminCustomersData.length.toString(),
description: "All registered customers",
type: "total",
},
{
id: "active",
label: "Active",
value: adminCustomersData
.filter((customer) => customer.status === "active")
.length.toString(),
description: "Currently active customers",
type: "active",
},
{
id: "inactive",
label: "Inactive",
value: adminCustomersData
.filter((customer) => customer.status === "inactive")
.length.toString(),
description: "Customers currently inactive",
type: "inactive",
},
{
id: "suspended",
label: "Suspended",
value: adminCustomersData
.filter((customer) => customer.status === "suspended")
.length.toString(),
description: "Customers with restricted accounts",
type: "suspended",
},
{
id: "revenue",
label: "Customer Revenue",
value: new Intl.NumberFormat("en-US", {
style: "currency",
currency: "NGN",
maximumFractionDigits: 0,
}).format(
adminCustomersData.reduce(
(total, customer) => total + customer.totalSpent,
0,
),
),
description: "Total customer spending",
type: "revenue",
},
];
