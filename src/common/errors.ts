import winston from 'winston';
/**
 * Representation of a Northbound error.
 * Automatic log to winston.error()
 */
export class NorthBoundError extends Error {
  //TODO: Implement
  protected code: string;
  protected className: string;
  protected methodName: string;

  constructor(
    msg: string,
    code?: string,
    className?: string,
    methodName?: string
  ) {
    super(msg);
    this.code = code;
    this.className = className;
    this.methodName = methodName;
    // TODO: Maybe get from stacktrace
    winston.error(
      `${className ? className + '::' : ''}${
        methodName ?? ''
      } error due to ${msg}. ${code ? 'ErrorCode: ' + code : ''}`
    );
  }
}

export class AdapterError extends NorthBoundError {} // TODO:
