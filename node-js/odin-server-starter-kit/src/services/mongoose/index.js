import mongoose from 'mongoose';

import { mongo } from '../../config';

Object.keys(mongo.options).forEach(key => {
  if (key === 'debug' && mongo.options[key]) {
    mongoose.set('debug', winstonMongooseLogger);
  } else {
    mongoose.set(key, mongo.options[key]);
  }
});

function winstonMongooseLogger(name, i) {
  let moduleName = '\x1B[0;36mMongoose:\x1B[0m ';
  let functionCall = [name, i].join('.');
  let _args = [];
  for (let j = arguments.length - 1; j >= 2; --j) {
    _args.unshift(JSON.stringify(arguments[j]));
  }
  let params = '(' + _args.join(', ') + ')';

  logger.info(moduleName + functionCall + params);
}

mongoose.Promise = Promise;

/* istanbul ignore next */
mongoose.Types.ObjectId.prototype.view = function() {
  return { id: this.toString() };
};

/* istanbul ignore next */
mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Fix 'DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.' - see https://github.com/Automattic/mongoose/issues/6890
mongoose.set('useCreateIndex', true);

export default mongoose;
