
import { User, type UserRecord } from "../models/user.model.js";

export type CreateUserInput = Pick<
  UserRecord,
  "firstName" | "lastName" | "email" | "passwordHash"
> &
  Partial<
    Pick<
      UserRecord,
      | "phoneNumber"
  | "middleName"
  | "dateOfBirth"
  | "gender"
      | "role"
      | "status"
      | "emailVerifiedAt"
      | "lastLoginAt"
      | "passwordChangedAt"
      | "failedLoginAttempts"
      | "lockedUntil"
    >
  >;

export type UpdateUserInput = Partial<
  Pick<
    UserRecord,
    | "firstName"
    | "lastName"
    | "email"
    | "phoneNumber"
    | "role"
    | "status"
    | "emailVerifiedAt"
    | "lastLoginAt"
    | "passwordChangedAt"
    | "failedLoginAttempts"
    | "lockedUntil"
  >
>;

export const userRepository = {
  /**
   * Create a user account.
   * Passwords must be hashed before reaching the repository.
   */
  async create(input: CreateUserInput) {
    return User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordHash,
      middleName: input.middleName,
      phoneNumber: input.phoneNumber,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      role: input.role ?? "customer",
      status: input.status ?? "active",
      emailVerifiedAt: input.emailVerifiedAt ?? null,
      lastLoginAt: input.lastLoginAt ?? null,
      passwordChangedAt: input.passwordChangedAt ?? null,
      failedLoginAttempts: input.failedLoginAttempts ?? 0,
      lockedUntil: input.lockedUntil ?? null,
    });
  },

  /**
   * Find a user by ID without explicitly selecting the password hash.
   */
  async findById(id: string) {
    return User.findById(id).exec();
  },

  /**
   * Find a user by email for normal account operations.
   */
  async findByEmail(email: string) {
    return User.findOne({
      email: email.trim().toLowerCase(),
    }).exec();
  },

  /**
   * Find a user for login or password verification.
   * The schema excludes passwordHash by default, so explicitly select it.
   */
  async findByEmailWithPasswordHash(email: string) {
    return User.findOne({
      email: email.trim().toLowerCase(),
    })
      .select("+passwordHash")
      .exec();
  },

  /**
   * Check whether an email address is already registered.
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.exists({
      email: email.trim().toLowerCase(),
    });

    return user !== null;
  },

  /**
   * Update account details without exposing passwordHash in generic updates.
   */
  async updateById(id: string, updates: UpdateUserInput) {
    return User.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  },

  async setEmailVerificationChallenge(
    id: string,
    codeHash: string,
    expiresAt: Date,
    sentAt: Date,
    cooldownBefore?: Date,
  ) {
    const filter: Record<string, unknown> = {
      _id: id,
      role: "customer",
      status: { $in: ["pending_verification", "active"] },
      emailVerifiedAt: null,
    };

    if (cooldownBefore) {
      filter.$or = [
        { emailVerificationLastSentAt: null },
        { emailVerificationLastSentAt: { $lte: cooldownBefore } },
      ];
    }

    return User.findOneAndUpdate(
      filter,
      {
        $set: {
          emailVerificationOtpHash: codeHash,
          emailVerificationOtpExpiresAt: expiresAt,
          emailVerificationOtpAttempts: 0,
          emailVerificationLastSentAt: sentAt,
          status: "pending_verification",
        },
      },
      { new: true },
    ).exec();
  },

  async clearEmailVerificationChallenge(id: string, codeHash: string) {
    return User.updateOne(
      {
        _id: id,
        emailVerificationOtpHash: codeHash,
      },
      {
        $set: {
          emailVerificationOtpHash: null,
          emailVerificationOtpExpiresAt: null,
          emailVerificationOtpAttempts: 0,
          emailVerificationLastSentAt: null,
        },
      },
    ).exec();
  },

  async verifyEmailWithOtp(email: string, codeHash: string, now: Date) {
    return User.findOneAndUpdate(
      {
        email: email.trim().toLowerCase(),
        role: "customer",
        status: "pending_verification",
        emailVerifiedAt: null,
        emailVerificationOtpHash: codeHash,
        emailVerificationOtpExpiresAt: { $gt: now },
        emailVerificationOtpAttempts: { $lt: 5 },
      },
      {
        $set: {
          status: "active",
          emailVerifiedAt: now,
          emailVerificationOtpHash: null,
          emailVerificationOtpExpiresAt: null,
          emailVerificationOtpAttempts: 0,
          emailVerificationLastSentAt: null,
        },
      },
      { new: true },
    ).exec();
  },

  async incrementEmailVerificationAttempts(email: string, now: Date) {
    return User.updateOne(
      {
        email: email.trim().toLowerCase(),
        role: "customer",
        status: "pending_verification",
        emailVerifiedAt: null,
        emailVerificationOtpExpiresAt: { $gt: now },
        emailVerificationOtpAttempts: { $lt: 5 },
      },
      { $inc: { emailVerificationOtpAttempts: 1 } },
    ).exec();
  },

  /**
   * Update a password hash and reset the login lockout counters.
   */
  async updatePasswordHash(id: string, passwordHash: string) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          passwordHash,
          passwordChangedAt: new Date(),
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("+passwordHash")
      .exec();
  },
};
