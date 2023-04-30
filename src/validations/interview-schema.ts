import Joi from 'joi';

import IInterview from '../interfaces/interviews/interview-interface';

const interviewSchema: Joi.ObjectSchema<IInterview> = Joi.object<IInterview>({
  interviewee: Joi.string().required(),
  interviewer: Joi.string().required(),
  date: Joi.date().greater('now').required(),
});

export default interviewSchema;
