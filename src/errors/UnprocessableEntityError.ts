import DomainError from './DomainError';

export class UnprocessableEntityError extends DomainError {
  protected httpCode = 422;
  protected error_name = 'unprocessableEntity';

  public constructor(message = 'Unable to process the contained instructions. Please try again', error?: Error, data?: any) {
    super(message, error, data, false);
    Error.captureStackTrace(this, this.constructor);
  }
}
