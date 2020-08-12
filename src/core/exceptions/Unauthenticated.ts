import { AppError } from "./AppError";

export class Unauthenticated extends AppError {
  statusCode = 401;
  constructor() {
    super('You are not authenticated');
  }
}
