import winston from 'winston';
import { ValidationError } from './errors.helper';

interface LogEntry {
  message: string;
  level: string;
  timestamp: string;
  [key: string]: string;
}

interface CustomLevels extends winston.config.AbstractConfigSetLevels {
  success: number;
}

interface CustomLogger extends winston.Logger {
  success(message: string, ...meta: any[]): CustomLogger;
}

const customLevels: CustomLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
  success: 8
};

const customColors = {
  emerg: 'red bold',
  alert: 'magenta bold',
  crit: 'red',
  error: 'red',
  warning: 'yellow',
  notice: 'cyan',
  info: 'blue',
  debug: 'gray',
  success: 'green'
};

winston.addColors(customColors);

const logger = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/activities.log',
      level: 'success',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/critical.log',
      level: 'warn',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.Console({
      level: 'success',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
  ],
}) as CustomLogger;

export default logger;

export const formatLog = (entry: string): LogEntry => {
  try {
    const cleanedEntry = entry?.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

    const obj: LogEntry = {
      message: '',
      level: '',
      timestamp: '',
    };

    const regex = /(\w+):\s*'([^']*)'/g;
    let match;

    while ((match = regex.exec(String(cleanedEntry))) !== null) {
      obj[match[1]] = match[2];
    }

    return obj;
  } catch (err) {
    throw new ValidationError(err as string);
  }
};
