import type { Notification } from "../NotificationList";

export const notificationData: Notification[] = [
{
id: "notification-001",
type: "booking",
title: "Demo: Booking Preview",
message:
"Sample booking SOG8K4P2 is shown for demonstration only. It is not an operational reservation.",
time: "Today, 9:15 AM",
read: false,
actionLabel: "View booking",
actionHref: "/users/booking-details/SOG8K4P2",
},
{
id: "notification-002",
type: "flight",
title: "Demo: Flight Schedule Update",
message:
"This simulated flight schedule is sample data and is not a verified operational flight.",
time: "Today, 7:40 AM",
read: false,
actionLabel: "View trip",
actionHref: "/users/manage-trips",
},
{
id: "notification-003",
type: "payment",
title: "Demo: Payment Simulation",
message:
"A sample payment outcome is shown for booking SOG8K4P2. No money was charged or transferred.",
time: "Yesterday, 6:20 PM",
read: true,
actionLabel: "View booking",
actionHref: "/users/booking-details/SOG8K4P2",
},
{
id: "notification-004",
type: "travel",
title: "Demo: Check-in Reminder",
message:
"This sample check-in flow is for demonstration only and is not valid for an operational flight.",
time: "Yesterday, 11:30 AM",
read: false,
actionLabel: "Check in now",
actionHref: "/users/check-in/SOG8K4P2",
},
{
id: "notification-005",
type: "flight",
title: "Demo: Upcoming Flight Reminder",
message:
"This simulated itinerary is not a verified flight or travel record.",
time: "2 days ago",
read: true,
actionLabel: "Manage trip",
actionHref: "/users/manage-trips",
},
{
id: "notification-006",
type: "booking",
title: "Demo: Booking Details Preview",
message:
"Sample itinerary and passenger details are shown for demonstration only, not as a verified booking.",
time: "3 days ago",
read: true,
actionLabel: "View details",
actionHref: "/users/booking-details/SOG8K4P2",
},
{
id: "notification-007",
type: "payment",
title: "Demo: Payment Preview",
message:
"This sample payment summary is not a receipt for a real transaction. No money was charged.",
time: "4 days ago",
read: true,
actionLabel: "View payment",
actionHref: "/users/booking-details/SOG8K4P2",
},
{
id: "notification-008",
type: "travel",
title: "Demo: Travel Information",
message:
"Sample travel information only. Confirm current airport requirements through official sources before travel.",
time: "5 days ago",
read: true,
actionLabel: "Travel information",
actionHref: "/travel-information",
},
];
