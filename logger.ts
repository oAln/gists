import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

/**
 * @description Logger service for environment logging.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    LOG: 4
  };

  public debug(...message): void {
    this.writeToLog(this.LogLevel.DEBUG, 'DEBUG', ...message);
  }

  public info(...message) {
    this.writeToLog(this.LogLevel.INFO, 'INFO', ...message);
  }

  public warn(...message) {
    this.writeToLog(this.LogLevel.WARN, 'WARN', ...message);
  }

  public error(...message) {
    this.writeToLog(this.LogLevel.ERROR, 'ERROR', ...message);
  }

  public log(...message) {
    this.writeToLog(this.LogLevel.LOG, 'LOG', ...message);
  }

  /**
   * Should write the log?
   */
  private shouldLog(): boolean {
    return environment.debug;
  }

  /**
   * Write logs.
   */
  private async writeToLog(level, type, ...message) {
    if (this.shouldLog() === true) {
      if (level === this.LogLevel.DEBUG) {
        logger.debug(this.getLogDate(), type, ...message);
      } else if (level === this.LogLevel.INFO) {
        logger.info(this.getLogDate(), type, ...message);
      } else if (level === this.LogLevel.WARN) {
        logger.info(this.getLogDate(), type, ...message);
      } else if (level === this.LogLevel.ERROR) {
        logger.error(this.getLogDate(), type, ...message);
      } else if (level === this.LogLevel.LOG) {
        logger.info(this.getLogDate(), type, ...message);
      }
    }
  }

  /**
   * To add the date on logs.
   */
  private getLogDate(): string {
    const date = new Date();
    return (
      '[' +
      date.getUTCFullYear() +
      '/' +
      (date.getUTCMonth() + 1) +
      '/' +
      date.getUTCDate() +
      ' ' +
      date.getUTCHours() +
      ':' +
      date.getUTCMinutes() +
      ':' +
      date.getUTCSeconds() +
      '.' +
      date.getMilliseconds() +
      ']'
    );
  }
}
