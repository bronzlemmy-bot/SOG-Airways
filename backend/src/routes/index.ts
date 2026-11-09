
import { Router } from "express";

import authRouter from "../modules/auth/routes/auth.routes.js";
import userRouter from "../modules/users/routes/user.routes.js";
import customerRouter from "../modules/customers/routes/customer.routes.js";
import staffRouter from "../modules/staff/routes/staff.routes.js";

import airportRouter from "../modules/airports/routes/airport.routes.js";
import aircraftRouter from "../modules/aircraft/routes/aircraft.routes.js";
import flightRouter from "../modules/flights/routes/flight.routes.js";

import bookingRouter from "../modules/bookings/routes/booking.routes.js";
import passengerRouter from "../modules/passengers/routes/passenger.routes.js";
import paymentRouter from "../modules/payments/routes/payment.routes.js";
import ticketRouter from "../modules/tickets/routes/ticket.routes.js";
import checkInRouter from "../modules/check-in/routes/check-in.routes.js";
import tripRouter from "../modules/trips/routes/trip.routes.js";

import contactRouter from "../modules/contacts/routes/contact.routes.js";
import contentRouter from "../modules/content/routes/content.routes.js";
import messageRouter from "../modules/messages/routes/message.routes.js";
import conversationRouter from "../modules/messages/routes/conversation.routes.js";
import newsletterRouter from "../modules/newsletters/routes/newsletter.routes.js";
import notificationRouter from "../modules/notifications/routes/notification.routes.js";

import reportRouter from "../modules/reports/routes/report.routes.js";
import trackingRouter from "../modules/tracking/routes/tracking.routes.js";
import supportRouter from "../modules/support/routes/support.routes.js";
import settingsRouter from "../modules/settings/routes/setting.routes.js";

const router = Router();

/**
 * API health check
 * GET /api/v1/health
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "SOG Airways API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Authentication and user management
 */
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/customers", customerRouter);
router.use("/staff", staffRouter);

/**
 * Airports, aircraft and flight operations
 */
router.use("/airports", airportRouter);
router.use("/aircraft", aircraftRouter);
router.use("/flights", flightRouter);
router.use("/tracking", trackingRouter);

/**
 * Booking, passenger, payment and travel management
 */
router.use("/bookings", bookingRouter);
router.use("/passengers", passengerRouter);
router.use("/payments", paymentRouter);
router.use("/tickets", ticketRouter);
router.use("/check-in", checkInRouter);
router.use("/trips", tripRouter);

/**
 * Communications and public content
 */
router.use("/contacts", contactRouter);
router.use("/content", contentRouter);
router.use("/messages", messageRouter);
router.use("/conversations", conversationRouter);
router.use("/newsletters", newsletterRouter);
router.use("/notifications", notificationRouter);

/**
 * Reports, support and application settings
 */
router.use("/reports", reportRouter);
router.use("/support", supportRouter);
router.use("/settings", settingsRouter);

export default router;
