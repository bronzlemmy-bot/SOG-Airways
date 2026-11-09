import {
  emailProvider,
  type EmailProvider,
} from "../../integrations/email/email.provider.js";
import {
  emailQueue,
  type EmailQueue,
} from "../queues/email.queue.js";

export interface NewsletterSchedulerConfig {
  enabled: boolean;
  intervalMinutes: number;
}

export interface NewsletterSchedulerStatus {
  enabled: boolean;
  configured: boolean;
  operational: false;
  intervalMinutes: number;
  scheduleEngineAvailable: false;
  emailQueueAvailable: boolean;
  emailProviderAvailable: boolean;
  reason: string;
  queueStatusError?: string;
}

export interface NewsletterSchedulerRunResult {
  status: "disabled" | "unavailable";
  reason: string;
}

export interface NewsletterScheduler {
  getStatus(): Promise<NewsletterSchedulerStatus>;
  runOnce(): Promise<NewsletterSchedulerRunResult>;
}

export const DEFAULT_NEWSLETTER_SCHEDULER_CONFIG: Readonly<NewsletterSchedulerConfig> =
  Object.freeze({
    enabled: false,
    intervalMinutes: 1440,
  });

export class DisabledNewsletterScheduler
  implements NewsletterScheduler
{
  constructor(
    private readonly config: NewsletterSchedulerConfig =
      DEFAULT_NEWSLETTER_SCHEDULER_CONFIG,
    private readonly queue: EmailQueue = emailQueue,
    private readonly provider: EmailProvider = emailProvider,
  ) {
    if (
      !Number.isInteger(config.intervalMinutes) ||
      config.intervalMinutes < 1
    ) {
      throw new RangeError(
        "Newsletter scheduler intervalMinutes must be a positive integer.",
      );
    }
  }

  async getStatus(): Promise<NewsletterSchedulerStatus> {
    let queueAvailable = false;
    let queueStatusError: string | undefined;

    try {
      const queueStatus = await this.queue.getStatus();
      queueAvailable = this.queue.isAvailable && queueStatus.available;
    } catch (error: unknown) {
      queueStatusError =
        error instanceof Error
          ? error.message
          : "Queue status could not be retrieved due to an unknown error.";
    }

    const blockers = [
      "No scheduling engine is configured.",
      "No newsletter campaign or content source is configured.",
      ...(!queueAvailable
        ? ["The email queue is unavailable."]
        : []),
      ...(!this.provider.isEnabled
        ? ["The email provider is disabled."]
        : []),
      ...(queueStatusError
        ? [`Email queue status check failed: ${queueStatusError}`]
        : []),
    ];

    return {
      enabled: this.config.enabled,
      configured: false,
      operational: false,
      intervalMinutes: this.config.intervalMinutes,
      scheduleEngineAvailable: false,
      emailQueueAvailable: queueAvailable,
      emailProviderAvailable: this.provider.isEnabled,
      reason: blockers.join(" "),
      queueStatusError,
    };
  }

  async runOnce(): Promise<NewsletterSchedulerRunResult> {
    if (!this.config.enabled) {
      return {
        status: "disabled",
        reason: "Newsletter scheduling is disabled.",
      };
    }

    const status = await this.getStatus();
    return {
      status: "unavailable",
      reason: status.reason,
    };
  }
}

export const newsletterScheduler: NewsletterScheduler =
  new DisabledNewsletterScheduler();

export default newsletterScheduler;
