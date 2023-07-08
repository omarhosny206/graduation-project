import Joi from 'joi';

const captureOrderSchema = Joi.object({
  interviewId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("interviewId is not a valid objectid").required(),
});

export default captureOrderSchema;
