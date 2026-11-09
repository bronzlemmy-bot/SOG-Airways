
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { ApiError } from "../../../utils/api-error.js";
import type { UserGender } from "../models/user.model.js";
import { userRepository } from "../repositories/user.repository.js";

const PASSWORD_HASH_ROUNDS = 12;

export interface CreateCustomerUserInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: UserGender;
}

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const userService = {
  /**
   * Creates a customer account.
   * Privileged roles must be assigned through a separately authorized flow.
   */
  async createCustomerUser(input: CreateCustomerUserInput) {
    const firstName = input.firstName.trim();
    const middleName = input.middleName?.trim();
    const lastName = input.lastName.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;
    const phoneNumber = input.phoneNumber?.trim();

    if (!firstName || !lastName || !email || !password) {
      throw new ApiError("Required user information is missing.", 400, {
        code: "MISSING_USER_INFORMATION",
      });
    }

    if (password.length < 8) {
      throw new ApiError("Password must contain at least 8 characters.", 400, {
        code: "PASSWORD_TOO_SHORT",
      });
    }

    if (input.dateOfBirth && input.dateOfBirth >= new Date()) {
      throw new ApiError("Date of birth must be in the past.", 400, {
        code: "INVALID_DATE_OF_BIRTH",
      });
    }

    const emailExists = await userRepository.emailExists(email);

    if (emailExists) {
      throw new ApiError("An account with this email already exists.", 409, {
        code: "EMAIL_ALREADY_REGISTERED",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      PASSWORD_HASH_ROUNDS,
    );

    return userRepository.create({
      firstName,
      ...(middleName ? { middleName } : {}),
      lastName,
      email,
      passwordHash,
      ...(phoneNumber ? { phoneNumber } : {}),
      ...(input.dateOfBirth ? { dateOfBirth: input.dateOfBirth } : {}),
      ...(input.gender ? { gender: input.gender } : {}),
      role: "customer",
      status: "pending_verification",
    });
  },

  /**
   * Retrieves a user by their MongoDB document ID.
   */
  async getUserById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError("Invalid user ID.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError("User not found.", 404, {
        code: "USER_NOT_FOUND",
      });
    }

    return user;
  },

  /**
   * Updates profile fields only.
   * Email, password, status, and role cannot be changed through this method.
   */
  async updateUserProfile(
    id: string,
    input: UpdateUserProfileInput,
  ) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError("Invalid user ID.", 400, {
        code: "INVALID_USER_ID",
      });
    }

    const updates: UpdateUserProfileInput = {};

    if (input.firstName !== undefined) {
      const firstName = input.firstName.trim();

      if (!firstName) {
        throw new ApiError("First name cannot be empty.", 400, {
          code: "INVALID_FIRST_NAME",
        });
      }

      updates.firstName = firstName;
    }

    if (input.lastName !== undefined) {
      const lastName = input.lastName.trim();

      if (!lastName) {
        throw new ApiError("Last name cannot be empty.", 400, {
          code: "INVALID_LAST_NAME",
        });
      }

      updates.lastName = lastName;
    }

    if (input.phoneNumber !== undefined) {
      updates.phoneNumber = input.phoneNumber.trim();
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError("No profile changes were provided.", 400, {
        code: "EMPTY_PROFILE_UPDATE",
      });
    }

    const user = await userRepository.updateById(id, updates);

    if (!user) {
      throw new ApiError("User not found.", 404, {
        code: "USER_NOT_FOUND",
      });
    }

    return user;
  },
};
