
type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const priorities: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = process.env.LOG_LEVEL?.toLowerCase();

const minimumLevel: LogLevel =
  configuredLevel &&
  Object.prototype.hasOwnProperty.call(priorities, configuredLevel)
    ? (configuredLevel as LogLevel)
    : process.env.NODE_ENV === "production"
      ? "info"
      : "debug";

const serviceName = "SOG Airways API";

function normalizeContext(
  context?: LogContext,
): Record<string, unknown> | undefined {
  if (!context) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      if (value instanceof Error) {
        return [
          key,
          {
            name: value.name,
            message: value.message,
            stack:
              process.env.NODE_ENV === "production"
                ? undefined
                : value.stack,
          },
        ];
      }

      return [key, value];
    }),
  );
}

function writeLog(
  level: LogLevel,
  message: string,
  context?: LogContext,
): void {
  if (priorities[level] < priorities[minimumLevel]) {
    return;
  }

  const timestamp = new Date().toISOString();
  const metadata = normalizeContext(context);

  if (process.env.NODE_ENV === "production") {
    const entry = {
      timestamp,
      level,
      service: serviceName,
      message,
      ...(metadata ? { context: metadata } : {}),
    };

    console.log(JSON.stringify(entry));
    return;
  }

  const prefix = `[${timestamp}] ${level.toUpperCase()} [${serviceName}]`;

  switch (level) {
    case "debug":
      console.debug(prefix, message, ...(metadata ? [metadata] : []));
      break;

    case "info":
      console.info(prefix, message, ...(metadata ? [metadata] : []));
      break;

    case "warn":
      console.warn(prefix, message, ...(metadata ? [metadata] : []));
      break;

    case "error":
      console.error(prefix, message, ...(metadata ? [metadata] : []));
      break;
  }
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    writeLog("debug", message, context);
  },

  info(message: string, context?: LogContext): void {
    writeLog("info", message, context);
  },

  warn(message: string, context?: LogContext): void {
    writeLog("warn", message, context);
  },

  error(message: string, context?: LogContext): void {
    writeLog("error", message, context);
  },
};
