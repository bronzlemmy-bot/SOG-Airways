
import type { ProfileFormValues } from "../components/ProfileEditForm";
import type { ProfileAccountStatus } from "../components/ProfileHeader";
import type { ProfilePreferenceValues } from "../components/ProfilePreferences";

export interface ProfileDemoData {
  id: string;
  staffId: string;
  role: string;

  form: ProfileFormValues;
  avatarUrl: string | null;

  accountStatus: ProfileAccountStatus;
  memberSince: string;

  emailVerified: boolean;
  phoneVerified: boolean;

  twoFactorEnabled: boolean;
  lastPasswordChanged: string | null;
  lastSignIn: string | null;
  activeSessions: number;

  preferences: ProfilePreferenceValues;
}

export const profileDemoData: ProfileDemoData = {
  id: "demo-profile-001",
  staffId: "SOG-ADM-001",
  role: "Administrator",

  form: {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com",
    phone: "+2348000000000",
    dateOfBirth: "1990-06-15",
    gender: "prefer-not-to-say",
    address: "SOG Airways Headquarters",
    city: "Lagos",
    country: "Nigeria",
    postalCode: "100001",
  },

  avatarUrl: null,

  accountStatus: "active",
  memberSince: "2024-01-15T09:00:00.000Z",

  emailVerified: true,
  phoneVerified: true,

  twoFactorEnabled: false,
  lastPasswordChanged: "2026-08-15T10:30:00.000Z",
  lastSignIn: "2026-10-16T08:45:00.000Z",
  activeSessions: 2,

  preferences: {
    currency: "NGN",
    timeZone: "Africa/Lagos",
    language: "en",

    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,

    flightUpdates: true,
    promotionalEmails: false,
  },
};

/**
 * Returns a fresh copy of the demo profile for component state.
 * This keeps edits separate from the exported seed data.
 */
export function getProfileDemoData(): ProfileDemoData {
  return {
    ...profileDemoData,
    form: { ...profileDemoData.form },
    preferences: { ...profileDemoData.preferences },
  };
}
