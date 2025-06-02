export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly field?: string;

  constructor(
    message: string,
    statusCode: number,
    options: { code?: string; field?: string } = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.code = options.code;
    this.field = options.field;

    Error.captureStackTrace(this, this.constructor);
  }
}
