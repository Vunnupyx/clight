import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

/**
 * Initializes settings for winston logger
 */
export class Logger {
  private static initialized = false;

  /**
   * Initializes the settings for winston
   */
  public static init() {
    if (this.initialized) return;

    winston.addColors({
      info: 'bold blue',
      warn: 'italic yellow',
      error: 'bold red',
      debug: 'green'
    });

    const console = new winston.transports.Console({
      stderrLevels: ['error'],
      handleExceptions: true,
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.colorize({
          all: true
        }),
        winston.format.timestamp({
          format: 'YY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(
          (msg) =>
            `${msg.timestamp} - ${msg.level}${
              msg.source ? ' (' + msg.source + ')' : ''
            }: ${msg.message}`
        )
      )
    });

    const options: DailyRotateFileTransportOptions = {
      maxFiles: 5,
      maxSize: '10m',
      handleExceptions: true,
      handleRejections: true,
      filename:
        process.env.NODE_ENV === 'development'
          ? path.join(__dirname, '../../../mdclight/logs')
          : '/etc/mdc-light/logs',
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      extension: '.log'
    };
    const file = new winston.transports.DailyRotateFile(options);

    winston.add(console);
    winston.add(file);

    this.initialized = true;
  }
}
