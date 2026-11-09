"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import Input from "../Input";
import Textarea from "../Textarea";
import PrimaryButton from "../../buttons/PrimaryButton";
import FormError from "../FormError";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export default function ContactForm({
  onSubmit,
  loading = false,
  error,
  className = "",
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const updateField = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Send Us a Message
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Have a question about your flight or booking? Our team is
          here to help.
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <FormError message={error} />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="contact-name"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
          required
        />

        <Input
          id="contact-email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          required
        />
      </div>

      <div className="mt-5">
        <Input
          id="contact-subject"
          label="Subject"
          placeholder="What can we help you with?"
          value={formData.subject}
          onChange={(event) =>
            updateField("subject", event.target.value)
          }
          required
        />
      </div>

      <div className="mt-5">
        <Textarea
          id="contact-message"
          label="Message"
          placeholder="Write your message here..."
          value={formData.message}
          onChange={(event) =>
            updateField("message", event.target.value)
          }
          rows={6}
          required
        />
      </div>

      <div className="mt-6 flex justify-end">
        <PrimaryButton
          type="submit"
          loading={loading}
          disabled={loading}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </PrimaryButton>
      </div>
    </form>
  );
}

export type { ContactFormData };