
"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface MessageComposerProps {
  disabled?: boolean;
  isSending?: boolean;
  onSend: (message: string) => void | Promise<void>;
}

export default function MessageComposer({
  disabled = false,
  isSending = false,
  onSend,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled || isSending) {
      return;
    }

    await onSend(trimmedMessage);

    setMessage("");
  };

  const canSend =
    message.trim().length > 0 &&
    !disabled &&
    !isSending;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="support-message"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Your message
          </label>

          <textarea
            id="support-message"
            value={message}
            onChange={(event) => {
              if (event.target.value.length <= 2000) {
                setMessage(event.target.value);
              }
            }}
            placeholder={
              disabled
                ? "Select a support ticket to reply."
                : "Write a reply..."
            }
            disabled={disabled || isSending}
            rows={3}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800 dark:disabled:bg-slate-950/50"
          />

          <div className="mt-1 flex justify-end">
            <span className="text-xs text-slate-400">
              {message.length}/2000
            </span>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={canSend ? { y: -1 } : undefined}
          whileTap={canSend ? { scale: 0.98 } : undefined}
          disabled={!canSend}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto"
        >
          <Send className="h-4 w-4" />

          {isSending ? "Sending..." : "Send"}
        </motion.button>
      </div>
    </form>
  );
}

