
import type { Types } from "mongoose";

import type {
  CustomerCabinClass,
  CustomerLoyaltyTier,
} from "../models/customer-profile.model.js";

/**
 * Customer profile identifier and ownership.
 */
export interface CustomerIdentity {
  id: string;
  userId: string;
}

/**
 * Customer profile data stored in MongoDB.
 */
export interface CustomerProfileDocumentData {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  loyaltyNumber?: string;
  loyaltyTier: CustomerLoyaltyTier;
  milesBalance: number;
  preferredCabinClass?: CustomerCabinClass;
  preferredCurrency?: string;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data accepted when creating a customer profile.
 * The authenticated user's ID is supplied by the service,
 * not trusted from the request body.
 */
export interface CreateCustomerProfileInput {
  loyaltyNumber?: string;
  preferredCabinClass?: CustomerCabinClass;
  preferredCurrency?: string;
  marketingConsent?: boolean;
}

/**
 * Customer-editable profile preferences.
 */
export interface UpdateCustomerProfileInput {
  preferredCabinClass?: CustomerCabinClass;
  preferredCurrency?: string;
  marketingConsent?: boolean;
}

/**
 * Customer profile information safe to return through the API.
 */
export interface CustomerProfileResponse {
  id: string;
  userId: string;
  loyaltyNumber: string | null;
  loyaltyTier: CustomerLoyaltyTier;
  milesBalance: number;
  preferredCabinClass: CustomerCabinClass | null;
  preferredCurrency: string | null;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query filters supported by customer profile lookups.
 */
export interface CustomerProfileFilters {
  userId?: string;
  loyaltyNumber?: string;
  loyaltyTier?: CustomerLoyaltyTier;
}

/**
 * Pagination options for customer profile listings.
 */
export interface CustomerPaginationOptions {
  page: number;
  limit: number;
}

/**
 * Paginated customer profile results.
 */
export interface PaginatedCustomerProfiles {
  items: CustomerProfileResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
