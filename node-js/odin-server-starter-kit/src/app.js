import http from 'http';

import api from './api';
import { disableScheduler, env, ip, mongo, port } from './config';
import express from './services/express';
import mongoose from './services/mongoose';
import * as scheduler from './services/scheduler';

const app = express(api);

const server = http.createServer(app);

mongoose.connect(
  mongo.uri,
  { useNewUrlParser: true }
);

setImmediate(() => {
  server.listen(port, ip, () => {
    logger.info(`\x1B[0;34mExpress:\x1B[0m Server listening on http://${ip}:${port}, in ${env} mode`);
  });
  if (!disableScheduler) {
    scheduler.start();
  }
});

export default app;
