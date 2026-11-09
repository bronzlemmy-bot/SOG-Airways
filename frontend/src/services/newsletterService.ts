import { apiService } from "./api";

export interface CreateNewsletterSubscriptionData {
  email: string;
  consentGiven: true;
}

export interface NewsletterSubscription {
  email: string;
  status: "subscribed" | "unsubscribed";
}

export const newsletterService = {
  subscribe(
    data: CreateNewsletterSubscriptionData,
  ): Promise<NewsletterSubscription> {
    return apiService.post<NewsletterSubscription>(
      "/newsletters/subscribe",
      data,
    );
  },
};
