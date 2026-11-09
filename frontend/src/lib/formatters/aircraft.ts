export function formatAircraftName(
  manufacturer?: string,
  model?: string,
): string {
  const parts = [manufacturer, model].filter(Boolean);

  return parts.length > 0
    ? parts.join(" ")
    : "Unknown Aircraft";
}

export function formatAircraftRegistration(
  registration?: string,
): string {
  if (!registration) {
    return "N/A";
  }

  return registration.trim().toUpperCase();
}

export function formatAircraftSeats(
  seats?: number,
): string {
  if (
    seats === undefined ||
    seats === null ||
    Number.isNaN(seats)
  ) {
    return "N/A";
  }

  return `${seats.toLocaleString()} ${
    seats === 1 ? "seat" : "seats"
  }`;
}

export function formatAircraftRange(
  range?: number,
): string {
  if (
    range === undefined ||
    range === null ||
    Number.isNaN(range)
  ) {
    return "N/A";
  }

  return `${range.toLocaleString()} km`;
}

export function formatAircraftStatus(
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