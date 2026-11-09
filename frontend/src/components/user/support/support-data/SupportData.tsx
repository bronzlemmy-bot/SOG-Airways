export const supportCategories = [
{
id: "booking",
title: "Booking & Reservations",
description:
"Get help with reservations, booking changes, cancellations, and itinerary information.",
},
{
id: "flight",
title: "Flights & Travel",
description:
"Get assistance with flight schedules, delays, cancellations, and travel information.",
},
{
id: "check-in",
title: "Check-in & Boarding",
description:
"Get help with online check-in, boarding passes, and boarding procedures.",
},
{
id: "baggage",
title: "Baggage",
description:
"Get assistance with baggage allowance, delayed baggage, damaged luggage, and baggage fees.",
},
{
id: "payment",
title: "Payments & Refunds",
description:
"Get help with payments, refunds, receipts, and transaction questions.",
},
{
id: "account",
title: "Account & Profile",
description:
"Get help managing your account, profile information, security, and preferences.",
},
] as const;

export const supportTopics = [
{
id: "manage-booking",
title: "How do I manage my booking?",
category: "booking",
description:
"Review your itinerary and manage eligible booking details from your account.",
},
{
id: "cancel-booking",
title: "How can I cancel my booking?",
category: "booking",
description:
"Review your booking conditions and available cancellation options before requesting a cancellation.",
},
{
id: "flight-status",
title: "How can I check my flight status?",
category: "flight",
description:
"Use the SOG Airways Track Flight service to check available flight status information.",
},
{
id: "flight-delay",
title: "What happens if my flight is delayed?",
category: "flight",
description:
"Review available flight information and contact support if you need additional assistance.",
},
{
id: "online-check-in",
title: "How does online check-in work?",
category: "check-in",
description:
"Complete online check-in when available and access your boarding information.",
},
{
id: "boarding-pass",
title: "Where can I find my boarding pass?",
category: "check-in",
description:
"Your available boarding information can be accessed through your eligible trip and check-in details.",
},
{
id: "baggage-allowance",
title: "What is my baggage allowance?",
category: "baggage",
description:
"Baggage allowance depends on your itinerary, fare, cabin, and applicable booking conditions.",
},
{
id: "delayed-baggage",
title: "What should I do about delayed baggage?",
category: "baggage",
description:
"Contact the appropriate baggage support team and provide your baggage and booking information when available.",
},
{
id: "refund",
title: "How do refunds work?",
category: "payment",
description:
"Refund eligibility and processing depend on your booking conditions and applicable fare rules.",
},
{
id: "payment-problem",
title: "What should I do if my payment failed?",
category: "payment",
description:
"Review your payment details and contact support if the transaction remains unresolved.",
},
{
id: "profile",
title: "How do I update my profile?",
category: "account",
description:
"Update your personal information and travel preferences from your Profile section.",
},
{
id: "account-security",
title: "How can I secure my account?",
category: "account",
description:
"Review your security settings and enable available account protection features.",
},
] as const;

export const supportTicketCategories = [
"Booking & Reservations",
"Flights & Travel",
"Check-in & Boarding",
"Baggage",
"Payments & Refunds",
"Account & Profile",
"Other",
] as const;

export const supportTickets = [
{
id: "SOG-1001",
category: "Booking & Reservations",
subject: "Need help changing my booking",
status: "open",
priority: "normal",
createdAt: "2026-09-26T10:30:00",
updatedAt: "2026-09-26T11:15:00",
bookingReference: "SOG8K2P",
message:
"I need assistance changing the date of my upcoming flight.",
},
{
id: "SOG-1002",
category: "Baggage",
subject: "Question about baggage allowance",
status: "resolved",
priority: "low",
createdAt: "2026-09-20T14:20:00",
updatedAt: "2026-09-21T09:10:00",
bookingReference: "SOG4M7Q",
message:
"I would like to confirm the baggage allowance for my upcoming trip.",
},
] as const;

export const supportMessages = [
{
id: "MSG-1001",
ticketId: "SOG-1001",
sender: "customer",
senderName: "You",
message:
"I need assistance changing the date of my upcoming flight.",
createdAt: "2026-09-26T10:30:00",
},
{
id: "MSG-1002",
ticketId: "SOG-1001",
sender: "support",
senderName: "SOG Airways Support",
message:
"Thanks for contacting SOG Airways. Please provide your preferred new travel date so we can review the available options.",
createdAt: "2026-09-26T11:15:00",
},
{
id: "MSG-1003",
ticketId: "SOG-1002",
sender: "customer",
senderName: "You",
message:
"I would like to confirm the baggage allowance for my upcoming trip.",
createdAt: "2026-09-20T14:20:00",
},
{
id: "MSG-1004",
ticketId: "SOG-1002",
sender: "support",
senderName: "SOG Airways Support",
message:
"Your baggage allowance can be reviewed from your booking details. Please contact us if you need further assistance.",
createdAt: "2026-09-21T09:10:00",
},
] as const;

export const supportData = {
contact: {
whatsapp: "07038915140",
email: "[bronzlemmy@gmail.com](mailto:bronzlemmy@gmail.com)",
},

form: {
category: "",
subject: "",
message: "",
bookingReference: "",
},

selectedCategory: "all",

selectedTicketId: null,

tickets: supportTickets,

messages: supportMessages,
} as const;

/* ================================
Support Types
================================ */

export interface SupportCategory {
id: string;
title: string;
description: string;
}

export interface SupportTopic {
id: string;
title: string;
category: string;
description: string;
}

export interface SupportTicket {
id: string;
category: string;
subject: string;
status: "open" | "resolved";
priority: "low" | "normal" | "high";
createdAt: string;
updatedAt: string;
bookingReference: string;
message: string;
}

export interface SupportMessage {
id: string;
ticketId: string;
sender: "customer" | "support";
senderName: string;
message: string;
createdAt: string;
}

export type SupportTicketCategory =
| "Booking & Reservations"
| "Flights & Travel"
| "Check-in & Boarding"
| "Baggage"
| "Payments & Refunds"
| "Account & Profile"
| "Other";

export interface SupportData {
contact: {
whatsapp: string;
email: string;
};

form: {
category: string;
subject: string;
message: string;
bookingReference: string;
};

selectedCategory: string;
selectedTicketId: string | null;

tickets: readonly SupportTicket[];
messages: readonly SupportMessage[];
}
