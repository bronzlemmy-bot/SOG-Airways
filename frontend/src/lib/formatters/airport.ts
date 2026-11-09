export function formatAirportName(
  name?: string,
): string {
  return name?.trim() || "Unknown Airport";
}

export function formatAirportCode(
  code?: string,
): string {
  return code?.trim().toUpperCase() || "N/A";
}

export function formatIataCode(
  code?: string,
): string {
  return code?.trim().toUpperCase() || "N/A";
}

export function formatIcaoCode(
  code?: string,
): string {
  return code?.trim().toUpperCase() || "N/A";
}

export function formatAirportLocation(
  city?: string,
  country?: string,
): string {
  const parts = [city, country]
    .map((value) => value?.trim())
    .filter(Boolean);

  return parts.length > 0
    ? parts.join(", ")
    : "Unknown Location";
}

export function formatAirportTimezone(
  timezone?: string,
): string {
  if (!timezone) {
    return "N/A";
  }

  return timezone.replace(/_/g, " ");
}

export function formatAirportTerminalCount(
  count?: number,
): string {
  if (
    count === undefined ||
    count === null ||
    Number.isNaN(count)
  ) {
    return "N/A";
  }

  return `${count} ${
    count === 1 ? "terminal" : "terminals"
  }`;
}

export function formatAirportStatus(
  status?: string,
): string {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}