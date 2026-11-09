export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "blocked";

export type UserRole =
  | "user"
  | "admin"
  | "staff";

export type UserGender =
  | "male"
  | "female"
  | "other"
  | "prefer-not-to-say";

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export interface UserProfile {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: UserGender;
  nationality?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  preferences: UserPreferences;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}