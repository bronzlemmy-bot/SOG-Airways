
import {
  supportCategories,
  supportTopics,
  supportTickets,
  supportMessages,
  type SupportTicket,
  type SupportMessage,

} from "@/components/user/support/support-data/SupportData";

export interface SupportDemoData {
  tickets: SupportTicket[];
  messages: SupportMessage[];
}

export function getSupportDemoData(): SupportDemoData {
  return {
    tickets: supportTickets.map((ticket) => ({
      ...ticket,
    })),
    messages: supportMessages.map((message) => ({
      ...message,
    })),
  };
}

export {
  supportCategories,
  supportTopics,
};

export const supportDemoData: SupportDemoData =
  getSupportDemoData();
