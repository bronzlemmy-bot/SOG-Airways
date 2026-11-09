"use client";

import { motion } from "framer-motion";
import {
CheckCircle2,
Clock3,
CircleX,
Plane,
RefreshCw,
ShieldCheck,
} from "lucide-react";

export type BookingStatusValue =
| "confirmed"
| "pending"
| "completed"
| "cancelled"
| "processing"
| "checked-in"
| "unknown"
| string;

interface BookingStatusProps {
status: BookingStatusValue;
showIcon?: boolean;
animated?: boolean;
className?: string;
}

const getStatusConfig = (status: BookingStatusValue) => {
const normalizedStatus = status
.trim()
.toLowerCase()
.replace(/[_\s]+/g, "-");

switch (normalizedStatus) {
case "confirmed":
return {
label: "Confirmed",
icon: CheckCircle2,
className:
"bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
iconClassName: "text-emerald-600",
};

case "pending":
  return {
    label: "Pending",
    icon: Clock3,
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    iconClassName: "text-amber-600",
  };

case "completed":
  return {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    iconClassName: "text-sky-600",
  };

case "cancelled":
case "canceled":
  return {
    label: "Cancelled",
    icon: CircleX,
    className:
      "bg-red-50 text-red-700 ring-1 ring-red-200",
    iconClassName: "text-red-600",
  };

case "processing":
  return {
    label: "Processing",
    icon: RefreshCw,
    className:
      "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    iconClassName: "text-violet-600",
  };

case "checked-in":
case "checkedin":
  return {
    label: "Checked In",
    icon: ShieldCheck,
    className:
      "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    iconClassName: "text-indigo-600",
  };

default:
  return {
    label: status.trim() !== "" ? status : "Unknown",
    icon: Plane,
    className:
      "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    iconClassName: "text-slate-500",
  };


}
};

export default function BookingStatus({
status,
showIcon = true,
animated = true,
className = "",
}: BookingStatusProps) {
const config = getStatusConfig(status);
const Icon = config.icon;

const content = (
<span
className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
>
{showIcon && (
<Icon
className={`h-3.5 w-3.5 shrink-0 ${config.iconClassName} ${
            status.trim().toLowerCase() === "processing"
              ? "animate-spin"
              : ""
          }`}
/>
)}


  <span>{config.label}</span>
</span>


);

if (!animated) {
return content;
}

return (
<motion.span
initial={{ opacity: 0, scale: 0.92 }}
animate={{ opacity: 1, scale: 1 }}
transition={{
duration: 0.25,
ease: "easeOut",
}}
className="inline-flex"
>
{content}
</motion.span>
);
}
