
import mongoose, { Types } from "mongoose";

import { CustomerProfile } from "../models/customer-profile.model.js";

import type {
  CustomerProfileDocumentData,
  CustomerProfileFilters,
  CustomerPaginationOptions,
} from "../types/customer.types.js";

/**
 * Database operations for customer profiles.
 */
export class CustomerRepository {
  /**
   * Find a customer profile by its MongoDB document ID.
   */
  async findById(
    customerId: string,
  ): Promise<CustomerProfileDocumentData | null> {
    if (!Types.ObjectId.isValid(customerId)) {
      return null;
    }

    return CustomerProfile.findById(customerId)
      .lean<CustomerProfileDocumentData>()
      .exec();
  }

  /**
   * Find a customer profile by its associated user ID.
   */
  async findByUserId(
    userId: string,
  ): Promise<CustomerProfileDocumentData | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return CustomerProfile.findOne({
      userId: new Types.ObjectId(userId),
    })
      .lean<CustomerProfileDocumentData>()
      .exec();
  }

  /**
   * Find a customer profile by its loyalty number.
   */
  async findByLoyaltyNumber(
    loyaltyNumber: string,
  ): Promise<CustomerProfileDocumentData | null> {
    return CustomerProfile.findOne({
      loyaltyNumber: loyaltyNumber.trim().toUpperCase(),
    })
      .lean<CustomerProfileDocumentData>()
      .exec();
  }

  /**
   * Create a customer profile.
   *
   * The service supplies the authenticated user's ID.
   */
  async create(
    userId: string,
    data: {
      loyaltyNumber?: string;
      preferredCabinClass?: CustomerProfileDocumentData["preferredCabinClass"];
      preferredCurrency?: string;
      marketingConsent?: boolean;
    },
  ): Promise<CustomerProfileDocumentData> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("A valid user ID is required.");
    }

    const profile = await CustomerProfile.create({
      ...data,
      userId: new Types.ObjectId(userId),
    });

    return profile.toObject() as CustomerProfileDocumentData;
  }

  /**
   * Update customer-editable preferences.
   */
  async updatePreferences(
    userId: string,
    data: {
      preferredCabinClass?: CustomerProfileDocumentData["preferredCabinClass"];
      preferredCurrency?: string;
      marketingConsent?: boolean;
    },
  ): Promise<CustomerProfileDocumentData | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return CustomerProfile.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    )
      .lean<CustomerProfileDocumentData>()
      .exec();
  }

  /**
   * Find customer profiles using optional filters and pagination.
   */
  async findMany(
    filters: CustomerProfileFilters,
    pagination: CustomerPaginationOptions,
  ): Promise<{
    items: CustomerProfileDocumentData[];
    totalItems: number;
  }> {
    const query: Record<string, unknown> = {};

    if (filters.userId) {
      if (!Types.ObjectId.isValid(filters.userId)) {
        return { items: [], totalItems: 0 };
      }

      query.userId = new Types.ObjectId(filters.userId);
    }

    if (filters.loyaltyNumber) {
      query.loyaltyNumber = filters.loyaltyNumber
        .trim()
        .toUpperCase();
    }

    if (filters.loyaltyTier) {
      query.loyaltyTier = filters.loyaltyTier;
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [items, totalItems] = await Promise.all([
      CustomerProfile.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pagination.limit)
        .lean<CustomerProfileDocumentData[]>()
        .exec(),

      CustomerProfile.countDocuments(query).exec(),
    ]);

    return { items, totalItems };
  }

  /**
   * Delete a customer profile by its associated user ID.
   */
  async deleteByUserId(
    userId: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }

    const result = await CustomerProfile.deleteOne({
      userId: new Types.ObjectId(userId),
    }).exec();

    return result.deletedCount > 0;
  }

  /**
   * Check whether a loyalty number is already assigned.
   *
   * Optionally excludes a customer profile when checking updates.
   */
  async loyaltyNumberExists(
    loyaltyNumber: string,
    excludeCustomerId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      loyaltyNumber: loyaltyNumber.trim().toUpperCase(),
    };

    if (
      excludeCustomerId &&
      Types.ObjectId.isValid(excludeCustomerId)
    ) {
      query._id = {
        $ne: new Types.ObjectId(excludeCustomerId),
      };
    }

    const existingProfile = await CustomerProfile.exists(query).exec();

    return existingProfile !== null;
  }

  /**
   * Count all customer profiles.
   */
  async count(): Promise<number> {
    return CustomerProfile.countDocuments().exec();
  }
}

/**
 * Shared repository instance.
 */
export const customerRepository = new CustomerRepository();
