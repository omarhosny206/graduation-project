import Joi from 'joi';
import { InterviewType } from '../enums/interview-type-enum';

const interviewTypeQueryStringSchema: Joi.ObjectSchema = Joi.object({
  type: Joi.string().valid(InterviewType.Had, InterviewType.Made).required(),
});

export default interviewTypeQueryStringSchema;
