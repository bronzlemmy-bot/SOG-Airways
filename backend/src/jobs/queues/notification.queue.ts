import type {
  NotificationPriority,
  NotificationType,
} from "../../modules/notifications/types/notification.types.js";

export type NotificationQueueJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "disabled";

export interface NotificationQueueJob {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  status: NotificationQueueJobStatus;
  attempts: number;
  errorMessage?: string;
}

export interface NotificationQueueStatus {
  available: boolean;
  mode: "disabled" | "configured";
  queueName: string;
  totalQueued: number;
  lastError?: string;
}

export interface CreateNotificationQueueJobInput {
  id?: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
}

export interface NotificationQueue {
  readonly isAvailable: boolean;
  readonly queueName: string;
  enqueue(job: CreateNotificationQueueJobInput): Promise<NotificationQueueJob>;
  getJob(jobId: string): Promise<NotificationQueueJob | null>;
  listJobs(): Promise<NotificationQueueJob[]>;
  processNext(): Promise<NotificationQueueJob | null>;
  clear(): Promise<void>;
  getStatus(): Promise<NotificationQueueStatus>;
}

function generateQueueId(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();

  return `${prefix}-${timestamp}-${randomPart}`;
}

export class DisabledNotificationQueue implements NotificationQueue {
  readonly isAvailable = false;
  readonly queueName = "notification";
  private readonly jobs = new Map<string, NotificationQueueJob>();

  async enqueue(
    job: CreateNotificationQueueJobInput,
  ): Promise<NotificationQueueJob> {
    const jobId = job.id ?? generateQueueId("NOTIFY");
    const now = new Date();

    const queueJob: NotificationQueueJob = {
      id: jobId,
      recipientId: job.recipientId,
      title: job.title,
      message: job.message,
      type: job.type,
      priority: job.priority,
      metadata: job.metadata ?? {},
      createdAt: now,
      updatedAt: now,
      status: "disabled",
      attempts: 0,
      errorMessage:
        "Notification queue is disabled. Configure a queue implementation before dispatching application notifications.",
    };

    this.jobs.set(jobId, queueJob);

    return queueJob;
  }

  async getJob(jobId: string): Promise<NotificationQueueJob | null> {
    return this.jobs.get(jobId) ?? null;
  }

  async listJobs(): Promise<NotificationQueueJob[]> {
    return Array.from(this.jobs.values());
  }

  async processNext(): Promise<NotificationQueueJob | null> {
    return null;
  }

  async clear(): Promise<void> {
    this.jobs.clear();
  }

  async getStatus(): Promise<NotificationQueueStatus> {
    return {
      available: false,
      mode: "disabled",
      queueName: this.queueName,
      totalQueued: this.jobs.size,
      lastError:
        "Notification queue is disabled. No jobs are processed until a queue backend is configured.",
    };
  }
}

export const notificationQueue: NotificationQueue =
  new DisabledNotificationQueue();

export default notificationQueue;
