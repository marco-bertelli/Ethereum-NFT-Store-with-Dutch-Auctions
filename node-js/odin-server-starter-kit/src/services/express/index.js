import { errorHandler as bodyErrorHandler } from '@becodebg/chocomen';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import forceSSL from 'express-force-ssl';
import { errorHandler as queryErrorHandler } from 'querymen';

import { env, expressSSLRedirect } from '../../config';

import logger, { expressLogger, expressErrorLogger } from '../logger';

export default routes => {
  const app = express();

  /* istanbul ignore next */
  if (env === 'production' && expressSSLRedirect) {
    logger.info('\x1B[0;34mExpress:\x1B[0m SSL redirect is ENABLED');
    app.set('forceSSLOptions', {
      enable301Redirects: false,
      trustXFPHeader: true
    });
    app.use(forceSSL);
  } else {
    logger.info('\x1B[0;34mExpress:\x1B[0m SSL redirect is DISABLED');
  }

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors());
    app.use(compression());
    app.use(expressLogger);
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(routes);
  app.use(expressErrorLogger);
  app.use(queryErrorHandler());
  app.use(bodyErrorHandler());
  app.use(genericErrorHandler);

  return app;
};

/* eslint-disable no-unused-vars */
const genericErrorHandler = (err, req, res, next) => {
  logger.error(err);
  if (req.querymen && req.querymen.error) {
    res.status(400).json({ error: req.querymen.error });
  } else if (req.bodymen && req.bodymen.error) {
    res.status(400).json({ error: req.bodymen.error });
  } else if (err.errors) {
    // mongoose validation
    res.status(400).json({
      error: {
        valid: false,
        param: Object.keys(err.errors).join(','),
        message: err.message
      }
    });
  } else {
    res.status(400).json({ error: err.message ? err.message : `Undefined error: ${err}` });
  }
};
