import logger, { format, transports } from 'winston';
import winstonExpress from 'express-winston';

logger.configure({
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      colorize: true,
      timestamp: true,
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.colorize(),
        format.metadata(),
        format.printf((info) => {
          return `${info.metadata.timestamp} ${info.level}:${info.metadata.section ? ` ${info.metadata.section}` : ''} ${_.isString(info.message) ? info.message : JSON.stringify(info.message)
            }. ${info.metadata.stack ? '\n' + info.metadata.stack : ''}`;
        })
      )
    })
  ]
});

logger._odinError = logger.error;
logger.error = (err) => {
  if (err instanceof Error) {
    logger._odinError(JSON.stringify(err.message), err);
  } else {
    logger._odinError(err);
  }
};

export const expressLogger = winstonExpress.logger({
  winstonInstance: logger, // TODO: log errors explicitly
  msg:
    '{{req.method}} {{res.statusCode}} {{res.responseTime}}ms user:{{req.user?req.user._id:"Anonymous"}} {{req.url.split("?")[0]}}',
  colorize: true
});

export const expressErrorLogger = winstonExpress.errorLogger({
  winstonInstance: logger, // TODO: log errors explicitly
  msg:
    '{{req.method}} {{res.statusCode}} {{res.responseTime}}ms user:{{req.user?req.user._id:"Anonymous"}} {{req.url.split("?")[0]}} body:{{JSON.stringify(req.body)}}',
  colorize: true,
  meta: false
});

export default logger;
