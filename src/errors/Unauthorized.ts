import { AppError } from "./AppError";

export class Unauthorized extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "authentication-error";
    this.statusCode = 401;
  }
}
