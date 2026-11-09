function parseTime(
  time?: string | Date,
): Date | null {
  if (!time) {
    return null;
  }

  if (time instanceof Date) {
    return Number.isNaN(time.getTime())
      ? null
      : time;
  }

  const parsedDate = new Date(time);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  const timeMatch = time
    .trim()
    .match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
    );

  if (!timeMatch) {
    return null;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const seconds = Number(timeMatch[3] || 0);
  const period = timeMatch[4]?.toUpperCase();

  if (
    minutes > 59 ||
    seconds > 59 ||
    hours > 23
  ) {
    return null;
  }

  if (period === "PM" && hours < 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date();
  result.setHours(hours, minutes, seconds, 0);

  return result;
}

export function formatTime(
  time?: string | Date,
  locale?: string,
): string {
  const parsedTime = parseTime(time);

  if (!parsedTime) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedTime);
}

export function formatTimeWithSeconds(
  time?: string | Date,
  locale?: string,
): string {
  const parsedTime = parseTime(time);

  if (!parsedTime) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsedTime);
}

export function formatTime24Hour(
  time?: string | Date,
): string {
  const parsedTime = parseTime(time);

  if (!parsedTime) {
    return "N/A";
  }

  const hours = String(
    parsedTime.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    parsedTime.getMinutes(),
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function formatTime12Hour(
  time?: string | Date,
): string {
  const parsedTime = parseTime(time);

  if (!parsedTime) {
    return "N/A";
  }

  let hours = parsedTime.getHours();
  const minutes = String(
    parsedTime.getMinutes(),
  ).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

export function formatDuration(
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
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export function formatTimeDifference(
  startTime?: string | Date,
  endTime?: string | Date,
): string {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (!start || !end) {
    return "N/A";
  }

  let difference =
    end.getTime() - start.getTime();

  if (difference < 0) {
    difference += 24 * 60 * 60 * 1000;
  }

  const totalMinutes = Math.floor(
    difference / (60 * 1000),
  );

  return formatDuration(totalMinutes);
}