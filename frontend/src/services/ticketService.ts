import { apiService } from "./api";

import type { CheckoutTicket } from "@/types";

export const ticketService = {
  async getMyTickets(): Promise<CheckoutTicket[]> {
    return apiService.get<CheckoutTicket[]>("/tickets/my-tickets");
  },

  async getBookingTickets(bookingId: string): Promise<CheckoutTicket[]> {
    return apiService.get<CheckoutTicket[]>(
      `/tickets/booking/${encodeURIComponent(bookingId)}`,
    );
  },

  async downloadTicketPdf(ticketId: string): Promise<Blob> {
    return apiService.getBlob(
      `/tickets/${encodeURIComponent(ticketId)}/pdf`,
    );
  },
};
