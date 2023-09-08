export default class DomainError extends Error {
  protected error_name = 'domainError';
  
  protected success: boolean;
  
  protected internal: Error | undefined;
  
  protected httpCode = 500;
  
  protected data: object;
  
  public constructor(message: string, error?: Error, data: object = [], success = false) {
    super(message);
    this.internal = error;
    this.data = data;
    this.success = success;
  }
  
  public getStatus(): boolean {
    return this.success;
  }
  
  public getInternalError(): Error | undefined {
    return this.internal;
  }
  
  public getHttpCode(): number {
    return this.httpCode;
  }
  
  public getData(): object {
    return this.data;
  }
  
  public getName(): string {
    return this.error_name;
  }
}
  