import DomainError from './DomainError';

export class BadRequestError extends DomainError {
  protected httpCode = 400;
  protected errResponse = {};
  protected error_name = 'badRequest';

  public constructor(message = 'Invalid request data', error?: Error, data?: any) {
    super(message, error, data, false);
    Error.captureStackTrace(this, this.constructor);
  }
}
