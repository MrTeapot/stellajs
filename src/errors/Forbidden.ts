import { AppError } from "./AppError";

export class Forbidden extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "forbidden-error";
    this.statusCode = 403;
  }
}
