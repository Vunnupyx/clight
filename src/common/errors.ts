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

export class AdapterError extends NorthBoundError {} // TODO:
