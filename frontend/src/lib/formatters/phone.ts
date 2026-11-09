export function formatPhoneNumber(
  phone?: string,
): string {
  if (!phone?.trim()) {
    return "N/A";
  }

  return phone.trim();
}

export function normalizePhoneNumber(
  phone?: string,
): string {
  if (!phone?.trim()) {
    return "";
  }

  return phone.replace(/[^\d+]/g, "");
}

export function formatPhoneInternational(
  phone?: string,
  countryCode = "+234",
): string {
  if (!phone?.trim()) {
    return "N/A";
  }

  const normalized = normalizePhoneNumber(phone);

  if (normalized.startsWith("+")) {
    return normalized;
  }

  if (normalized.startsWith("0")) {
    return `${countryCode}${normalized.slice(1)}`;
  }

  return `${countryCode}${normalized}`;
}

export function maskPhoneNumber(
  phone?: string,
): string {
  const normalized = normalizePhoneNumber(phone);

  if (!normalized) {
    return "N/A";
  }

  if (normalized.length <= 4) {
    return normalized;
  }

  const visibleDigits = normalized.slice(-4);
  const maskedLength =
    normalized.length - 4;

  return `${"*".repeat(maskedLength)}${visibleDigits}`;
}

export function formatPhoneForDisplay(
  phone?: string,
): string {
  if (!phone?.trim()) {
    return "N/A";
  }

  const normalized = normalizePhoneNumber(phone);

  if (normalized.startsWith("+")) {
    return normalized.replace(
      /(\+\d{1,3})(\d{3})(\d{3})(\d+)/,
      "$1 $2 $3 $4",
    );
  }

  return normalized.replace(
    /(\d{3})(\d{3})(\d+)/,
    "$1 $2 $3",
  );
}

export function isValidPhoneNumber(
  phone?: string,
): boolean {
  if (!phone?.trim()) {
    return false;
  }

  const normalized = normalizePhoneNumber(phone);

  const digitsOnly = normalized.replace(
    /^\+/,
    "",
  );

  return (
    /^\d+$/.test(digitsOnly) &&
    digitsOnly.length >= 7 &&
    digitsOnly.length <= 15
  );
}