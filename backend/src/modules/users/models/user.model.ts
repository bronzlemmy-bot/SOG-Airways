
import mongoose from "mongoose";

export const USER_ROLES = [
  "customer",
  "staff",
  "admin",
  "super_admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "pending_verification",
  "suspended",
  "deactivated",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_GENDERS = [
  "male",
  "female",
  "other",
  "prefer-not-to-say",
] as const;

export type UserGender = (typeof USER_GENDERS)[number];

export interface UserRecord {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: UserGender;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  emailVerificationOtpHash: string | null;
  emailVerificationOtpExpiresAt: Date | null;
  emailVerificationOtpAttempts: number;
  emailVerificationLastSentAt: Date | null;
  lastLoginAt: Date | null;
  passwordChangedAt: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

const userSchema = new mongoose.Schema<UserRecord>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    middleName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      lowercase: true,
      trim: true,
      maxlength: 254,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required."],
      select: false,
    },

    phoneNumber: {
      type: String,
      trim: true,
      maxlength: 25,
    },

    dateOfBirth: {
      type: Date,
      validate: {
        validator: (value: Date | undefined) =>
          value === undefined || value < new Date(),
        message: "Date of birth must be in the past.",
      },
    },

    gender: {
      type: String,
      enum: [...USER_GENDERS],
    },

    role: {
      type: String,
      enum: [...USER_ROLES],
      default: "customer",
      required: true,
    },

    status: {
      type: String,
      enum: [...USER_STATUSES],
      default: "active",
      required: true,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    emailVerificationOtpHash: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationOtpExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    emailVerificationOtpAttempts: {
      type: Number,
      min: 0,
      default: 0,
      select: false,
    },

    emailVerificationLastSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      min: 0,
      default: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,


toJSON: {
  transform: (_document, returnedObject) => {
    Reflect.deleteProperty(returnedObject, "passwordHash");
    Reflect.deleteProperty(returnedObject, "emailVerificationOtpHash");
    Reflect.deleteProperty(returnedObject, "emailVerificationOtpExpiresAt");
    Reflect.deleteProperty(returnedObject, "emailVerificationOtpAttempts");
    Reflect.deleteProperty(returnedObject, "emailVerificationLastSentAt");
    return returnedObject;
  },
},

  },
);

// Supports common administrative user queries.
userSchema.index({ role: 1, status: 1 });

export const User =
  mongoose.models.User ||
  mongoose.model<UserRecord>("User", userSchema);