export function formatFlightNumber(
  flightNumber?: string,
): string {
  return flightNumber?.trim().toUpperCase() || "N/A";
}

export function formatFlightStatus(
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

export function formatFlightType(
  type?: string,
): string {
  if (!type) {
    return "Unknown";
  }

  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatCabinClass(
  cabinClass?: string,
): string {
  if (!cabinClass) {
    return "Unknown";
  }

  return cabinClass
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatFlightRoute(
  departure?: string,
  arrival?: string,
): string {
  const departureCode =
    departure?.trim().toUpperCase();

  const arrivalCode =
    arrival?.trim().toUpperCase();

  if (!departureCode && !arrivalCode) {
    return "Unknown Route";
  }

  if (!departureCode) {
    return `N/A → ${arrivalCode}`;
  }

  if (!arrivalCode) {
    return `${departureCode} → N/A`;
  }

  return `${departureCode} → ${arrivalCode}`;
}

export function formatFlightDuration(
  durationMinutes?: number,
): string {
  if (
    durationMinutes === undefined ||
    durationMinutes === null ||
    Number.isNaN(durationMinutes) ||
    durationMinutes < 0
  ) {
    return "N/A";
  }

  const hours = Math.floor(
    durationMinutes / 60,
  );

  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function formatFlightDelay(
  delayMinutes?: number,
): string {
  if (
    delayMinutes === undefined ||
    delayMinutes === null ||
    Number.isNaN(delayMinutes) ||
    delayMinutes <= 0
  ) {
    return "On time";
  }

  const hours = Math.floor(
    delayMinutes / 60,
  );

  const minutes = delayMinutes % 60;

  if (hours === 0) {
    return `${minutes} min delayed`;
  }

  if (minutes === 0) {
    return `${hours} hr delayed`;
  }

  return `${hours} hr ${minutes} min delayed`;
}

export function formatAvailableSeats(
  availableSeats?: number,
  totalSeats?: number,
): string {
  if (
    availableSeats === undefined ||
    availableSeats === null ||
    Number.isNaN(availableSeats)
  ) {
    return "N/A";
  }

  if (
    totalSeats === undefined ||
    totalSeats === null ||
    Number.isNaN(totalSeats)
  ) {
    return `${availableSeats.toLocaleString()} available`;
  }

  return `${availableSeats.toLocaleString()} / ${totalSeats.toLocaleString()} seats`;
}

export function formatFlightGate(
  gate?: string,
): string {
  return gate?.trim().toUpperCase() || "TBD";
}

export function formatBaggageClaim(
  baggageClaim?: string,
): string {
  return (
    baggageClaim?.trim().toUpperCase() ||
    "TBD"
  );
}