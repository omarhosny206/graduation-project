import Joi from 'joi';

const interviewCreateOrderSchema = Joi.object({
  _id: Joi.string().required(),
});

export default interviewCreateOrderSchema;
