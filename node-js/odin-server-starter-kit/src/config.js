/* eslint-disable no-unused-vars */
import { capitalize, merge } from 'lodash';
import os from 'os';
import path from 'path';

global.Promise = require('bluebird');
global.logger = require('winston');
global._ = require('lodash');
/* istanbul ignore next */
const requireProcessEnv = name => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe');
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  });
}

const APP_NAME = requireProcessEnv('APP_NAME');

const config = {
  all: {
    appName: capitalize(APP_NAME),
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    hostname: os.hostname || '',
    ip: process.env.IP || '0.0.0.0',
    defaultEmail: `no-reply@${APP_NAME}.com`,
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    expressSSLRedirect: false,
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    accessKeyId: requireProcessEnv('ACCESS_KEY_ID'),
    secretAccessKey: requireProcessEnv('SECRET_ACCESS_KEY'),
    s3BucketName: requireProcessEnv('S3_BUCKET_NAME'),
    firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG || false),
    firebaseSDK: JSON.parse(process.env.FIREBASE_SDK || false),
    pushNotificationEnabled: process.env.PUSH_NOTIFICATION_ENABLED === 'true' || false,
    disableScheduler: !!process.env.DISABLE_SCHEDULER || false,
    mongo: {
      options: {
        useUnifiedTopology: true
      }
    }
  },
  test: {
    mongo: {
      uri: `mongodb://localhost/${APP_NAME}-test`,
      options: {
        debug: false
      }
    }
  },
  development: {
    mongo: {
      uri: process.env.MONGODB_URI || `mongodb://localhost/${APP_NAME}-dev`,
      options: {
        debug: true,
        useUnifiedTopology: true
      }
    }
  },
  production: {
    ip: process.env.IP,
    port: process.env.PORT || 8080,
    expressSSLRedirect: process.env.DISABLE_SSL_REDIRECT !== 'true',
    mongo: {
      uri: process.env.MONGODB_URI || `mongodb://localhost/${APP_NAME}`
    }
  }
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
