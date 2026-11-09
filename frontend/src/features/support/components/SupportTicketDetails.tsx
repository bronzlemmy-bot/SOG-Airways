
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  Headphones,
  MessageSquare,
} from "lucide-react";



import type {
  SupportMessage,
  SupportTicket,
} from "@/components/user/support/support-data/SupportData";
import MessageList from "./SupportMessageList";
import MessageComposer from "./SupportMessageComposer";

interface TicketDetailsProps {
  ticket: SupportTicket;
  messages: readonly SupportMessage[];
  isSending?: boolean;
  onBack: () => void;
  onSendMessage: (message: string) => void | Promise<void>;
}

export default function TicketDetails({
  ticket,
  messages,
  isSending = false,
  onBack,
  onSendMessage,
}: TicketDetailsProps) {
  const isResolved = ticket.status === "resolved";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Ticket header */}
      <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
        <div className="flex items-start gap-3">
          <motion.button
            type="button"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            aria-label="Back to support tickets"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isResolved
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                }`}
              >
                {isResolved ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Clock3 className="h-3.5 w-3.5" />
                )}

                {isResolved ? "Resolved" : "Open"}
              </span>

              <span className="text-xs text-slate-400">
                {ticket.category}
              </span>
            </div>

            <h2 className="mt-2 break-words text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              {ticket.subject}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" />
                {ticket.id}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket information */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/30 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoItem
            icon={<Headphones className="h-4 w-4" />}
            label="Category"
            value={ticket.category}
          />

          <InfoItem
            icon={<MessageSquare className="h-4 w-4" />}
            label="Booking Reference"
            value={ticket.bookingReference || "Not provided"}
          />

          <InfoItem
            icon={<Clock3 className="h-4 w-4" />}
            label="Priority"
            value={formatPriority(ticket.priority)}
          />
        </div>
      </div>

      {/* Conversation */}
      <div className="px-4 py-5 sm:px-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Conversation
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Messages between you and SOG Airways Support.
          </p>
        </div>

        <MessageList
          messages={messages}
          ticketId={ticket.id}
        />
      </div>

      {/* Message composer */}
      <MessageComposer
        disabled={isResolved}
        isSending={isSending}
        onSend={onSendMessage}
      />

      {isResolved && (
        <div className="flex items-start gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:px-6">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />

          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              This ticket has been resolved
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Messaging is disabled for resolved tickets. Create a new
              support request if you need additional assistance.
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatPriority(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
