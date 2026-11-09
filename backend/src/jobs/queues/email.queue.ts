import type { EmailMessage } from "../../integrations/email/email.provider.js";

export type EmailQueueJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "disabled";

export interface EmailQueueJob {
  id: string;
  recipient: string;
  subject: string;
  text: string;
  html?: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  status: EmailQueueJobStatus;
  attempts: number;
  errorMessage?: string;
}

export interface EmailQueueStatus {
  available: boolean;
  mode: "disabled" | "configured";
  queueName: string;
  totalQueued: number;
  lastError?: string;
}

export interface CreateEmailQueueJobInput extends Pick<EmailMessage, "to" | "subject" | "text" | "html" | "templateName" | "templateData" | "metadata"> {
  id?: string;
  recipient?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailQueue {
  readonly isAvailable: boolean;
  readonly queueName: string;
  enqueue(job: CreateEmailQueueJobInput): Promise<EmailQueueJob>;
  getJob(jobId: string): Promise<EmailQueueJob | null>;
  listJobs(): Promise<EmailQueueJob[]>;
  processNext(): Promise<EmailQueueJob | null>;
  clear(): Promise<void>;
  getStatus(): Promise<EmailQueueStatus>;
}

function generateQueueId(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();

  return `${prefix}-${timestamp}-${randomPart}`;
}

export class DisabledEmailQueue implements EmailQueue {
  readonly isAvailable = false;
  readonly queueName = "email";
  private readonly jobs = new Map<string, EmailQueueJob>();

  async enqueue(job: CreateEmailQueueJobInput): Promise<EmailQueueJob> {
    const jobId = job.id ?? generateQueueId("EMAIL");
    const recipient = job.recipient ?? job.to[0]?.email ?? "unknown@localhost";
    const now = new Date();

    const queueJob: EmailQueueJob = {
      id: jobId,
      recipient,
      subject: job.subject,
      text: job.text,
      html: job.html,
      templateId: job.templateName,
      templateData: job.templateData ?? {},
      metadata: job.metadata ?? {},
      createdAt: now,
      updatedAt: now,
      status: "disabled",
      attempts: 0,
      errorMessage:
        "Email queue is disabled. Configure an operational queue before sending transactional messages.",
    };

    this.jobs.set(jobId, queueJob);

    return queueJob;
  }

  async getJob(jobId: string): Promise<EmailQueueJob | null> {
    return this.jobs.get(jobId) ?? null;
  }

  async listJobs(): Promise<EmailQueueJob[]> {
    return Array.from(this.jobs.values());
  }

  async processNext(): Promise<EmailQueueJob | null> {
    return null;
  }

  async clear(): Promise<void> {
    this.jobs.clear();
  }

  async getStatus(): Promise<EmailQueueStatus> {
    return {
      available: false,
      mode: "disabled",
      queueName: this.queueName,
      totalQueued: this.jobs.size,
      lastError:
        "Email queue is disabled. No jobs are processed until a queue backend is configured.",
    };
  }
}

export const emailQueue: EmailQueue = new DisabledEmailQueue();

export default emailQueue;
