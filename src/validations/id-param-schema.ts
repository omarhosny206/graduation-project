import Joi from 'joi';

const idParamSchema = Joi.object({
  _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("_id is not a valid objectid").required(),
});

export default idParamSchema;
