import DomainError from './DomainError';

export class InternalServerError extends DomainError {
  protected httpCode = 500;
  protected error_name = 'internalServerError';

  public constructor(message = 'Something went wrong, please try again. Reach out to us if issue persists', error?: Error, data?: any) {
    super(message, error, data, false);
    Error.captureStackTrace(this, this.constructor);
  }
}
