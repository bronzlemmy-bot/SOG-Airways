import { apiService } from "./api";

export type ContactCategory =
  | "general_inquiry"
  | "booking"
  | "payment"
  | "refund"
  | "flight"
  | "baggage"
  | "complaint"
  | "compliment"
  | "technical_support"
  | "other";

export interface CreateContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: ContactCategory;
}

export interface ContactSubmission {
  reference: string;
  status: "new" | "in_progress" | "resolved" | "closed";
}

export const contactService = {
  createContact(data: CreateContactData): Promise<ContactSubmission> {
    return apiService.post<ContactSubmission>("/contacts", data);
  },
};
