import { ErrorMessage } from "../interfaces/ErrorMessage";

export abstract class AppError extends Error {
  statusCode: number = 500;
  errors: ErrorMessage[];
  constructor(error: ErrorMessage[] | ErrorMessage | string) {
    super('ApplicationError');
    if (Array.isArray(error)) {
      this.errors = error;
    } else if(typeof error === 'string') {
      this.errors = [{
        message: error
      }]
    } else {
      this.errors = [error];
    }
  }
}
