import { ModelGenerator, getValidationSchema } from '@becodebg/odin-generators';
import mongoose, { Schema } from 'mongoose';

const notificationTypes = ['test'];

let mongooseSchema =
/**
 * @api {js} notification Schema
 * @apiGroup Notifications
 * @apiName Schema
 * @apiExample {js} Entity schema: */
{
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  targetUser: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  },
  event: {
    type: String,
    enum: notificationTypes
  },
  type: {
    type: String,
    default: 'pushNotification',
    enum: ['pushNotification']
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  data: {
    type: Object
  }
};
/* **/

const model = ModelGenerator(mongoose)({
  schema: mongooseSchema,
  collectionName: 'notifications',
  modelName: 'Notification',
  populationOptions: [
    {
      path: 'created_by',
      select: '-password'
    },
    {
      path: 'targetUser',
      select: '-password'
    }
  ],
  extensionFunction: schema => {
    schema.statics.getUnsentPushNotifications = function () {
      return this.find({ sent: false, type: 'pushNotification' }).catch(e => {
        // console.error(e);
        throw e;
      });
    };
    schema.statics.getUnsentNotifications = function () {
      return this.find({ sent: false }).catch(e => {
        logger.error(e);
        throw e;
      });
    };

    schema.methods.getMessage = function () {
      return this.view().then(element => {
        switch (element.event) {
          case 'test':
            return {
              title: element.title,
              body: element.body,
              data: element.data
            };
          default:
            return 'You have new notifications';
        }
      });
    };

    schema.methods.markSent = function () {
      return this.view().then(() => {
        this.sent = true;
        return this.save();
      });
    };
  }
});

export const schema = model.schema;
export const bodymenSchema = getValidationSchema(mongooseSchema);

export default model;
