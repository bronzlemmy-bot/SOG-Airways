export type StaffStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "on-leave";

export type StaffRole =
  | "admin"
  | "manager"
  | "agent"
  | "customer-service"
  | "flight-operations"
  | "finance"
  | "support"
  | "staff";

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "temporary";

export interface Staff {
  id: string;
  employeeNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  position: string;
  employmentType: EmploymentType;
  status: StaffStatus;
  avatarUrl?: string;
  location?: string;
  hireDate?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}