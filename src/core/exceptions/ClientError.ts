import { AppError } from './AppError';

export class ClientError extends AppError {
  statusCode = 400;
}