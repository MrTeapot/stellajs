import { AppError } from "../../../../src/exceptions";

export class HelloException extends AppError {
  statusCode = 400;
  constructor() {
    super('There was a HelloException');
  }
}