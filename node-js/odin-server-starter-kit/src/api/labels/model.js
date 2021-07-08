import { getValidationSchema, ModelGenerator } from '@becodebg/odin-generators';
import mongoose from 'mongoose';

const mongooseSchema =
  /**
   * @api {js} labels Schema
   * @apiGroup Label
   * @apiName Schema
   * @apiExample {js} Entity schema: */
  {
    category: {
      type: String,
      required: true
    },
    order: {
      type: Number
    },
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ['en', 'it']
    }
  };
/* **/

const model = ModelGenerator(mongoose)({
  schema: mongooseSchema,
  collectionName: 'labels',
  modelName: 'Label',
  populationOptions: []
});

export const schema = model.schema;
export const bodymenSchema = getValidationSchema(mongooseSchema);

export default model;
