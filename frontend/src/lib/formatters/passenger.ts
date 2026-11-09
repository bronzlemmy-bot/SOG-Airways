export function formatPassengerName(
  firstName?: string,
  lastName?: string,
  middleName?: string,
): string {
  const parts = [
    firstName,
    middleName,
    lastName,
  ]
    .map((value) => value?.trim())
    .filter(Boolean);

  return parts.length > 0
    ? parts.join(" ")
    : "Unknown Passenger";
}

export function formatPassengerShortName(
  firstName?: string,
  lastName?: string,
): string {
  const first = firstName?.trim();
  const last = lastName?.trim();

  if (!first && !last) {
    return "Unknown Passenger";
  }

  if (!first) {
    return last as string;
  }

  if (!last) {
    return first;
  }

  return `${first} ${last}`;
}

export function formatPassengerInitials(
  firstName?: string,
  lastName?: string,
): string {
  const firstInitial =
    firstName?.trim().charAt(0) || "";

  const lastInitial =
    lastName?.trim().charAt(0) || "";

  const initials = `${firstInitial}${lastInitial}`
    .toUpperCase();

  return initials || "NA";
}

export function formatPassengerType(
  passengerType?: string,
): string {
  if (!passengerType) {
    return "Unknown";
  }

  return passengerType
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatPassengerStatus(
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

export function formatPassengerGender(
  gender?: string,
): string {
  if (!gender) {
    return "Not specified";
  }

  return gender
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatPassengerDocument(
  documentNumber?: string,
): string {
  if (!documentNumber?.trim()) {
    return "N/A";
  }

  const value = documentNumber.trim();

  if (value.length <= 4) {
    return value;
  }

  return `•••• ${value.slice(-4)}`;
}

export function formatFrequentFlyerNumber(
  number?: string,
): string {
  return number?.trim().toUpperCase() || "N/A";
}

export function formatPassengerTrips(
  trips?: number,
): string {
  if (
    trips === undefined ||
    trips === null ||
    Number.isNaN(trips)
  ) {
    return "0 trips";
  }

  return `${trips.toLocaleString()} ${
    trips === 1 ? "trip" : "trips"
  }`;
}

export function formatPassengerBookings(
  bookings?: number,
): string {
  if (
    bookings === undefined ||
    bookings === null ||
    Number.isNaN(bookings)
  ) {
    return "0 bookings";
  }

  return `${bookings.toLocaleString()} ${
    bookings === 1 ? "booking" : "bookings"
  }`;
}