
"use client";

import { motion } from "framer-motion";
import { Headphones, UserRound } from "lucide-react";

import type { SupportMessage } from "@/components/user/support/support-data/SupportData";

interface MessageListProps {
  messages: readonly SupportMessage[];
  ticketId: string;
}

export default function MessageList({
  messages,
  ticketId,
}: MessageListProps) {
  const ticketMessages = messages
    .filter((message) => message.ticketId === ticketId)
    .slice()
    .sort(
      (first, second) =>
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime(),
    );

  if (ticketMessages.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-950/40">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Headphones className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
            No messages yet
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Send a message below to continue this support conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ticketMessages.map((message, index) => {
        const isCustomer = message.sender === "customer";

        return (
          <motion.div
            key={message.id}
            initial={{
              opacity: 0,
              y: 10,
              x: isCustomer ? 10 : -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
            }}
            transition={{
              duration: 0.3,
              delay: Math.min(index * 0.04, 0.2),
            }}
            className={`flex ${
              isCustomer ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[92%] gap-3 sm:max-w-[78%] ${
                isCustomer ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isCustomer
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {isCustomer ? (
                  <UserRound className="h-4 w-4" />
                ) : (
                  <Headphones className="h-4 w-4" />
                )}
              </div>

              <div
                className={`flex min-w-0 flex-col ${
                  isCustomer ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`mb-1 flex flex-wrap items-center gap-2 ${
                    isCustomer ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {message.senderName}
                  </span>

                  <time
                    dateTime={message.createdAt}
                    className="text-[11px] text-slate-400"
                  >
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isCustomer
                      ? "rounded-tr-md bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "rounded-tl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function formatMessageTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
