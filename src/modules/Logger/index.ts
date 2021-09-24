import winston from 'winston';
import path from 'path';

/**
 * Initializes settings for winston logger
 */
export class Logger {
  /**
   * Initializes the settings for winston
   */
  public static init() {
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
    const file = new winston.transports.File({
      maxFiles: 5,
      handleExceptions: true,
      filename: path.join(__dirname, '../../../mdclight/logs/MDClight.log'),
      maxsize: 10 * 1000 * 1000, // 10 Mb
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    });
    winston.add(console);
    winston.add(file);
  }
}
