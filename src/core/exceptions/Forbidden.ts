import { AppError } from "./AppError";

export class Forbidden extends AppError {
  statusCode = 403;
  constructor() {
    super('You are unauthorized')
  }
}