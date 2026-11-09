
import mongoose, { type ClientSession } from "mongoose";

import { ApiError } from "../../../utils/api-error.js";
import { CustomerProfile } from "../models/customer-profile.model.js";

import {
  customerRepository,
} from "../repositories/customer.repository.js";

import type {
  CustomerProfileDocumentData,
  CustomerProfileFilters,
  CustomerPaginationOptions,
  CustomerProfileResponse,
  CreateCustomerProfileInput,
  UpdateCustomerProfileInput,
  PaginatedCustomerProfiles,
} from "../types/customer.types.js";

/**
 * Converts a database record into a safe API response.
 */
function toCustomerProfileResponse(
  profile: CustomerProfileDocumentData,
): CustomerProfileResponse {
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    loyaltyNumber: profile.loyaltyNumber ?? null,
    loyaltyTier: profile.loyaltyTier,
    milesBalance: profile.milesBalance,
    preferredCabinClass: profile.preferredCabinClass ?? null,
    preferredCurrency: profile.preferredCurrency ?? null,
    marketingConsent: profile.marketingConsent,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

/**
 * Customer profile business logic.
 */
export class CustomerService {
  async getOrCreateProfileId(
    userId: string,
    session: ClientSession,
  ): Promise<string> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError("The authenticated user ID is invalid.", 401, {
        code: "INVALID_AUTHENTICATED_USER_ID",
      });
    }

    const profile = await CustomerProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $setOnInsert: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session,
      },
    ).exec();

    return profile._id.toString();
  }

  async getProfileIdForUser(userId: string): Promise<string> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError("The authenticated user ID is invalid.", 401, {
        code: "INVALID_AUTHENTICATED_USER_ID",
      });
    }

    const profile = await customerRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError("Customer profile not found.", 404, {
        code: "CUSTOMER_PROFILE_NOT_FOUND",
      });
    }

    return profile._id.toString();
  }

  /**
   * Retrieve the authenticated customer's profile.
   */
  async getMyProfile(
    userId: string,
  ): Promise<CustomerProfileResponse> {
    const profile = await customerRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError("Customer profile not found.", 404);
    }

    return toCustomerProfileResponse(profile);
  }

  /**
   * Create a profile for the authenticated user.
   */
  async createProfile(
    userId: string,
    input: CreateCustomerProfileInput,
  ): Promise<CustomerProfileResponse> {
    const existingProfile =
      await customerRepository.findByUserId(userId);

    if (existingProfile) {
      throw new ApiError(
        "A customer profile already exists for this user.",
        409,
      );
    }

    if (input.loyaltyNumber) {
      const loyaltyNumberExists =
        await customerRepository.loyaltyNumberExists(
          input.loyaltyNumber,
        );

      if (loyaltyNumberExists) {
        throw new ApiError(
          "This loyalty number is already assigned.",
          409,
        );
      }
    }

    try {
      const profile = await customerRepository.create(
        userId,
        input,
      );

      return toCustomerProfileResponse(profile);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new ApiError(
          "A customer profile or loyalty number already exists.",
          409,
        );
      }

      throw error;
    }
  }

  /**
   * Update the authenticated customer's preferences.
   */
  async updateMyProfile(
    userId: string,
    input: UpdateCustomerProfileInput,
  ): Promise<CustomerProfileResponse> {
    const profile = await customerRepository.updatePreferences(
      userId,
      input,
    );

    if (!profile) {
      throw new ApiError("Customer profile not found.", 404);
    }

    return toCustomerProfileResponse(profile);
  }

  /**
   * Retrieve a profile by its associated user ID.
   * Intended for authorized administrative operations.
   */
  async getProfileByUserId(
    userId: string,
  ): Promise<CustomerProfileResponse> {
    const profile = await customerRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError("Customer profile not found.", 404);
    }

    return toCustomerProfileResponse(profile);
  }

  /**
   * List customer profiles with filters and pagination.
   * The controller must enforce administrative authorization.
   */
  async listProfiles(
    filters: CustomerProfileFilters,
    pagination: CustomerPaginationOptions,
  ): Promise<PaginatedCustomerProfiles> {
    const { items, totalItems } =
      await customerRepository.findMany(filters, pagination);

    return {
      items: items.map(toCustomerProfileResponse),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: Math.ceil(
          totalItems / pagination.limit,
        ),
      },
    };
  }

  /**
   * Check whether a loyalty number is available.
   */
  async isLoyaltyNumberAvailable(
    loyaltyNumber: string,
  ): Promise<boolean> {
    const exists =
      await customerRepository.loyaltyNumberExists(
        loyaltyNumber,
      );

    return !exists;
  }

  /**
   * Count customer profiles.
   * Intended for authorized administrative statistics.
   */
  async countProfiles(): Promise<number> {
    return customerRepository.count();
  }
}

/**
 * Shared customer service instance.
 */
export const customerService = new CustomerService();
