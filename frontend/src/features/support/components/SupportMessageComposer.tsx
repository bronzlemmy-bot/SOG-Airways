
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Send } from "lucide-react";

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
  const [error, setError] = useState("");

  const canSend =
    message.trim().length > 0 &&
    !disabled &&
    !isSending;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled || isSending) {
      return;
    }

    setError("");

    try {
      await onSend(trimmedMessage);
      setMessage("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your reply could not be sent. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="feature-support-message"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Your message
          </label>

          <textarea
            id="feature-support-message"
            value={message}
            onChange={(event) => {
              if (event.target.value.length <= 2000) {
                setMessage(event.target.value);
                setError("");
              }
            }}
            placeholder={
              disabled
                ? "Select an open support ticket to reply."
                : "Write a reply..."
            }
            disabled={disabled || isSending}
            rows={3}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800 dark:disabled:bg-slate-950/50"
          />

          <div className="mt-1 flex items-center justify-between gap-3">
            {error ? (
              <p
                role="alert"
                className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep your reply under 2,000 characters.
              </p>
            )}

            <span className="shrink-0 text-xs text-slate-400">
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
