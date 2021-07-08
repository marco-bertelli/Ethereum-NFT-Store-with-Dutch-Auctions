import { EventEmitter } from 'events';

import { mongo } from '../src/config';
import mongoose from '../src/services/mongoose';

EventEmitter.defaultMaxListeners = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

global.Array = Array;
global.Date = Date;
global.Function = Function;
global.Math = Math;
global.Number = Number;
global.Object = Object;
global.RegExp = RegExp;
global.String = String;
global.Uint8Array = Uint8Array;
global.WeakMap = WeakMap;
global.Set = Set;
global.Error = Error;
global.TypeError = TypeError;
global.parseInt = parseInt;
global.parseFloat = parseFloat;

beforeAll(done => {
  mongoose.connect(mongo.uri).then(() => {
    done();
  });
});

afterAll(done => {
  mongoose.disconnect();
  done();
});

afterEach(async done => {
  const { collections } = mongoose.connection;
  const promises = [];
  Object.keys(collections).forEach(collection => {
    promises.push(collections[collection].remove());
  });
  await Promise.all(promises);
  done();
});
