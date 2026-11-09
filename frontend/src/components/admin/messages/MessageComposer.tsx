"use client";

import { useState, type FormEvent } from "react";
import {
Paperclip,
Send,
X,
} from "lucide-react";

interface MessageComposerProps {
recipientName?: string;
recipientEmail?: string;
subject?: string;
onSend: (message: string) => void;
onCancel?: () => void;
}

export default function MessageComposer({
recipientName,
recipientEmail,
subject,
onSend,
onCancel,
}: MessageComposerProps) {
const [message, setMessage] = useState("");

const trimmedMessage = message.trim();

const handleSubmit = (
event: FormEvent<HTMLFormElement>,
) => {
event.preventDefault();


if (!trimmedMessage) {
  return;
}

onSend(trimmedMessage);
setMessage("");


};

return ( <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"> <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5"> <div className="flex items-start justify-between gap-4"> <div className="min-w-0"> <h2 className="text-sm font-bold text-slate-900 dark:text-white">
{recipientName
? `Reply to ${recipientName}`
: "New Message"} </h2>

```
        {recipientEmail ? (
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {recipientEmail}
          </p>
        ) : null}

        {subject ? (
          <p className="mt-1 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
            Re: {subject}
          </p>
        ) : null}
      </div>

      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close message composer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  </div>

  <form onSubmit={handleSubmit}>
    <div className="p-4 sm:p-5">
      <label
        htmlFor="message-composer"
        className="sr-only"
      >
        Message
      </label>

      <textarea
        id="message-composer"
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        placeholder={
          recipientName
            ? `Write your reply to ${recipientName}...`
            : "Write your message..."
        }
        rows={5}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="File attachments will be connected when backend storage is added"
        >
          <Paperclip className="h-4 w-4" />
          Attach file
        </button>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-[11px] text-slate-400">
            {trimmedMessage.length} characters
          </span>

          <button
            type="submit"
            disabled={!trimmedMessage}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  </form>
</section>


);
}
