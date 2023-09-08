import DomainError from './DomainError';

export class ResourceNotFoundError extends DomainError {
  protected httpCode = 404;
  protected error_name = 'notFound';

  public constructor(message = 'Resource not found', error?: Error, data?: any) {
    super(message, error, data, false);
    Error.captureStackTrace(this, this.constructor);
  }
}
