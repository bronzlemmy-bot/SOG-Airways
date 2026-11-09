export function formatStatus(
  status?: string,
): string {
  if (!status) {
    return "Unknown";
  }

  return status
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatStatusLowercase(
  status?: string,
): string {
  return status?.trim().toLowerCase() || "";
}

export function formatStatusUppercase(
  status?: string,
): string {
  return status?.trim().toUpperCase() || "";
}

export function isStatus(
  status: string | undefined,
  expectedStatus: string,
): boolean {
  if (!status) {
    return false;
  }

  return (
    status.trim().toLowerCase() ===
    expectedStatus.trim().toLowerCase()
  );
}

export function isActiveStatus(
  status?: string,
): boolean {
  return isStatus(status, "active");
}

export function isPendingStatus(
  status?: string,
): boolean {
  return isStatus(status, "pending");
}

export function isCompletedStatus(
  status?: string,
): boolean {
  return (
    isStatus(status, "completed") ||
    isStatus(status, "successful") ||
    isStatus(status, "resolved")
  );
}

export function isCancelledStatus(
  status?: string,
): boolean {
  return (
    isStatus(status, "cancelled") ||
    isStatus(status, "canceled")
  );
}

export function isFailedStatus(
  status?: string,
): boolean {
  return (
    isStatus(status, "failed") ||
    isStatus(status, "blocked")
  );
}

export function isInProgressStatus(
  status?: string,
): boolean {
  return (
    isStatus(status, "in-progress") ||
    isStatus(status, "processing") ||
    isStatus(status, "boarding")
  );
}