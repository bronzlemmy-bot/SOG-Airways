
import mongoose from "mongoose";

export const CUSTOMER_LOYALTY_TIERS = [
  "standard",
  "silver",
  "gold",
  "platinum",
] as const;

export type CustomerLoyaltyTier =
  (typeof CUSTOMER_LOYALTY_TIERS)[number];

export const CUSTOMER_CABIN_CLASSES = [
  "economy",
  "premium-economy",
  "business",
  "first",
] as const;

export type CustomerCabinClass =
  (typeof CUSTOMER_CABIN_CLASSES)[number];

export interface CustomerProfileRecord {
  userId: mongoose.Types.ObjectId;
  loyaltyNumber?: string;
  loyaltyTier: CustomerLoyaltyTier;
  milesBalance: number;
  preferredCabinClass?: CustomerCabinClass;
  preferredCurrency?: string;
  marketingConsent: boolean;
}

const customerProfileSchema =
  new mongoose.Schema<CustomerProfileRecord>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A user account is required."],
        unique: true,
        index: true,
      },

      loyaltyNumber: {
        type: String,
        trim: true,
        uppercase: true,
        sparse: true,
        unique: true,
      },

      loyaltyTier: {
        type: String,
        enum: [...CUSTOMER_LOYALTY_TIERS],
        default: "standard",
        required: true,
      },

      milesBalance: {
        type: Number,
        min: [0, "Miles balance cannot be negative."],
        default: 0,
        required: true,
      },

      preferredCabinClass: {
        type: String,
        enum: [...CUSTOMER_CABIN_CLASSES],
      },

      preferredCurrency: {
        type: String,
        uppercase: true,
        trim: true,
        match: [
          /^[A-Z]{3}$/,
          "Currency must be a three-letter currency code.",
        ],
      },

      marketingConsent: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  );

export const CustomerProfile =
  mongoose.models.CustomerProfile ??
  mongoose.model<CustomerProfileRecord>(
    "CustomerProfile",
    customerProfileSchema,
  );
