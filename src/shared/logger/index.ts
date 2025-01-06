import Logger from '../../config/logger';

export interface logWrapper {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export class LoggerImpl implements logWrapper {
  private readonly logger = new Logger(LoggerImpl.name);

  public info(message: string, ...args: any[]) {
    this.logger.info(`${message} in ${args[0]}`);
  }

  public error(message: string, ...args: any[]) {
    this.logger.error(`Error: ${message} in ${args[0]}`);
  }
}

const logger = new LoggerImpl();
export default logger;
