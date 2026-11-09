
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { ApiError } from "@/services/api";
import { authService } from "@/services/authService";
import {
  customerService,
  type CustomerSelfProfile,
} from "@/services/customerService";
import { staffService } from "@/services/staffService";
import type { AuthUserSummary, ChangePasswordData, Staff } from "@/types";

import ProfileActions from "./components/ProfileActions";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileEditForm, {
  type ProfileFormErrors,
  type ProfileFormValues,
} from "./components/ProfileEditForm";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInformation from "./components/ProfileInformation";
import ProfilePasswordForm, {
  type ProfilePasswordValues,
} from "./components/ProfilePasswordForm";
import ProfilePreferences, {
  type ProfilePreferenceOption,
  type ProfilePreferenceValues,
} from "./components/ProfilePreferences";
import ProfileSecurity from "./components/ProfileSecurity";
import ProfileSummary from "./components/ProfileSummary";

import {
  getProfileDemoData,
  type ProfileDemoData,
} from "./data/profileDemoData";

type ProfileTab = "overview" | "preferences" | "security" | "password";
type ProfileDataSource = "demo" | "user" | "staff";

interface ProfileFeatureProps {
  currencyOptions?: ProfilePreferenceOption[];
  timeZoneOptions?: ProfilePreferenceOption[];
  languageOptions?: ProfilePreferenceOption[];
}

const fallbackCurrencyOptions: ProfilePreferenceOption[] = [
  { value: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "INR", label: "Indian Rupee", symbol: "₹" },
  { value: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { value: "ZAR", label: "South African Rand", symbol: "R" },
  { value: "KES", label: "Kenyan Shilling", symbol: "KSh" },
  { value: "GHS", label: "Ghanaian Cedi", symbol: "GH₵" },
];

const fallbackTimeZoneOptions: ProfilePreferenceOption[] = [
  { value: "Africa/Lagos", label: "Lagos, Nigeria (WAT)" },
  { value: "Africa/Accra", label: "Accra, Ghana (GMT)" },
  {
    value: "Africa/Johannesburg",
    label: "Johannesburg, South Africa",
  },
  { value: "Europe/London", label: "London, United Kingdom" },
  { value: "Europe/Paris", label: "Paris, France" },
  { value: "Europe/Berlin", label: "Berlin, Germany" },
  { value: "America/New_York", label: "New York, USA" },
  { value: "America/Los_Angeles", label: "Los Angeles, USA" },
  { value: "America/Toronto", label: "Toronto, Canada" },
  { value: "America/Sao_Paulo", label: "São Paulo, Brazil" },
  { value: "Asia/Dubai", label: "Dubai, UAE" },
  { value: "Asia/Kolkata", label: "Kolkata, India" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo, Japan" },
  { value: "Australia/Sydney", label: "Sydney, Australia" },
  { value: "Pacific/Auckland", label: "Auckland, New Zealand" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
];

const profileTabs: {
  id: ProfileTab;
  label: string;
  icon: typeof UserRound;
}[] = [
  { id: "overview", label: "Profile", icon: UserRound },
  {
    id: "preferences",
    label: "Preferences",
    icon: SlidersHorizontal,
  },
  { id: "security", label: "Security", icon: ShieldCheck },
];

function validateProfile(
  values: ProfileFormValues,
): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (values.dateOfBirth) {
    const date = new Date(`${values.dateOfBirth}T00:00:00`);

    if (
      Number.isNaN(date.getTime()) ||
      date.getTime() > new Date().getTime()
    ) {
      errors.dateOfBirth =
        "Enter a valid date that is not in the future.";
    }
  }

  return errors;
}

function getRoleLabel(role: AuthUserSummary["role"]): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "staff":
      return "Staff";
    default:
      return "Customer";
  }
}

function getAccountStatus(
  user: AuthUserSummary,
  staff: Staff | null,
): ProfileDemoData["accountStatus"] {
  if (user.status !== "active") {
    return "inactive";
  }

  if (staff && staff.status !== "active") {
    return "inactive";
  }

  return "active";
}

/**
 * Resolve the matching Staff record using the signed-in user's email.
 *
 * The Staff ID and User ID may be different, so the email is checked
 * before accepting an ID-based lookup.
 */
async function findStaffRecord(user: AuthUserSummary): Promise<Staff | null> {
  if (user.role !== "admin" && user.role !== "staff") {
    return null;
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  try {
    const results = await staffService.getStaffByFilters({
      search: user.email,
      limit: 10,
    });

    const match = results.find(
      (staff) =>
        staff.email.trim().toLowerCase() === normalizedEmail,
    );

    if (match) {
      return match;
    }
  } catch {
    // Fall back to an ID lookup if the filtered request is unavailable.
  }

  try {
    const staff = await staffService.getStaffById(user.id);

    if (
      staff.email.trim().toLowerCase() === normalizedEmail
    ) {
      return staff;
    }
  } catch {
    // No matching Staff record is available.
  }

  return null;
}

/**
 * Adapt the shared User and Staff models to the existing Profile UI.
 *
 * The UI has additional fields that are not present in the Staff model.
 * Unsupported fields therefore begin blank instead of displaying
 * personal details from an unrelated demo account.
 */
function mapAccountToProfile(
  user: AuthUserSummary,
  staff: Staff | null,
  fallback: ProfileDemoData,
  customerProfile: CustomerSelfProfile | null,
): ProfileDemoData {
  return {
    ...fallback,
    id: user.id,

    staffId:
      staff?.employeeNumber ??
      (user.role === "customer" ? "Customer account" : user.id),

    role: staff?.position || getRoleLabel(user.role),

    accountStatus: getAccountStatus(user, staff),

    memberSince:
      staff?.hireDate ??
      staff?.createdAt ??
      user.createdAt ?? "",

    avatarUrl:
      staff?.avatarUrl ??
      null,

    form: {
      ...fallback.form,
      firstName:
        staff?.firstName ??
        user.firstName,
      lastName:
        staff?.lastName ??
        user.lastName,
      email: user.email || staff?.email || "",
      phone: staff?.phone ?? user.phoneNumber ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      gender: user.gender ?? "",
      address: "",
      city: staff?.location ?? "",
      country: "",
      postalCode: "",
    },

    preferences: {
      ...fallback.preferences,
      ...(customerProfile?.preferredCurrency
        ? { currency: customerProfile.preferredCurrency }
        : {}),
      ...(customerProfile
        ? { promotionalEmails: customerProfile.marketingConsent }
        : {}),
    },

    emailVerified: Boolean(user.emailVerifiedAt),
    phoneVerified: false,

    // User does not currently expose these fields. Do not present
    // demo security details as verified live account information.
    twoFactorEnabled: false,
    lastPasswordChanged: "",
    lastSignIn:
      user.lastLoginAt ??
      staff?.lastLoginAt ??
      "",
    activeSessions: 0,
  };
}

export default function ProfileFeature({
  currencyOptions = fallbackCurrencyOptions,
  timeZoneOptions = fallbackTimeZoneOptions,
  languageOptions,
}: ProfileFeatureProps) {
  const [initialProfile] = useState<ProfileDemoData>(
    () => getProfileDemoData(),
  );

  const [profile, setProfile] = useState<ProfileDemoData>(
    () => getProfileDemoData(),
  );

  const [formValues, setFormValues] = useState<ProfileFormValues>(
    () => ({ ...initialProfile.form }),
  );

  const [preferences, setPreferences] =
    useState<ProfilePreferenceValues>(
      () => ({ ...initialProfile.preferences }),
    );

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("overview");

  const [dataSource, setDataSource] =
    useState<ProfileDataSource>("demo");

  const [currentStaff, setCurrentStaff] =
    useState<Staff | null>(null);
  const [accountUser, setAccountUser] =
    useState<AuthUserSummary | null>(null);
  const [currentCustomerProfile, setCurrentCustomerProfile] =
    useState<CustomerSelfProfile | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] =
    useState(false);
  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [formErrors, setFormErrors] =
    useState<ProfileFormErrors>({});

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(initialProfile.avatarUrl);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isUpdatingTwoFactor, setIsUpdatingTwoFactor] =
    useState(false);
  const [isSigningOutSessions, setIsSigningOutSessions] =
    useState(false);

  const [notice, setNotice] = useState("");
  const [profileError, setProfileError] = useState("");
  const [preferencesError, setPreferencesError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityNotice, setSecurityNotice] = useState("");

  /**
   * Load the signed-in User through the existing auth service.
   * Staff/admin accounts also attempt to resolve a matching Staff record.
   *
   * If the backend is unavailable or there is no authenticated account,
   * keep the in-memory demo profile and explain its limitations.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProfile(): Promise<void> {
      try {
        const user = await authService.getCurrentUser();
        let customerProfile: CustomerSelfProfile | null = null;
        if (user.role === "customer") {
          try {
            customerProfile = await customerService.getMyProfile();
          } catch (error: unknown) {
            if (!(error instanceof ApiError) || error.status !== 404) {
              throw error;
            }
          }
        }
        const staff = await findStaffRecord(user);

        if (cancelled) return;

        const mappedProfile = mapAccountToProfile(
          user,
          staff,
          initialProfile,
          customerProfile,
        );

        setAccountUser(user);
        setCurrentCustomerProfile(customerProfile);
        setProfile(mappedProfile);
        setFormValues({ ...mappedProfile.form });
        setPreferences({ ...mappedProfile.preferences });
        setAvatarPreview(mappedProfile.avatarUrl);
        setAvatarFile(null);
        setCurrentStaff(staff);
        setDataSource(staff ? "staff" : "user");

        setNotice(
          !staff && user.role !== "customer"
            ? "Your account profile was loaded, but no matching staff record was found. Only supported account fields can be saved."
            : user.role === "customer"
              ? "Your account profile was loaded. Customer currency and marketing email preferences can be saved to your account."
              : "Your staff profile was loaded. Preferences not supported by the Staff API remain session-only.",
        );
      } catch {
        if (cancelled) return;

        setProfile(initialProfile);
        setFormValues({ ...initialProfile.form });
        setPreferences({ ...initialProfile.preferences });
        setAvatarPreview(initialProfile.avatarUrl);
        setAvatarFile(null);
        setCurrentStaff(null);
        setAccountUser(null);
        setCurrentCustomerProfile(null);
        setDataSource("demo");

        setNotice(
          "A signed-in profile could not be loaded. Demo profile data is displayed; changes in demo mode are temporary and will not update a server account.",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [initialProfile]);

  const hasProfileChanges = useMemo(
    () =>
      JSON.stringify(formValues) !==
        JSON.stringify(profile.form) ||
      avatarPreview !== profile.avatarUrl,
    [formValues, profile.form, profile.avatarUrl, avatarPreview],
  );

  const hasPreferenceChanges = useMemo(
    () =>
      JSON.stringify(preferences) !==
      JSON.stringify(profile.preferences),
    [preferences, profile.preferences],
  );

  const fullName = [
    formValues.firstName,
    formValues.lastName,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

  const handleProfileFieldChange = (
    field: keyof ProfileFormValues,
    value: string,
  ) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setProfileError("");
    setNotice("");
  };

  const handleEditProfile = () => {
    if (isLoadingProfile || isSavingProfile) return;

    setActiveTab("overview");
    setFormValues({ ...profile.form });
    setAvatarPreview(profile.avatarUrl);
    setAvatarFile(null);
    setFormErrors({});
    setProfileError("");
    setNotice("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormValues({ ...profile.form });
    setAvatarPreview(profile.avatarUrl);
    setAvatarFile(null);
    setFormErrors({});
    setProfileError("");
    setIsEditing(false);
    setNotice("");
  };

  const handleSaveProfile = async (
    submittedValues: ProfileFormValues,
  ): Promise<void> => {
    const errors = validateProfile(submittedValues);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setProfileError("Please correct the highlighted fields.");
      return;
    }

    if (isSavingProfile) return;

    setIsSavingProfile(true);
    setProfileError("");
    setNotice("");

    try {
      /*
       * Staff details supported by the existing staffService can be
       * persisted through the existing API.
       */
      if (dataSource === "staff" && currentStaff) {
        try {
          const updatedStaff = await staffService.updateStaff(
            currentStaff.id,
            {
              firstName: submittedValues.firstName.trim(),
              lastName: submittedValues.lastName.trim(),
              email: submittedValues.email.trim().toLowerCase(),
              phone: submittedValues.phone.trim(),
              location:
                submittedValues.city.trim() ||
                currentStaff.location,
            },
          );

          setCurrentStaff(updatedStaff);

          const nextAvatarUrl = avatarFile
            ? avatarPreview
            : updatedStaff.avatarUrl ??
              profile.avatarUrl;

          setProfile((current) => ({
            ...current,
            staffId: updatedStaff.employeeNumber,
            role: updatedStaff.position || current.role,
            accountStatus:
              updatedStaff.status === "active"
                ? "active"
                : "inactive",
            form: { ...submittedValues },
            avatarUrl: nextAvatarUrl,
          }));

          setFormValues({ ...submittedValues });
          setFormErrors({});
          setAvatarFile(null);
          setIsEditing(false);

          setNotice(
            avatarFile
              ? "Supported staff details were saved through the Staff API. Your selected picture is only a temporary preview because an image-upload endpoint is not available."
              : "Supported staff details were saved through the Staff API. Date of birth, gender, address, country, and postal code are not part of the current Staff model, so those fields are retained only in this session.",
          );

          return;
        } catch {
          setProfileError(
            "We couldn't save your profile to the Staff API. Your changes remain in the form. Check your connection and try again.",
          );
          return;
        }
      }

      if (dataSource === "user" && accountUser) {
        try {
          const updatedUser = await authService.updateUserProfile(
            accountUser.id,
            {
              firstName: submittedValues.firstName.trim(),
              lastName: submittedValues.lastName.trim(),
              phoneNumber: submittedValues.phone.trim(),
            },
          );
          const savedValues = {
            ...profile.form,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phoneNumber ?? "",
          };

          setAccountUser(updatedUser);
          setProfile((current) => ({
            ...current,
            id: updatedUser.id,
            accountStatus:
              updatedUser.status === "active" ? "active" : "inactive",
            memberSince: updatedUser.createdAt ?? current.memberSince,
            form: savedValues,
          }));
          setFormValues(savedValues);
          setFormErrors({});
          setAvatarPreview(profile.avatarUrl);
          setAvatarFile(null);
          setIsEditing(false);
          setNotice(
            "Your name and phone number were saved. Email, date of birth, gender, address, city, country, postal code, and profile pictures are not supported by the current account API and were not changed.",
          );
          return;
        } catch (error: unknown) {
          setProfileError(
            error instanceof Error
              ? error.message
              : "We couldn't save your account profile. Please try again.",
          );
          return;
        }
      }

      setProfile((current) => ({
        ...current,
        form: { ...submittedValues },
        avatarUrl: avatarPreview,
      }));

      setFormValues({ ...submittedValues });
      setFormErrors({});
      setAvatarFile(null);
      setIsEditing(false);

      if (dataSource === "demo") {
        setNotice(
          "Profile updated in demo state for this session. No server account was changed, and the selected image has not been uploaded.",
        );
      } else {
        setNotice(
          "Your profile changes are reflected in this session only. The existing services do not yet provide a general user-profile update endpoint or an image-upload endpoint.",
        );
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarChange = (
    file: File,
    previewUrl: string,
  ) => {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setNotice("");
    setProfileError("");
  };

  const handlePreferenceChange = (
    field: keyof ProfilePreferenceValues,
    value: string | boolean,
  ) => {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }) as ProfilePreferenceValues);

    setPreferencesError("");
    setNotice("");
  };

  const handleSavePreferences = async (): Promise<void> => {
    if (isSavingPreferences) return;

    if (
      !preferences.currency.trim() ||
      !preferences.timeZone.trim()
    ) {
      setPreferencesError(
        "Choose a currency and time zone before saving.",
      );
      return;
    }

    setIsSavingPreferences(true);

    try {
      if (accountUser?.role === "customer") {
        const input = {
          preferredCurrency: preferences.currency.trim().toUpperCase(),
          marketingConsent: preferences.promotionalEmails,
        };
        const customerProfile = currentCustomerProfile
          ? await customerService.updateMyProfile(input)
          : await customerService.createMyProfile(input);
        const savedPreferences = {
          ...preferences,
          currency:
            customerProfile.preferredCurrency ?? preferences.currency,
          promotionalEmails: customerProfile.marketingConsent,
        };

        setCurrentCustomerProfile(customerProfile);
        setPreferences(savedPreferences);
        setProfile((current) => ({
          ...current,
          preferences: savedPreferences,
        }));
        setPreferencesError("");
        setNotice(
          "Currency and marketing email preferences were saved to your customer profile. Other preference settings remain session-only because the backend does not currently store them.",
        );
        return;
      }

      setProfile((current) => ({
        ...current,
        preferences: { ...preferences },
      }));

      setPreferencesError("");

      setNotice(
        "Preferences were updated for this session only. Persistent preference settings are currently available to customer accounts.",
      );
    } catch (error: unknown) {
      setPreferencesError(
        error instanceof Error
          ? error.message
          : "We couldn't save your preferences. Please try again.",
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleResetPreferences = () => {
    setPreferences({ ...profile.preferences });
    setPreferencesError("");
    setNotice("");
  };

  /**
   * The existing ProfilePasswordForm validates that the confirmation
   * matches the new password before calling onSubmit. The shared
   * ChangePasswordData type requires that matching confirmation value.
   */
  const handlePasswordSubmit = async (
    values: ProfilePasswordValues,
  ): Promise<void> => {
    setPasswordError("");
    setNotice("");

    if (dataSource === "demo") {
      const message =
        "Password changes require a signed-in account and a working authentication API. Demo mode cannot change an account password.";

      setPasswordError(message);
      throw new Error(message);
    }

    if (isChangingPassword) return;

    setIsChangingPassword(true);

    try {
      const payload: ChangePasswordData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.newPassword,
      };

      await authService.changePassword(payload);

      setProfile((current) => ({
        ...current,
        lastPasswordChanged: new Date().toISOString(),
      }));

      setPasswordError("");
      setNotice("Your password was changed successfully.");
      setSecurityError("");
      setSecurityNotice(
        "Your password was changed successfully.",
      );
      setActiveTab("security");
    } catch {
      const message =
        "We couldn't change your password. Verify your current password and connection, then try again.";

      setPasswordError(message);
      throw new Error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * There is no two-factor settings endpoint in the provided services.
   * In demo mode we can demonstrate the interaction locally; for a
   * signed-in account we must not claim to change a server security setting.
   */
  const handleToggleTwoFactor = async (
    enabled: boolean,
  ): Promise<void> => {
    setIsUpdatingTwoFactor(true);
    setSecurityError("");
    setSecurityNotice("");

    try {
      if (dataSource === "demo") {
        setProfile((current) => ({
          ...current,
          twoFactorEnabled: enabled,
        }));

        setSecurityNotice(
          `Two-factor authentication is ${enabled ? "enabled" : "disabled"} in demo state only. No server security setting has changed.`,
        );
        return;
      }

      setSecurityNotice(
        "Two-factor settings are not available through the current API. Your server account has not been changed.",
      );
    } finally {
      setIsUpdatingTwoFactor(false);
    }
  };

  const handleReviewSessions = () => {
    setSecurityError("");

    if (dataSource === "demo") {
      setSecurityNotice(
        `This demo displays ${profile.activeSessions} sample active session(s). Live device-session data is not connected.`,
      );
      return;
    }

    setSecurityNotice(
      "Live session details are not available through the current service layer. No live device-session data is being reported.",
    );
  };

  const handleSignOutOtherSessions = async (): Promise<void> => {
    setIsSigningOutSessions(true);
    setSecurityError("");
    setSecurityNotice("");

    try {
      if (dataSource === "demo") {
        setProfile((current) => ({
          ...current,
          activeSessions: Math.min(1, current.activeSessions),
        }));

        setSecurityNotice(
          "The demo session count was updated. No real account sessions were signed out.",
        );
        return;
      }

      setSecurityNotice(
        "Signing out other devices is not supported by the current API. No sessions have been signed out.",
      );
    } finally {
      setIsSigningOutSessions(false);
    }
  };

  const openPasswordForm = () => {
    setActiveTab("password");
    setIsEditing(false);
    setPasswordError("");
    setNotice("");
  };

  const handleTabChange = (tab: ProfileTab) => {
    if (isEditing) {
      const confirmed = window.confirm(
        "Discard your unsaved profile changes and leave edit mode?",
      );

      if (!confirmed) return;

      handleCancelEdit();
    }

    setActiveTab(tab);
    setNotice("");
    setProfileError("");
    setPasswordError("");
    setSecurityError("");

    if (tab === "security" && dataSource !== "demo") {
      setSecurityNotice(
        "The current API does not provide live two-factor status or device-session management. These controls cannot change server settings yet.",
      );
    } else {
      setSecurityNotice("");
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/70 pb-10 dark:bg-slate-950">
      <ProfileHeader
        name={fullName}
        title="My Profile"
        description="Manage your account information, personal preferences, and security settings in one place."
        accountStatus={profile.accountStatus}
        memberSince={profile.memberSince}
      />

      <div className="space-y-5">
        {isLoadingProfile && (
          <div
            role="status"
            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
          >
            Loading your account profile...
          </div>
        )}

        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="flex items-start gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{notice}</p>
          </motion.div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account
            </p>

            <p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-white">
              {profile.staffId} · {profile.role}
            </p>
          </div>

          <ProfileActions
            isEditing={isEditing}
            isSaving={isSavingProfile}
            hasChanges={hasProfileChanges}
            onEdit={handleEditProfile}
            onSave={() => void handleSaveProfile(formValues)}
            onCancel={handleCancelEdit}
            onChangePassword={openPasswordForm}
          />
        </div>

        <div
          role="tablist"
          aria-label="Profile sections"
          className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950 sm:flex sm:flex-wrap"
        >
          {profileTabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`profile-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`profile-panel-${tab.id}`}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  selected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            role="tab"
            id="profile-tab-password"
            aria-selected={activeTab === "password"}
            aria-controls="profile-panel-password"
            onClick={() => handleTabChange("password")}
            className={`col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition sm:col-auto ${
              activeTab === "password"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Password
          </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          id={`profile-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`profile-tab-${activeTab}`}
          className="space-y-6"
        >
          {activeTab === "overview" && (
            <>
              <ProfileAvatar
                name={fullName}
                email={formValues.email}
                avatarUrl={avatarPreview}
                isEditing={isEditing}
                onAvatarChange={handleAvatarChange}
                size="lg"
              />

              {isEditing ? (
                <ProfileEditForm
                  values={formValues}
                  onChange={handleProfileFieldChange}
                  onSubmit={handleSaveProfile}
                  onCancel={handleCancelEdit}
                  errors={formErrors}
                  isSaving={isSavingProfile}
                />
              ) : (
                <>
                  <ProfileSummary
                    values={profile.form}
                    avatarUrl={profile.avatarUrl}
                    accountStatus={profile.accountStatus}
                    memberSince={profile.memberSince}
                    emailVerified={profile.emailVerified}
                    phoneVerified={profile.phoneVerified}
                    onEdit={handleEditProfile}
                  />

                  <ProfileInformation values={profile.form} />
                </>
              )}

              {profileError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                >
                  {profileError}
                </p>
              )}
            </>
          )}

          {activeTab === "preferences" && (
            <ProfilePreferences
              values={preferences}
              currencyOptions={currencyOptions}
              timeZoneOptions={timeZoneOptions}
              languageOptions={languageOptions}
              onChange={handlePreferenceChange}
              onSave={() => void handleSavePreferences()}
              onReset={handleResetPreferences}
              isSaving={isSavingPreferences}
              hasChanges={hasPreferenceChanges}
              error={preferencesError}
              successMessage={notice}
            />
          )}

          {activeTab === "security" && (
            <ProfileSecurity
              email={profile.form.email}
              phone={profile.form.phone}
              emailVerified={profile.emailVerified}
              phoneVerified={profile.phoneVerified}
              twoFactorEnabled={profile.twoFactorEnabled}
              lastPasswordChanged={profile.lastPasswordChanged}
              lastSignIn={profile.lastSignIn}
              activeSessions={profile.activeSessions}
              isUpdatingTwoFactor={isUpdatingTwoFactor}
              isSigningOutSessions={isSigningOutSessions}
              onChangePassword={openPasswordForm}
              onToggleTwoFactor={handleToggleTwoFactor}
              onReviewSessions={handleReviewSessions}
              onRequestSignOutOtherSessions={
                handleSignOutOtherSessions
              }
              error={securityError}
              successMessage={securityNotice}
            />
          )}

          {activeTab === "password" && (
            <ProfilePasswordForm
              onSubmit={handlePasswordSubmit}
              onCancel={() => {
                setPasswordError("");
                setActiveTab("security");
              }}
              isSaving={isChangingPassword}
              error={passwordError}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
