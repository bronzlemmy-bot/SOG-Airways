
import { ApiError } from "../../../utils/api-error.js";

import { newsletterRepository } from "../repositories/newsletter.repository.js";

import type {
  CreateNewsletterInput,
  NewsletterCountQuery,
  NewsletterListQuery,
  UpdateNewsletterInput,
} from "../types/newsletter.types.js";

class NewsletterService {
  async subscribe(input: CreateNewsletterInput) {
    const email = input.email.trim().toLowerCase();

    if (input.consentGiven !== true) {
      throw new ApiError(
        "Consent is required to subscribe to the newsletter.",
        400,
        { code: "NEWSLETTER_CONSENT_REQUIRED" },
      );
    }

    const existing = await newsletterRepository.findByEmail(email);

    if (existing) {
      if (existing.status === "subscribed") {
        throw new ApiError(
          "This email address is already subscribed.",
          409,
          { code: "NEWSLETTER_ALREADY_SUBSCRIBED" },
        );
      }

      const updated = await newsletterRepository.update(
        existing.id,
        {
          email,
          firstName: input.firstName ?? existing.firstName,
          lastName: input.lastName ?? existing.lastName,
          source: input.source ?? existing.source,
          consentGiven: true,
          status: "subscribed",
          metadata: input.metadata ?? existing.metadata,
        },
      );

      if (!updated) {
        throw new ApiError(
          "Unable to complete the newsletter subscription.",
          500,
          { code: "NEWSLETTER_SUBSCRIPTION_FAILED" },
        );
      }

      return updated;
    }

    try {
      return await newsletterRepository.create({
        ...input,
        email,
        consentGiven: true,
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new ApiError(
          "This email address is already registered for the newsletter.",
          409,
          { code: "NEWSLETTER_DUPLICATE_EMAIL" },
        );
      }

      throw error;
    }
  }

  async getById(newsletterId: string) {
    const newsletter =
      await newsletterRepository.findById(newsletterId);

    if (!newsletter) {
      throw new ApiError(
        "Newsletter subscription not found.",
        404,
        { code: "NEWSLETTER_NOT_FOUND" },
      );
    }

    return newsletter;
  }

  async getByEmail(email: string) {
    const newsletter =
      await newsletterRepository.findByEmail(email);

    if (!newsletter) {
      throw new ApiError(
        "Newsletter subscription not found.",
        404,
        { code: "NEWSLETTER_NOT_FOUND" },
      );
    }

    return newsletter;
  }

  async list(query: NewsletterListQuery = {}) {
    return newsletterRepository.findMany(query);
  }

  async update(
    newsletterId: string,
    input: UpdateNewsletterInput,
  ) {
    const existing = await this.getById(newsletterId);

    const nextConsentGiven =
      input.consentGiven ?? existing.consentGiven;

    const nextStatus = input.status ?? existing.status;

    if (nextStatus === "subscribed" && !nextConsentGiven) {
      throw new ApiError(
        "Consent is required for an active newsletter subscription.",
        400,
        { code: "NEWSLETTER_CONSENT_REQUIRED" },
      );
    }

    if (
      input.status === "subscribed" &&
      existing.status === "unsubscribed" &&
      input.consentGiven !== true
    ) {
      throw new ApiError(
        "Explicit consent is required to reactivate an unsubscribed email address.",
        400,
        { code: "NEWSLETTER_RECONSENT_REQUIRED" },
      );
    }

    const updated = await newsletterRepository.update(
      newsletterId,
      input,
    );

    if (!updated) {
      throw new ApiError(
        "Unable to update the newsletter subscription.",
        500,
        { code: "NEWSLETTER_UPDATE_FAILED" },
      );
    }

    return updated;
  }

  async unsubscribeByEmail(email: string) {
    const newsletter =
      await newsletterRepository.findByEmail(email);

    if (!newsletter) {
      throw new ApiError(
        "Newsletter subscription not found.",
        404,
        { code: "NEWSLETTER_NOT_FOUND" },
      );
    }

    if (newsletter.status === "unsubscribed") {
      return newsletter;
    }

    const updated =
      await newsletterRepository.unsubscribeByEmail(email);

    if (!updated) {
      throw new ApiError(
        "Unable to unsubscribe this email address.",
        500,
        { code: "NEWSLETTER_UNSUBSCRIBE_FAILED" },
      );
    }

    return updated;
  }

  async delete(newsletterId: string) {
    await this.getById(newsletterId);

    const deleted =
      await newsletterRepository.delete(newsletterId);

    if (!deleted) {
      throw new ApiError(
        "Unable to delete the newsletter subscription.",
        500,
        { code: "NEWSLETTER_DELETE_FAILED" },
      );
    }

    return deleted;
  }

  async count(query: NewsletterCountQuery = {}) {
    return newsletterRepository.count(query);
  }

  async getStats() {
    return newsletterRepository.getStats();
  }
}

export const newsletterService = new NewsletterService();
