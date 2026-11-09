export function formatPaymentReference(
  reference?: string,
): string {
  return reference?.trim().toUpperCase() || "N/A";
}

export function formatPaymentStatus(
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

export function formatPaymentMethod(
  method?: string,
): string {
  if (!method) {
    return "Unknown";
  }

  return method
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatCardBrand(
  brand?: string,
): string {
  if (!brand) {
    return "Unknown";
  }

  return brand
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export function formatCardNumber(
  lastFourDigits?: string,
): string {
  if (!lastFourDigits?.trim()) {
    return "N/A";
  }

  return `•••• •••• •••• ${lastFourDigits
    .trim()
    .slice(-4)}`;
}

export function formatCardExpiry(
  month?: number,
  year?: number,
): string {
  if (
    month === undefined ||
    year === undefined ||
    Number.isNaN(month) ||
    Number.isNaN(year)
  ) {
    return "N/A";
  }

  const formattedMonth = String(month).padStart(
    2,
    "0",
  );

  const formattedYear = String(year).slice(-2);

  return `${formattedMonth}/${formattedYear}`;
}

export function formatPaymentAmount(
  amount?: number,
  currency = "NGN",
  locale?: string,
): string {
  if (
    amount === undefined ||
    amount === null ||
    Number.isNaN(amount)
  ) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toLocaleString(
      locale,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}`;
  }
}

export function formatRefundAmount(
  amount?: number,
  currency = "NGN",
  locale?: string,
): string {
  return formatPaymentAmount(
    amount,
    currency,
    locale,
  );
}

export function formatTransactionFee(
  amount?: number,
  currency = "NGN",
  locale?: string,
): string {
  return formatPaymentAmount(
    amount,
    currency,
    locale,
  );
}