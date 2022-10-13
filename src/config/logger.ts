import winston from 'winston';

const { combine, timestamp, colorize, printf } = winston.format;
const format = combine(
  colorize(),
  timestamp(),
  printf(info => `${info.timestamp} :: ${info.message}`)
);

const logger = winston.createLogger({
  level: 'info',
  format,
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 3,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 3,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
  exitOnError: false,
});

export default logger;
