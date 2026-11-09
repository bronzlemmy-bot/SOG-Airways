export function isNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function isInteger(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value)
  );
}

export function toNumber(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallback;
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : fallback;
  }

  return fallback;
}

export function toInteger(
  value: unknown,
  fallback = 0,
): number {
  const number = toNumber(
    value,
    fallback,
  );

  return Number.isFinite(number)
    ? Math.round(number)
    : fallback;
}

export function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  if (minimum > maximum) {
    return clamp(
      value,
      maximum,
      minimum,
    );
  }

  return Math.min(
    Math.max(value, minimum),
    maximum,
  );
}

export function roundTo(
  value: number,
  decimals = 2,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const safeDecimals = Math.max(
    0,
    Math.floor(decimals),
  );

  const multiplier =
    10 ** safeDecimals;

  return (
    Math.round(
      (value + Number.EPSILON) *
        multiplier,
    ) / multiplier
  );
}

export function percentageOf(
  value: number,
  total: number,
): number {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(total) ||
    total === 0
  ) {
    return 0;
  }

  return (value / total) * 100;
}

export function calculatePercentage(
  percentage: number,
  total: number,
): number {
  if (
    !Number.isFinite(percentage) ||
    !Number.isFinite(total)
  ) {
    return 0;
  }

  return (percentage / 100) * total;
}

export function sumNumbers(
  values: number[],
): number {
  return values.reduce(
    (total, value) =>
      total +
      (Number.isFinite(value)
        ? value
        : 0),
    0,
  );
}

export function average(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    sumNumbers(values) /
    values.length
  );
}

export function minNumber(
  values: number[],
): number | undefined {
  const validValues =
    values.filter(Number.isFinite);

  return validValues.length > 0
    ? Math.min(...validValues)
    : undefined;
}

export function maxNumber(
  values: number[],
): number | undefined {
  const validValues =
    values.filter(Number.isFinite);

  return validValues.length > 0
    ? Math.max(...validValues)
    : undefined;
}

export function randomNumber(
  minimum: number,
  maximum: number,
): number {
  if (
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum)
  ) {
    return 0;
  }

  const min = Math.ceil(
    Math.min(minimum, maximum),
  );

  const max = Math.floor(
    Math.max(minimum, maximum),
  );

  return (
    Math.floor(
      Math.random() *
        (max - min + 1),
    ) + min
  );
}

export function formatNumber(
  value: number,
  locale?: string,
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString(locale);
}

export function formatDecimal(
  value: number,
  decimals = 2,
  locale?: string,
): string {
  if (!Number.isFinite(value)) {
    return "0.00";
  }

  const safeDecimals = Math.max(
    0,
    Math.floor(decimals),
  );

  return value.toLocaleString(
    locale,
    {
      minimumFractionDigits:
        safeDecimals,
      maximumFractionDigits:
        safeDecimals,
    },
  );
}