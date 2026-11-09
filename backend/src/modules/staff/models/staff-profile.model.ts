
import mongoose from "mongoose";

export const STAFF_DEPARTMENTS = [
  "administration",
  "cabin_crew",
  "customer_service",
  "engineering",
  "finance",
  "flight_operations",
  "ground_operations",
  "human_resources",
  "information_technology",
  "management",
  "security",
  "other",
] as const;

export type StaffDepartment = (typeof STAFF_DEPARTMENTS)[number];

export const STAFF_EMPLOYMENT_STATUSES = [
  "active",
  "on_leave",
  "suspended",
  "terminated",
] as const;

export type StaffEmploymentStatus =
  (typeof STAFF_EMPLOYMENT_STATUSES)[number];

export interface StaffRecord {
  userId: mongoose.Types.ObjectId;
  employeeNumber: string;
  department: StaffDepartment;
  jobTitle: string;
  employmentStatus: StaffEmploymentStatus;
  hireDate: Date;
  terminationDate?: Date | null;
  notes?: string;
}

const staffSchema = new mongoose.Schema<StaffRecord>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A user account is required for a staff profile."],
      unique: true,
      index: true,
    },

    employeeNumber: {
      type: String,
      required: [true, "Employee number is required."],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 30,
      unique: true,
    },

    department: {
      type: String,
      enum: [...STAFF_DEPARTMENTS],
      required: [true, "Staff department is required."],
    },

    jobTitle: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    employmentStatus: {
      type: String,
      enum: [...STAFF_EMPLOYMENT_STATUSES],
      default: "active",
      required: true,
    },

    hireDate: {
      type: Date,
      required: [true, "Hire date is required."],
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Hire date cannot be in the future.",
      },
    },

    terminationDate: {
      type: Date,
      default: null,

    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Supports administrative filtering by department and employment status.
staffSchema.index({ department: 1, employmentStatus: 1 });

// Supports chronological staff directory queries.
staffSchema.index({ hireDate: -1 });

export const Staff =
  mongoose.models.Staff ??
  mongoose.model<StaffRecord>("Staff", staffSchema);
