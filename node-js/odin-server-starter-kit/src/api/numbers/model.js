import { getValidationSchema, ModelGenerator } from '@becodebg/odin-generators';
import mongoose from 'mongoose';

const mongooseSchema =
  /**
   * @api {js} labels Schema
   * @apiGroup Label
   * @apiName Schema
   * @apiExample {js} Entity schema: */
  {
    number:{
      type:Number
    }
  };
/* **/

const model = ModelGenerator(mongoose)({
  schema: mongooseSchema,
  collectionName: 'numbers',
  modelName: 'Number',
  populationOptions: []
});

export const schema = model.schema;
export const bodymenSchema = getValidationSchema(mongooseSchema);

export default model;
