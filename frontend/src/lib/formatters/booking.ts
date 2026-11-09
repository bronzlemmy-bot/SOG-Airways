export function formatBookingReference(
  reference?: string,
): string {
  return reference?.trim().toUpperCase() || "N/A";
}

export function formatBookingStatus(
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

export function formatBookingType(
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

export function formatBookingClass(
  bookingClass?: string,
): string {
  if (!bookingClass) {
    return "Unknown";
  }

  return bookingClass
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatPassengerCount(
  count?: number,
): string {
  if (
    count === undefined ||
    count === null ||
    Number.isNaN(count)
  ) {
    return "0 passengers";
  }

  return `${count.toLocaleString()} ${
    count === 1 ? "passenger" : "passengers"
  }`;
}

export function formatBookingAmount(
  amount?: number,
  currency = "NGN",
): string {
  if (
    amount === undefined ||
    amount === null ||
    Number.isNaN(amount)
  ) {
    return "N/A";
  }

  return `${currency.toUpperCase()} ${amount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

export function formatBookingFlightCount(
  count?: number,
): string {
  if (
    count === undefined ||
    count === null ||
    Number.isNaN(count)
  ) {
    return "0 flights";
  }

  return `${count.toLocaleString()} ${
    count === 1 ? "flight" : "flights"
  }`;
}