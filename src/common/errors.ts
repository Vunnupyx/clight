import winston from 'winston';

export type TNorthBoundErrorTypes = 'STATUS_ERROR' | 'NOT_REGISTERED';
/**
 * Representation of a Northbound error.
 * Automatic log to winston.error()
 */
export class NorthBoundError extends Error {
  protected code: TNorthBoundErrorTypes | undefined;

  constructor(msg: string, code?: TNorthBoundErrorTypes) {
    super(msg);
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    // TODO: Maybe get from stacktrace
    winston.error(`${this.name}: ${msg}. ${code ? 'ErrorCode: ' + code : ''}`);
  }
}

export type TAdapterErrorTypes =
  | 'NO_INTERNET_CONNECTION'
  | 'INVALID_CREDENTIALS';

export class AdapterError extends NorthBoundError {
  constructor(
    msg: string,
    code?: TNorthBoundErrorTypes,
    public type: TAdapterErrorTypes | undefined = undefined
  ) {
    super(msg, code);
  }
}
