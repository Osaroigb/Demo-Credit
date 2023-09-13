import DomainError from './DomainError';

export class BadRequestError extends DomainError {
  protected error_name = 'badRequest';

  public constructor(message = 'Invalid request data', error?: Error, data?: any) {
    super(message, error, data, false);

    // Check if the error object contains an httpCode property and use it if available
    if (error && typeof error === 'object' && 'httpCode' in error) {
      this.httpCode = error.httpCode as number;
    } else {
      // Default to 400 if httpCode is not provided in the error object
      this.httpCode = 400;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
