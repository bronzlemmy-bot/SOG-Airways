import { env } from "../../config/index.js";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailTemplateData {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | null
    | undefined;
}

export interface EmailMessage {
  to: EmailRecipient[];
  subject: string;
  text: string;
  html?: string;
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  replyTo?: string;
  templateName?: string;
  templateData?: EmailTemplateData;
  metadata?: Record<string, unknown>;
}

export interface EmailSendResult {
  success: boolean;
  provider: "disabled" | "demo" | "configured";
  status: "queued" | "sent" | "disabled" | "failed";
  messageId?: string;
  providerMessage?: string;
}

export interface EmailProvider {
  readonly isEnabled: boolean;
  sendEmail(message: EmailMessage): Promise<EmailSendResult>;
}

export class DisabledEmailProvider implements EmailProvider {
  readonly isEnabled = false;

  async sendEmail(message: EmailMessage): Promise<EmailSendResult> {
    return {
      success: false,
      provider: "disabled",
      status: "disabled",
      providerMessage:
        `Email delivery is disabled for "${message.subject}". Configure an email provider before sending transactional messages.`,
    };
  }
}

export class ResendEmailProvider implements EmailProvider {
  readonly isEnabled = true;

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async sendEmail(message: EmailMessage): Promise<EmailSendResult> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: message.to.map((recipient) => recipient.email),
        subject: message.subject,
        text: message.text,
        ...(message.html ? { html: message.html } : {}),
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        provider: "configured",
        status: "failed",
        providerMessage: `Email provider rejected the message (HTTP ${response.status}).`,
      };
    }

    const result = (await response.json()) as { id?: string };

    return {
      success: true,
      provider: "configured",
      status: "sent",
      ...(result.id ? { messageId: result.id } : {}),
    };
  }
}

export const emailProvider: EmailProvider =
  env.RESEND_API_KEY && env.EMAIL_FROM
    ? new ResendEmailProvider(env.RESEND_API_KEY, env.EMAIL_FROM)
    : new DisabledEmailProvider();

export default emailProvider;
