import Joi from 'joi';

import IInterviewInfo from '../interfaces/interviews/interview-info-interface';
import IReview from '../interfaces/interviews/review-interface';

const interviewInfoSchema: Joi.ObjectSchema<IInterviewInfo> = Joi.object<IInterviewInfo>({
  title: Joi.string().required(),
  summary: Joi.string().required(),
  tags: Joi.array().items(Joi.string().required()).required(),
  youtubeUrl: Joi.string(),
});

export default interviewInfoSchema;
