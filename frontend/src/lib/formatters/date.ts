function parseDate(
  date?: string | Date,
): Date | null {
  if (!date) {
    return null;
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function formatDate(
  date?: string | Date,
  locale?: string,
): string {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function formatDateLong(
  date?: string | Date,
  locale?: string,
): string {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export function formatDateShort(
  date?: string | Date,
  locale?: string,
): string {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function formatDateTime(
  date?: string | Date,
  locale?: string,
): string {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export function formatDateInput(
  date?: string | Date,
): string {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(
    parsedDate.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    parsedDate.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isValidDate(
  date?: string | Date,
): boolean {
  return parseDate(date) !== null;
}

export function isDateToday(
  date?: string | Date,
): boolean {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return false;
  }

  const today = new Date();

  return (
    parsedDate.getFullYear() === today.getFullYear() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getDate() === today.getDate()
  );
}