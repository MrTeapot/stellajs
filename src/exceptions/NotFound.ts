import { AppError } from './AppError';

export class NotFound extends AppError {
  statusCode = 404;

  constructor(message?: string) {
    super(message || 'Resource not found');
  }

}
