export type AdminMessageStatus =
| "unread"
| "read"
| "archived";

export type AdminMessagePriority =
| "low"
| "normal"
| "high"
| "urgent";

export type AdminMessageType =
| "general"
| "booking"
| "flight"
| "payment"
| "support"
| "complaint";

export interface AdminMessage {
id: string;
conversationId: string;

senderName: string;
senderEmail: string;
senderPhone?: string;

subject: string;
message: string;

type: AdminMessageType;
priority: AdminMessagePriority;
status: AdminMessageStatus;

createdAt: string;
updatedAt: string;

bookingReference?: string;
flightNumber?: string;

avatarUrl?: string;
}

export interface AdminConversationMessage {
id: string;
conversationId: string;

senderId: string;
senderName: string;
senderRole: "customer" | "admin";

message: string;

createdAt: string;
read: boolean;
}

export interface AdminMessageConversation {
id: string;

customerName: string;
customerEmail: string;
customerPhone?: string;

subject: string;

type: AdminMessageType;
priority: AdminMessagePriority;
status: AdminMessageStatus;

bookingReference?: string;
flightNumber?: string;

messages: AdminConversationMessage[];

createdAt: string;
updatedAt: string;
}

export interface AdminMessageSummary {
id: string;
label: string;
value: string;
description: string;
type:
| "total"
| "unread"
| "read"
| "urgent";
}

export const adminMessagesData: AdminMessage[] = [
{
id: "message-001",
conversationId: "conversation-001",
senderName: "Daniel Adeyemi",
senderEmail: "[daniel.adeyemi@example.com](mailto:daniel.adeyemi@example.com)",
senderPhone: "+2348012345678",
subject: "Question about my booking",
message:
"Hello SOG Airways, I would like to confirm the baggage allowance included with my booking.",
type: "booking",
priority: "normal",
status: "unread",
createdAt: "2026-09-28T08:30:00.000Z",
updatedAt: "2026-09-28T08:30:00.000Z",
bookingReference: "SOG8K4P2",
},
{
id: "message-002",
conversationId: "conversation-002",
senderName: "Amaka Okafor",
senderEmail: "[amaka.okafor@example.com](mailto:amaka.okafor@example.com)",
senderPhone: "+2348023456789",
subject: "Flight schedule inquiry",
message:
"Please can you confirm the departure time for my upcoming flight from Lagos to Abuja?",
type: "flight",
priority: "high",
status: "unread",
createdAt: "2026-09-28T07:15:00.000Z",
updatedAt: "2026-09-28T07:15:00.000Z",
bookingReference: "SOG3M7Q9",
flightNumber: "SOG101",
},
{
id: "message-003",
conversationId: "conversation-003",
senderName: "Michael Johnson",
senderEmail: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
subject: "Payment confirmation",
message:
"I made a payment for my booking but I have not received the confirmation email yet.",
type: "payment",
priority: "high",
status: "read",
createdAt: "2026-09-27T15:45:00.000Z",
updatedAt: "2026-09-27T16:10:00.000Z",
bookingReference: "SOG6T2L5",
},
{
id: "message-004",
conversationId: "conversation-004",
senderName: "Fatima Bello",
senderEmail: "[fatima.bello@example.com](mailto:fatima.bello@example.com)",
senderPhone: "+2348034567890",
subject: "Special assistance request",
message:
"I will need wheelchair assistance at the airport for my upcoming journey.",
type: "support",
priority: "normal",
status: "read",
createdAt: "2026-09-27T11:20:00.000Z",
updatedAt: "2026-09-27T12:00:00.000Z",
bookingReference: "SOG9R1X8",
},
{
id: "message-005",
conversationId: "conversation-005",
senderName: "David Williams",
senderEmail: "[david.williams@example.com](mailto:david.williams@example.com)",
subject: "Delayed flight complaint",
message:
"My flight was delayed and I would like to understand the reason for the delay and what assistance is available.",
type: "complaint",
priority: "urgent",
status: "unread",
createdAt: "2026-09-26T18:40:00.000Z",
updatedAt: "2026-09-26T18:40:00.000Z",
bookingReference: "SOG2N5V7",
flightNumber: "SOG515",
},
{
id: "message-006",
conversationId: "conversation-006",
senderName: "Grace Eze",
senderEmail: "[grace.eze@example.com](mailto:grace.eze@example.com)",
subject: "General inquiry",
message:
"I would like to know whether meals are available on international flights.",
type: "general",
priority: "low",
status: "read",
createdAt: "2026-09-26T09:15:00.000Z",
updatedAt: "2026-09-26T09:15:00.000Z",
},
{
id: "message-007",
conversationId: "conversation-007",
senderName: "Ibrahim Musa",
senderEmail: "[ibrahim.musa@example.com](mailto:ibrahim.musa@example.com)",
subject: "Booking cancellation",
message:
"I need assistance with cancelling my upcoming booking and understanding the applicable charges.",
type: "booking",
priority: "normal",
status: "archived",
createdAt: "2026-09-25T14:30:00.000Z",
updatedAt: "2026-09-25T15:05:00.000Z",
bookingReference: "SOG4P8W3",
},
{
id: "message-008",
conversationId: "conversation-008",
senderName: "Sofia Martinez",
senderEmail: "[sofia.martinez@example.com](mailto:sofia.martinez@example.com)",
subject: "International travel information",
message:
"Could you please provide information about the documents required for my international trip?",
type: "general",
priority: "normal",
status: "read",
createdAt: "2026-09-24T10:00:00.000Z",
updatedAt: "2026-09-24T10:20:00.000Z",
},
];

export const adminMessageConversationsData: AdminMessageConversation[] =
[
{
id: "conversation-001",
customerName: "Daniel Adeyemi",
customerEmail: "[daniel.adeyemi@example.com](mailto:daniel.adeyemi@example.com)",
customerPhone: "+2348012345678",
subject: "Question about my booking",
type: "booking",
priority: "normal",
status: "unread",
bookingReference: "SOG8K4P2",
messages: [
{
id: "conversation-message-001",
conversationId: "conversation-001",
senderId: "customer-001",
senderName: "Daniel Adeyemi",
senderRole: "customer",
message:
"Hello SOG Airways, I would like to confirm the baggage allowance included with my booking.",
createdAt: "2026-09-28T08:30:00.000Z",
read: false,
},
],
createdAt: "2026-09-28T08:30:00.000Z",
updatedAt: "2026-09-28T08:30:00.000Z",
},
{
id: "conversation-002",
customerName: "Amaka Okafor",
customerEmail: "[amaka.okafor@example.com](mailto:amaka.okafor@example.com)",
customerPhone: "+2348023456789",
subject: "Flight schedule inquiry",
type: "flight",
priority: "high",
status: "unread",
bookingReference: "SOG3M7Q9",
flightNumber: "SOG101",
messages: [
{
id: "conversation-message-002",
conversationId: "conversation-002",
senderId: "customer-002",
senderName: "Amaka Okafor",
senderRole: "customer",
message:
"Please can you confirm the departure time for my upcoming flight from Lagos to Abuja?",
createdAt: "2026-09-28T07:15:00.000Z",
read: false,
},
],
createdAt: "2026-09-28T07:15:00.000Z",
updatedAt: "2026-09-28T07:15:00.000Z",
},
];

export const adminMessageSummaries: AdminMessageSummary[] = [
{
id: "total",
label: "Total Messages",
value: adminMessagesData.length.toString(),
description:
"All customer messages currently available.",
type: "total",
},
{
id: "unread",
label: "Unread",
value: adminMessagesData
.filter((message) => message.status === "unread")
.length.toString(),
description:
"Messages waiting for an admin response.",
type: "unread",
},
{
id: "read",
label: "Read",
value: adminMessagesData
.filter((message) => message.status === "read")
.length.toString(),
description:
"Messages that have already been reviewed.",
type: "read",
},
{
id: "urgent",
label: "Urgent",
value: adminMessagesData
.filter(
(message) =>
message.priority === "urgent",
)
.length.toString(),
description:
"Messages requiring urgent attention.",
type: "urgent",
},
];
