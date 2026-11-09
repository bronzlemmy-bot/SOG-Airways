export type StaffStatus = "active" | "inactive" | "suspended";

export type StaffRole =
  | "super-admin"
  | "admin"
  | "manager"
  | "flight-operations"
  | "customer-service"
  | "finance"
  | "hr"
  | "support"
  | "staff";

export type StaffDepartment =
  | "Administration"
  | "Flight Operations"
  | "Customer Service"
  | "Finance"
  | "Human Resources"
  | "IT & Support"
  | "Airport Operations";

export type StaffLocation =
  | "Lagos"
  | "Abuja"
  | "Port Harcourt"
  | "London"
  | "Accra"
  | "Dubai";

export type StaffPermission =
  | "dashboard"
  | "bookings"
  | "passengers"
  | "flights"
  | "payments"
  | "reports"
  | "staff"
  | "settings"
  | "support";

export interface AdminStaff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: StaffDepartment;
  status: StaffStatus;
  location: StaffLocation;
  joinedDate: string;
  lastActive: string;
  avatar: string;
  permissions: StaffPermission[];
}

export interface StaffFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  staffId: string;
  role: StaffRole;
  department: StaffDepartment;
  location: StaffLocation;
  status: StaffStatus;
  permissions: StaffPermission[];
}

export const staffRoleOptions: {
  value: StaffRole;
  label: string;
}[] = [
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "flight-operations", label: "Flight Operations" },
  { value: "customer-service", label: "Customer Service" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "support", label: "Support" },
  { value: "staff", label: "Staff" },
];

export const staffDepartmentOptions: {
  value: StaffDepartment;
  label: string;
}[] = [
  { value: "Administration", label: "Administration" },
  { value: "Flight Operations", label: "Flight Operations" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Finance", label: "Finance" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "IT & Support", label: "IT & Support" },
  { value: "Airport Operations", label: "Airport Operations" },
];

export const staffLocationOptions: {
  value: StaffLocation;
  label: string;
}[] = [
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Port Harcourt", label: "Port Harcourt" },
  { value: "London", label: "London" },
  { value: "Accra", label: "Accra" },
  { value: "Dubai", label: "Dubai" },
];

export const staffStatusOptions: {
  value: StaffStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export const staffPermissionOptions: {
  value: StaffPermission;
  label: string;
}[] = [
  { value: "dashboard", label: "Dashboard" },
  { value: "bookings", label: "Bookings" },
  { value: "passengers", label: "Passengers" },
  { value: "flights", label: "Flights" },
  { value: "payments", label: "Payments" },
  { value: "reports", label: "Reports" },
  { value: "staff", label: "Staff Management" },
  { value: "settings", label: "Settings" },
  { value: "support", label: "Support" },
];

export const adminStaffData: AdminStaff[] = [
  {
    id: "staff-001",
    staffId: "SOG-ADM-001",
    firstName: "David",
    lastName: "Okafor",
    email: "david.okafor@sogairways.com",
    phone: "+234 803 456 1201",
    role: "super-admin",
    department: "Administration",
    status: "active",
    location: "Lagos",
    joinedDate: "2024-02-12",
    lastActive: "2026-09-27T08:42:00",
    avatar: "",
    permissions: [
      "dashboard",
      "bookings",
      "passengers",
      "flights",
      "payments",
      "reports",
      "staff",
      "settings",
      "support",
    ],
  },
  {
    id: "staff-002",
    staffId: "SOG-MGR-002",
    firstName: "Amara",
    lastName: "Eze",
    email: "amara.eze@sogairways.com",
    phone: "+234 805 321 7742",
    role: "manager",
    department: "Airport Operations",
    status: "active",
    location: "Abuja",
    joinedDate: "2024-06-18",
    lastActive: "2026-09-27T07:58:00",
    avatar: "",
    permissions: [
      "dashboard",
      "bookings",
      "passengers",
      "flights",
      "reports",
    ],
  },
  {
    id: "staff-003",
    staffId: "SOG-FLT-003",
    firstName: "Michael",
    lastName: "Adeyemi",
    email: "michael.adeyemi@sogairways.com",
    phone: "+234 807 112 9084",
    role: "flight-operations",
    department: "Flight Operations",
    status: "active",
    location: "Lagos",
    joinedDate: "2025-01-09",
    lastActive: "2026-09-27T08:15:00",
    avatar: "",
    permissions: [
      "dashboard",
      "flights",
      "bookings",
      "passengers",
    ],
  },
  {
    id: "staff-004",
    staffId: "SOG-CS-004",
    firstName: "Grace",
    lastName: "Williams",
    email: "grace.williams@sogairways.com",
    phone: "+234 809 645 3321",
    role: "customer-service",
    department: "Customer Service",
    status: "active",
    location: "Port Harcourt",
    joinedDate: "2025-03-22",
    lastActive: "2026-09-27T06:44:00",
    avatar: "",
    permissions: [
      "dashboard",
      "bookings",
      "passengers",
    ],
  },
  {
    id: "staff-005",
    staffId: "SOG-FIN-005",
    firstName: "Daniel",
    lastName: "Ibrahim",
    email: "daniel.ibrahim@sogairways.com",
    phone: "+234 806 884 1902",
    role: "finance",
    department: "Finance",
    status: "active",
    location: "Lagos",
    joinedDate: "2024-11-05",
    lastActive: "2026-09-27T08:03:00",
    avatar: "",
    permissions: [
      "dashboard",
      "payments",
      "reports",
    ],
  },
  {
    id: "staff-006",
    staffId: "SOG-HR-006",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@sogairways.com",
    phone: "+234 810 274 5510",
    role: "hr",
    department: "Human Resources",
    status: "active",
    location: "Lagos",
    joinedDate: "2025-02-14",
    lastActive: "2026-09-26T17:35:00",
    avatar: "",
    permissions: [
      "dashboard",
      "staff",
    ],
  },
  {
    id: "staff-007",
    staffId: "SOG-SPT-007",
    firstName: "Emeka",
    lastName: "Nwosu",
    email: "emeka.nwosu@sogairways.com",
    phone: "+234 811 523 7614",
    role: "support",
    department: "IT & Support",
    status: "inactive",
    location: "Accra",
    joinedDate: "2025-05-30",
    lastActive: "2026-09-20T14:21:00",
    avatar: "",
    permissions: [
      "dashboard",
      "bookings",
      "passengers",
      "support",
    ],
  },
  {
    id: "staff-008",
    staffId: "SOG-ADM-008",
    firstName: "Fatima",
    lastName: "Bello",
    email: "fatima.bello@sogairways.com",
    phone: "+234 813 746 2055",
    role: "admin",
    department: "Administration",
    status: "suspended",
    location: "London",
    joinedDate: "2024-09-11",
    lastActive: "2026-09-18T11:47:00",
    avatar: "",
    permissions: [
      "dashboard",
      "bookings",
      "passengers",
      "flights",
      "reports",
    ],
  },
];

export const defaultStaffFormValues: StaffFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  staffId: "",
  role: "staff",
  department: "Customer Service",
  location: "Lagos",
  status: "active",
  permissions: ["dashboard"],
};

export const getStaffFullName = (staff: AdminStaff): string => {
  return `${staff.firstName} ${staff.lastName}`;
};

export const getStaffRoleLabel = (role: StaffRole): string => {
  return (
    staffRoleOptions.find((option) => option.value === role)?.label ?? role
  );
};

export const getStaffStatusLabel = (status: StaffStatus): string => {
  return (
    staffStatusOptions.find((option) => option.value === status)?.label ??
    status
  );
};

export const getStaffById = (
  staffId: string,
): AdminStaff | undefined => {
  return adminStaffData.find((staff) => staff.id === staffId);
};

export const getStaffInitials = (staff: AdminStaff): string => {
  return `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`.toUpperCase();
};