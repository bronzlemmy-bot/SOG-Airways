
"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { supportData } from "@/components/user/support/support-data/SupportData";

function getEmailAddress(value: string): string {
  // Supports a plain email or a Markdown-formatted email string.
  const match = value.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );

  return match?.[0] ?? value.trim();
}

function getWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Convert a Nigerian local-format number to international format.
  const internationalNumber = digits.startsWith("0")
    ? `234${digits.slice(1)}`
    : digits;

  return `https://wa.me/${internationalNumber}`;
}

export default function SupportContactOptions() {
  const email = getEmailAddress(supportData.contact.email);
  const whatsappUrl = getWhatsAppUrl(
    supportData.contact.whatsapp,
  );

  const contactOptions = [
    {
      title: "Email Support",
      description:
        "Send your question or describe an issue with your booking.",
      detail: email,
      href: `mailto:${email}`,
      icon: Mail,
      label: "Send an email",
      accent:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      border:
        "hover:border-blue-300 dark:hover:border-blue-800",
    },
    {
      title: "WhatsApp Support",
      description:
        "Start a conversation with the SOG Airways support contact.",
      detail: supportData.contact.whatsapp,
      href: whatsappUrl,
      icon: MessageCircle,
      label: "Open WhatsApp",
      accent:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      border:
        "hover:border-emerald-300 dark:hover:border-emerald-800",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Other Ways to Contact Us
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Choose your preferred contact method for additional assistance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {contactOptions.map((option, index) => {
          const Icon = option.icon;

          return (
            <motion.a
              key={option.title}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className={`group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 ${option.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${option.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                {option.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {option.description}
              </p>

              <p className="mt-4 break-all text-sm font-medium text-slate-800 dark:text-slate-200">
                {option.detail}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:underline dark:text-blue-400">
                {option.label}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </motion.a>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />

        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Protect your travel information
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Include only the booking details needed to explain your issue.
            Never send passwords, verification codes, or payment card
            security codes in a support message.
          </p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Clock3 className="h-3.5 w-3.5 shrink-0" />
        Response times depend on the contact method and availability of
        the support team.
      </p>
    </section>
  );
}
