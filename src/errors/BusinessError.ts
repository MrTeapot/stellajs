import { AppError } from './AppError';
import { InputError } from './BadInput';

export class BusinessError extends AppError {
  errors: any[];
  constructor(error: InputError[] | InputError | string) {
    super('Business error');
    this.name = 'business-error';

    if (Array.isArray(error)) {
      this.errors = error;
    } else if (typeof error === 'string') {
      this.errors = [{
        message: error
      }]
    }

    else {
      this.errors = [error];
    }

    this.statusCode = 400;
  }
}
