// import fs from 'fs';
import config from '../config';
import jsonStringify from 'safe-json-stringify';
import { createLogger, transports, format } from 'winston';

const timestampDefinition = { format: 'YYYY-MM-DDTHH:mm:ss.SSS Z' };

// Check if the logs directory exists, and create it if not
// const logDir = 'logs';

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

const logger = createLogger({
  level: 'info', // Set the default log level to info
  format: format.combine(format.timestamp(), format.json()), // Customize the log format
  transports: [
    // Log info messages to stdout
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()), // Customize the log format for info messages
    }),
    // Log error messages to stderr
    new transports.Console({
      level: 'error', // Set the log level for this transport to error
      format: format.combine(format.colorize(), format.simple()), // Customize the log format for error messages
    }),
  ],
});

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(format.timestamp(timestampDefinition), format.json()),
//   transports: [
//     new transports.File({ filename: 'logs/error.log', level: 'error', silent: process.env.NODE_ENV === 'test' }),
//     new transports.File({ filename: 'logs/combined.log', silent: process.env.NODE_ENV === 'test' })
//   ]
// });

const showLogs = config.get('showLogs');

if (showLogs) {

  // Reference: https://github.com/winstonjs/logform/blob/master/simple.js
  const customFormat = format.printf(({ level, message, _splat, timestamp, ...rest }) => {
    const stringifiedRest = jsonStringify(rest);

    return `${timestamp} ${level}: ${message} ${stringifiedRest === '{}' ? '' : stringifiedRest}`;
  });

  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.timestamp(timestampDefinition), customFormat)
    })
  );
}

export { logger };
