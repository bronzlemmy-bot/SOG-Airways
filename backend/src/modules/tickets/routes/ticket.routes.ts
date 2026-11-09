
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";
import { validateRequest } from "../../../middleware/validate-request.middleware.js";

import {
  cancelTicket,
  countTickets,
  deleteTicket,
  downloadTicketPdf,
  getMyTickets,
  getTicketById,
  getTicketByNumber,
  getTicketsByBooking,
  getTicketsByFlight,
  getTicketsByPayment,
  issueTicket,
  listTickets,
  updateTicket,
} from "../controllers/ticket.controller.js";

import {
  createTicketSchema,
  ticketCountQuerySchema,
  ticketIdParamsSchema,
  ticketListQuerySchema,
  ticketNumberParamsSchema,
  updateTicketSchema,
} from "../validations/ticket.validation.js";

const ticketRouter = Router();

/**
 * Customer ticket access
 */
ticketRouter.get(
  "/my-tickets",
  authenticate,
  getMyTickets,
);

/**
 * Ticket counts and administration
 */
ticketRouter.get(
  "/count",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ query: ticketCountQuerySchema }),
  countTickets,
);

ticketRouter.get(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ query: ticketListQuerySchema }),
  listTickets,
);

/**
 * Ticket lookups
 */
ticketRouter.get(
  "/number/:ticketNumber",
  authenticate,
  validateRequest({ params: ticketNumberParamsSchema }),
  getTicketByNumber,
);

ticketRouter.get(
  "/booking/:bookingId",
  authenticate,
  getTicketsByBooking,
);

ticketRouter.get(
  "/payment/:paymentId",
  authenticate,
  authorize("admin", "super_admin"),
  getTicketsByPayment,
);

ticketRouter.get(
  "/flight/:flightId",
  authenticate,
  authorize("admin", "super_admin"),
  getTicketsByFlight,
);

ticketRouter.get(
  "/:ticketId/pdf",
  authenticate,
  validateRequest({ params: ticketIdParamsSchema }),
  downloadTicketPdf,
);

ticketRouter.get(
  "/:ticketId",
  authenticate,
  validateRequest({ params: ticketIdParamsSchema }),
  getTicketById,
);

/**
 * Ticket issuance and modifications
 */
ticketRouter.post(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ body: createTicketSchema }),
  issueTicket,
);

ticketRouter.patch(
  "/:ticketId",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({
    params: ticketIdParamsSchema,
    body: updateTicketSchema,
  }),
  updateTicket,
);

ticketRouter.patch(
  "/:ticketId/cancel",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ params: ticketIdParamsSchema }),
  cancelTicket,
);

ticketRouter.delete(
  "/:ticketId",
  authenticate,
  authorize("admin", "super_admin"),
  validateRequest({ params: ticketIdParamsSchema }),
  deleteTicket,
);

export default ticketRouter;
