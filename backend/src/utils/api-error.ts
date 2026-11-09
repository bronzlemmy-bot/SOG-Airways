
export interface ApiErrorOptions {
  code?: string;
  details?: unknown;
  isOperational?: boolean;
  cause?: unknown;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    options: ApiErrorOptions = {},
  ) {
    super(
      message,
      options.cause !== undefined
        ? { cause: options.cause }
        : undefined,
    );

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = options.code ?? "INTERNAL_SERVER_ERROR";
    this.details = options.details;
    this.isOperational = options.isOperational ?? statusCode < 500;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
