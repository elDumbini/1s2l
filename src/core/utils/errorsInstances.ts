import { HTTP_STATUSES } from "../types/types";

export class AppError extends Error {
  public readonly originalError?: Error;

  constructor(
    public message: string,
    public statusCode: number = 500,
    public field?: string,
    originalError?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError ?? new Error();

    if (originalError?.stack) {
      this.stack = `${this.stack}\n${originalError.stack}`;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database error", originalError?: Error) {
    super(
      message,
      HTTP_STATUSES.INTERNAL_SERVER_ERROR,
      undefined,
      originalError
    );
  }
}
export class ServiceError extends AppError {
  constructor(message: string = "Service error", originalError?: Error) {
    super(
      message,
      HTTP_STATUSES.INTERNAL_SERVER_ERROR,
      undefined,
      originalError
    );
  }
}
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", field?: string) {
    super(message, HTTP_STATUSES.NOT_FOUND, field);
  }
}
