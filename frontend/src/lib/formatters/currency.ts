export function formatCurrency(
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

export function formatCurrencyCode(
  currency?: string,
): string {
  return currency?.trim().toUpperCase() || "N/A";
}

export function formatCurrencyAmount(
  amount?: number,
  locale?: string,
): string {
  if (
    amount === undefined ||
    amount === null ||
    Number.isNaN(amount)
  ) {
    return "N/A";
  }

  return amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyCompact(
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
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return formatCurrency(amount, currency, locale);
  }
}

export function getCurrencySymbol(
  currency = "NGN",
  locale?: string,
): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);

    return (
      parts.find((part) => part.type === "currency")?.value ||
      currency.toUpperCase()
    );
  } catch {
    return currency.toUpperCase();
  }
}