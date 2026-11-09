
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Send } from "lucide-react";

import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import Textarea from "@/components/forms/Textarea";
import FormField from "@/components/forms/FormField";
import FormError from "@/components/forms/FormError";

import SupportConfirmation from "./SupportConfirmation";
import { supportTicketCategories } from "@/components/user/support/support-data/SupportData";

export interface SupportFormSubmission {
  id: string;
  category: string;
  subject: string;
  message: string;
  bookingReference: string;
}

export interface SupportSubmissionResult {
  id: string;
  isDemo?: boolean;
}

interface SupportFormProps {
  onSubmitted?: (
    ticket: SupportFormSubmission,
  ) =>
    | void
    | SupportSubmissionResult
    | Promise<void | SupportSubmissionResult>;
}

interface FormValues {
  category: string;
  subject: string;
  message: string;
  bookingReference: string;
}

interface FormErrors {
  category?: string;
  subject?: string;
  message?: string;
}

const initialValues: FormValues = {
  category: "",
  subject: "",
  message: "",
  bookingReference: "",
};

const categoryOptions = supportTicketCategories.map((category) => ({
  label: category,
  value: category,
}));

function createDemoTicketId(): string {
  return `SOG-${Date.now().toString().slice(-8)}`;
}

export default function SupportForm({
  onSubmitted,
}: SupportFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    subject: string;
    isDemo: boolean;
  } | null>(null);

  const updateField = (
    field: keyof FormValues,
    value: string,
  ) => {
    if (field === "message" && value.length > 2000) {
      return;
    }

    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!values.category.trim()) {
      nextErrors.category = "Please select a support category.";
    }

    if (!values.subject.trim()) {
      nextErrors.subject = "Please enter a subject.";
    } else if (values.subject.trim().length < 5) {
      nextErrors.subject =
        "Subject must contain at least 5 characters.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Please describe your issue.";
    } else if (values.message.trim().length < 10) {
      nextErrors.message =
        "Message must contain at least 10 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (isSubmitting || !validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const submission: SupportFormSubmission = {
        id: "",
        category: values.category,
        subject: values.subject.trim(),
        message: values.message.trim(),
        bookingReference: values.bookingReference.trim(),
      };

      // Wait for the parent to complete the actual API or demo action.
      const result = onSubmitted
        ? await onSubmitted(submission)
        : undefined;

      const isDemo = result?.isDemo ?? !result?.id;

      const ticketId =
        result?.id || createDemoTicketId();

      setSubmittedTicket({
        id: ticketId,
        subject: submission.subject,
        isDemo,
      });

      setValues(initialValues);
      setErrors({});
      setSubmitError("");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Your support request could not be submitted. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    if (isSubmitting) return;

    setValues(initialValues);
    setErrors({});
    setSubmitError("");
  };

  if (submittedTicket) {
    return (
      <SupportConfirmation
        ticketId={submittedTicket.id}
        subject={submittedTicket.subject}
        isDemo={submittedTicket.isDemo}
        onBack={() => setSubmittedTicket(null)}
      />
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Contact Support
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Tell us what you need help with and our support team can review
          your request.
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="Support Category" required>
            <Select
              value={values.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              options={categoryOptions}
              disabled={isSubmitting}
            />

            {errors.category && (
              <FormError message={errors.category} />
            )}
          </FormField>

          <FormField label="Booking Reference">
            <Input
              value={values.bookingReference}
              onChange={(event) =>
                updateField("bookingReference", event.target.value)
              }
              placeholder="e.g. SOG8K2P"
              disabled={isSubmitting}
            />
          </FormField>
        </div>

        <FormField label="Subject" required>
          <Input
            value={values.subject}
            onChange={(event) =>
              updateField("subject", event.target.value)
            }
            placeholder="What do you need help with?"
            disabled={isSubmitting}
          />

          {errors.subject && (
            <FormError message={errors.subject} />
          )}
        </FormField>

        <FormField label="Message" required>
          <Textarea
            value={values.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            placeholder="Describe your issue or question..."
            rows={6}
            disabled={isSubmitting}
          />

          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              {errors.message ? (
                <FormError message={errors.message} />
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please provide enough detail to help us understand your
                  request.
                </p>
              )}
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              {values.message.length}/2000
            </span>
          </div>
        </FormField>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </motion.button>

          <motion.button
            type="submit"
            whileHover={!isSubmitting ? { y: -1 } : undefined}
            whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Support Request"}
          </motion.button>
        </div>
      </form>
    </motion.section>
  );
}
