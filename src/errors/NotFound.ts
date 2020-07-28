import { AppError } from './AppError';

export class NotFound extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = 404;
  }
}
