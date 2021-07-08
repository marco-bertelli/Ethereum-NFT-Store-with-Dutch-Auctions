import { ModelGenerator, getValidationSchema } from '@becodebg/odin-generators';
import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';

import { env } from '../../config';

const roles = ['app-user', 'admin'];

export const deviceBodymenSchema =
/**
 * @api {js} device DeviceSchema
 * @apiGroup User
 * @apiName DeviceSchema
 * @apiExample {js} Entity schema: */
{
  os: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
};
/* **/

const deviceSchema = new Schema(deviceBodymenSchema, {
  _id: false,
  id: false
});

let mongooseSchema =
/**
 * @api {js} users Schema
 * @apiName Schema
 * @apiGroup User
 * @apiExample {js} Entity schema: */
{
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    odinFrozenAfterCreation: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: roles,
    default: 'app-user',
    odinFrozenAfterCreation: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  socialToken: {
    type: String
  },
  idToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  expireToken: {
    type: String
  },
  name: {
    type: String
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  last_login: {
    // last real login
    type: Date
  },
  pre_last_login: {
    // last login showed to the user
    type: Date
  },
  devices: {
    type: [deviceSchema],
    default: []
  }
};
/* **/

const model = ModelGenerator(mongoose)({
  schema: mongooseSchema,
  collectionName: 'users',
  modelName: 'User',
  populationOptions: [],
  extensionFunction: schema => {
    schema.pre('save', function (next) {
      if (!this.isModified('password')) {
        return next();
      }

      /* istanbul ignore next */
      const rounds = env === 'test' ? 1 : 9;

      bcrypt
        .hash(this.password, rounds)
        .then(hash => {
          this.password = hash;
          next();
        })
        .catch(next);
    });

    schema.methods.authenticate = function (password) {
      return Promise.resolve(bcrypt.compare(password, this.password))
        .bind(this)
        .then(valid => (valid ? this : false));
    };

    schema.statics = {
      roles
    };
  }
});

export const schema = model.schema;
export const bodymenSchema = getValidationSchema(mongooseSchema);

export default model;
