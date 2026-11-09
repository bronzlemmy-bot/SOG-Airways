export function formatNumber(
  value?: number,
  locale?: string,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return value.toLocaleString(locale);
}

export function formatInteger(
  value?: number,
  locale?: string,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return Math.round(value).toLocaleString(locale);
}

export function formatDecimal(
  value?: number,
  decimals = 2,
  locale?: string,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercentage(
  value?: number,
  decimals = 0,
  locale?: string,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return `${value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatCompactNumber(
  value?: number,
  locale?: string,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSignedNumber(
  value?: number,
  locale?: string,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return new Intl.NumberFormat(locale, {
    signDisplay: "always",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCount(
  value?: number,
  singular = "item",
  plural = "items",
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return `0 ${plural}`;
  }

  return `${value.toLocaleString()} ${
    value === 1 ? singular : plural
  }`;
}