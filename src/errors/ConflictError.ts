import DomainError from './DomainError';

export class ConflictError extends DomainError {
  protected httpCode = 409;
  protected error_name = 'conflict';

  public constructor(
    message = 'Request could not be completed due to a conflict with the current state of the target resource',
    error?: Error,
    data?: any
  ) {
    super(message, error, data, false);
    Error.captureStackTrace(this, this.constructor);
  }
}
