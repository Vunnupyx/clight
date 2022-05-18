import winston from 'winston';
/**
 * Representation of a Northbound error.
 * Automatic log to winston.error()
 */
export class NorthBoundError extends Error {
  protected code: string;

  constructor(
    msg: string,
    code?: string,
  ) {
    super(msg);
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    // TODO: Maybe get from stacktrace
    winston.error(
      `${this.name}: ${msg}. ${code ? 'ErrorCode: ' + code : ''}`
    );
  }
}

export type TAdapterErrorTypes = 'NO_INTERNET_CONNECTION' | 'INVALID_CREDENTIALS'

export class AdapterError extends NorthBoundError {
  constructor(msg, code?, public type: TAdapterErrorTypes = undefined) {
    super(msg, code)
  }
}

export class LicenseError extends Error {
  constructor(msg: string, public code?: string) {
    super(msg)
  }
}
