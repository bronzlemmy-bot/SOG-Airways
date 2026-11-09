
import mongoose, {
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const PASSENGER_GENDERS = [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
] as const;

export type PassengerGender = (typeof PASSENGER_GENDERS)[number];

export const PASSENGER_DOCUMENT_TYPES = [
  "passport",
  "national_id",
  "drivers_license",
  "other",
] as const;

export type PassengerDocumentType =
  (typeof PASSENGER_DOCUMENT_TYPES)[number];

export const PASSENGER_STATUSES = [
  "active",
  "inactive",
  "blocked",
] as const;

export type PassengerStatus = (typeof PASSENGER_STATUSES)[number];

const passengerSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      required: [true, "Customer is required."],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      minlength: [1, "First name cannot be empty."],
      maxlength: [100, "First name cannot exceed 100 characters."],
    },
    middleName: {
      type: String,
      trim: true,
      maxlength: [100, "Middle name cannot exceed 100 characters."],
      default: null,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      minlength: [1, "Last name cannot be empty."],
      maxlength: [100, "Last name cannot exceed 100 characters."],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required."],
      validate: {
        validator: (value: Date) =>
          value instanceof Date &&
          !Number.isNaN(value.getTime()) &&
          value < new Date(),
        message: "Date of birth must be a valid date in the past.",
      },
    },
    gender: {
      type: String,
      enum: {
        values: PASSENGER_GENDERS,
        message: "The selected gender is invalid.",
      },
      default: "prefer_not_to_say",
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required."],
      trim: true,
      maxlength: [100, "Nationality cannot exceed 100 characters."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
      default: null,
    },
    phoneNumber: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters."],
      default: null,
    },
    documentType: {
      type: String,
      enum: {
        values: PASSENGER_DOCUMENT_TYPES,
        message: "The selected document type is invalid.",
      },
      default: null,
    },
    documentNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [100, "Document number cannot exceed 100 characters."],
      default: null,
    },
    documentIssuingCountry: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [
        100,
        "Document issuing country cannot exceed 100 characters.",
      ],
      default: null,
    },
    documentExpiryDate: {
      type: Date,
      default: null,
      validate: {
        validator: (value: Date | null) =>
          value === null ||
          (value instanceof Date &&
            !Number.isNaN(value.getTime())),
        message: "Document expiry date must be valid.",
      },
    },
    specialAssistanceRequired: {
      type: Boolean,
      default: false,
    },
    specialAssistanceNotes: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Special assistance notes cannot exceed 1000 characters.",
      ],
      default: null,
    },
    frequentFlyerNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [
        50,
        "Frequent flyer number cannot exceed 50 characters.",
      ],
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: PASSENGER_STATUSES,
        message: "The selected passenger status is invalid.",
      },
      required: true,
      default: "active",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters."],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

passengerSchema.index({ customer: 1, lastName: 1, firstName: 1 });
passengerSchema.index({ customer: 1, email: 1 });
passengerSchema.index({ documentType: 1, documentNumber: 1 });

passengerSchema.pre("validate", function () {
  const hasDocumentType = Boolean(this.documentType);
  const hasDocumentNumber = Boolean(this.documentNumber);

  if (hasDocumentType !== hasDocumentNumber) {
    this.invalidate(
      "documentNumber",
      "Document type and document number must be provided together.",
    );
  }

  if (
    this.documentExpiryDate &&
    this.documentExpiryDate <= new Date()
  ) {
    this.invalidate(
      "documentExpiryDate",
      "Document expiry date must be in the future.",
    );
  }

  if (
    !this.specialAssistanceRequired &&
    this.specialAssistanceNotes
  ) {
    this.invalidate(
      "specialAssistanceNotes",
      "Special assistance notes require special assistance to be enabled.",
    );
  }
});

type PassengerSchemaData = InferSchemaType<typeof passengerSchema>;

export type PassengerRecord = PassengerSchemaData & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Passenger: Model<PassengerRecord> =
  (mongoose.models.Passenger as Model<PassengerRecord> | undefined) ??
  mongoose.model<PassengerRecord>("Passenger", passengerSchema);
