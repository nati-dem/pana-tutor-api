
export class AppError extends Error {
    private statusCode;
    private code;
    private isOperational;

    constructor(message, statusCode, code) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      this.code = code;
      // Error.captureStackTrace(this, this.constructor);
    }
}
