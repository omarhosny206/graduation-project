import Joi from 'joi';

import IInterview from '../interfaces/interviews/interview-interface';

const interviewSchema: Joi.ObjectSchema<IInterview> = Joi.object<IInterview>({
  interviewee: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("interviewee is not a valid objectid").required(),
  interviewer: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("interviewer is not a valid objectid").required(),
  date: Joi.date().greater('now').required(),
});

export default interviewSchema;
