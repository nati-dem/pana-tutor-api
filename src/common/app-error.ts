
export class AppError extends Error {
    private httpStatus: number;
    private code: string;
    private detail: any;

    constructor(httpStatus, message, code, detail) {
      super(message);
      this.httpStatus = httpStatus;
      this.detail = detail;
      this.code = code;
      // Error.captureStackTrace(this, this.constructor);
    }
}
