import { notificationService } from "../../modules/notifications/services/notification.service.js";
import { NOTIFICATION_TYPES } from "../../modules/notifications/models/notification.model.js";
import type { CreateNotificationInput } from "../../modules/notifications/types/notification.types.js";
import {
  notificationQueue,
  type NotificationQueue,
  type NotificationQueueJob,
} from "../queues/notification.queue.js";

type NotificationCreator = Pick<typeof notificationService, "create">;

export type NotificationWorkerResult =
  | { status: "idle" }
  | { status: "disabled"; jobId?: string; reason: string }
  | {
      status: "created";
      jobId: string;
      attempt: number;
      notificationId: string;
    }
  | {
      status: "failed";
      jobId?: string;
      attempt?: number;
      error: string;
    };

function validateJob(job: NotificationQueueJob): string | undefined {
  if (!job.id.trim()) return "Notification job ID is required.";
  if (!job.recipientId.trim()) return "Notification recipient is required.";
  if (!job.title.trim()) return "Notification title is required.";
  if (!job.message.trim()) return "Notification message is required.";
  if (
    !NOTIFICATION_TYPES.some((notificationType) =>
      Object.is(notificationType, job.type),
    )
  ) {
    return "Notification type is unsupported.";
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Notification job processing failed with an unknown error.";
}

export class NotificationWorker {
  constructor(
    private readonly queue: NotificationQueue = notificationQueue,
    private readonly service: NotificationCreator = notificationService,
  ) {}

  async processNext(): Promise<NotificationWorkerResult> {
    if (!this.queue.isAvailable) {
      return {
        status: "disabled",
        reason: "Notification queue is unavailable; no job was retrieved.",
      };
    }

    let job: NotificationQueueJob | null;
    try {
      job = await this.queue.processNext();
    } catch (error: unknown) {
      return { status: "failed", error: errorMessage(error) };
    }

    if (!job) return { status: "idle" };
    return this.processJob(job);
  }

  async processJob(
    job: NotificationQueueJob,
  ): Promise<NotificationWorkerResult> {
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

    try {
      const input: CreateNotificationInput = {
        recipient: job.recipientId,
        type: job.type,
        title: job.title,
        message: job.message,
        priority: job.priority,
        metadata: job.metadata,
      };
      const notification = await this.service.create(input);

      return {
        status: "created",
        jobId: job.id,
        attempt,
        notificationId: notification._id.toString(),
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

export const notificationWorker = new NotificationWorker();

export default notificationWorker;
