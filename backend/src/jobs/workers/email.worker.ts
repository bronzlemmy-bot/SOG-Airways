import {
  emailProvider,
  type EmailMessage,
  type EmailProvider,
  type EmailTemplateData,
} from "../../integrations/email/email.provider.js";
import {
  emailQueue,
  type EmailQueue,
  type EmailQueueJob,
} from "../queues/email.queue.js";

export type EmailWorkerResult =
  | { status: "idle" }
  | { status: "disabled"; jobId?: string; reason: string }
  | {
      status: "processed";
      jobId: string;
      attempt: number;
      messageId?: string;
    }
  | {
      status: "failed";
      jobId?: string;
      attempt?: number;
      error: string;
    };

function isTemplateData(
  value: Record<string, unknown> | undefined,
): value is EmailTemplateData {
  if (!value) return true;

  return Object.values(value).every(
    (item) =>
      item === null ||
      item === undefined ||
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean" ||
      item instanceof Date,
  );
}

function validateJob(job: EmailQueueJob): string | undefined {
  if (!job.id.trim()) return "Email job ID is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(job.recipient)) {
    return "A valid email recipient is required.";
  }
  if (!job.subject.trim()) return "Email subject is required.";
  if (!job.text.trim()) return "Email text content is required.";
  if (!isTemplateData(job.templateData)) {
    return "Email template data contains unsupported values.";
  }
}

function toEmailMessage(job: EmailQueueJob): EmailMessage {
  const templateData = job.templateData;

  return {
    to: [{ email: job.recipient }],
    subject: job.subject,
    text: job.text,
    html: job.html,
    templateName: job.templateId,
    templateData:
      templateData && isTemplateData(templateData)
        ? templateData
        : undefined,
    metadata: job.metadata,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Email job processing failed with an unknown error.";
}

export class EmailWorker {
  constructor(
    private readonly queue: EmailQueue = emailQueue,
    private readonly provider: EmailProvider = emailProvider,
  ) {}

  async processNext(): Promise<EmailWorkerResult> {
    if (!this.queue.isAvailable) {
      return {
        status: "disabled",
        reason: "Email queue is unavailable; no job was retrieved.",
      };
    }

    if (!this.provider.isEnabled) {
      return {
        status: "disabled",
        reason: "Email provider is disabled; no email will be sent.",
      };
    }

    let job: EmailQueueJob | null;
    try {
      job = await this.queue.processNext();
    } catch (error: unknown) {
      return { status: "failed", error: errorMessage(error) };
    }

    if (!job) return { status: "idle" };
    return this.processJob(job);
  }

  async processJob(job: EmailQueueJob): Promise<EmailWorkerResult> {
    const attempt = job.attempts + 1;
    const validationError = validateJob(job);
    if (validationError) {
      return {
        status: "failed",
        jobId: job.id,
        attempt,
        error: validationError,
      };
    }

    if (!this.provider.isEnabled) {
      return {
        status: "disabled",
        jobId: job.id,
        reason: "Email provider is disabled; no email was sent.",
      };
    }

    try {
      const result = await this.provider.sendEmail(toEmailMessage(job));
      if (!result.success) {
        return result.status === "disabled"
          ? {
              status: "disabled",
              jobId: job.id,
              reason:
                result.providerMessage ??
                "Email provider declined delivery; no email was sent.",
            }
          : {
              status: "failed",
              jobId: job.id,
              attempt,
              error:
                result.providerMessage ??
                "Email provider reported unsuccessful delivery.",
            };
      }

      return {
        status: "processed",
        jobId: job.id,
        attempt,
        messageId: result.messageId,
      };
    } catch (error: unknown) {
      return {
        status: "failed",
        jobId: job.id,
        attempt,
        error: errorMessage(error),
      };
    }
  }
}

export const emailWorker = new EmailWorker();

export default emailWorker;
