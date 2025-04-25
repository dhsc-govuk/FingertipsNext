/* eslint-disable no-console */
export class Logger {
  static LOG_LEVEL_DEBUG = 3;

  static LOG_LEVEL_INFO = 2;

  static LOG_LEVEL_ERROR = 1;

  static LOG_LEVEL_DEFAULT = Logger.LOG_LEVEL_DEBUG;

  public logLevel: number = Logger.LOG_LEVEL_INFO;

  private shouldLogThisLevel(level: number): boolean {
    return level <= this.logLevel;
  }

  constructor(logLevel?: number) {
    if (logLevel) {
      this.logLevel = +logLevel;
    } else {
      this.logLevel = Logger.LOG_LEVEL_DEFAULT;
    }
  }

  info(message: string) {
    if (this.shouldLogThisLevel(Logger.LOG_LEVEL_INFO)) {
      console.log(message);
    }
  }

  debug(message: string) {
    if (this.shouldLogThisLevel(Logger.LOG_LEVEL_DEBUG)) {
      console.log(message);
    }
  }

  error(message: string) {
    if (this.shouldLogThisLevel(Logger.LOG_LEVEL_ERROR)) {
      console.log(message);
    }
  }
}
