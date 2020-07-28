import { AppError } from './AppError';

export class BadInput extends AppError {
  errors: any[];
  constructor(errorBag: InputError[] | InputError) {
    super('Bad input');
    this.name = 'bad-input';

    if (Array.isArray(errorBag)) {
      this.errors = errorBag;
    } else {
      this.errors = [errorBag];
    }

    this.statusCode = 400;
  }
}

export interface InputError {
  field?: string;
  message: string;
}
